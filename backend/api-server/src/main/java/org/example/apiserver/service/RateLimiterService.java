package org.example.apiserver.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RateLimiterService {
    private final RedisTemplate<String, String> redisTemplate;

    @Value("${app.rate-limit.requests-per-minute}")
    private int requestsPerMinute;

    /**
     * Check if the request is allowed based on rate limit
     * Uses sliding window algorithm with Redis
     */
    public boolean isAllowed(String identifier) {
        String key = "rate_limit:" + identifier;
        long currentTime = System.currentTimeMillis();
        long windowStart = currentTime - TimeUnit.MINUTES.toMillis(1);

        // Remove old entries outside the current window
        redisTemplate.opsForZSet().removeRangeByScore(key, 0, windowStart);

        // Get current count in the window
        Long currentCount = redisTemplate.opsForZSet().count(key, windowStart, currentTime);

        if (currentCount != null && currentCount >= requestsPerMinute) {
            return false; // Rate limit exceeded
        }

        // Add current request timestamp
        redisTemplate.opsForZSet().add(key, String.valueOf(currentTime), currentTime);

        // Set expiration to clean up old keys
        redisTemplate.expire(key, Duration.ofMinutes(2));

        return true;
    }

    /**
     * Get remaining requests in current window
     */
    public int getRemainingRequests(String identifier) {
        String key = "rate_limit:" + identifier;
        long currentTime = System.currentTimeMillis();
        long windowStart = currentTime - TimeUnit.MINUTES.toMillis(1);

        Long currentCount = redisTemplate.opsForZSet().count(key, windowStart, currentTime);
        return Math.max(0, requestsPerMinute - (currentCount != null ? currentCount.intValue() : 0));
    }

    /**
     * Get time until next allowed request (in milliseconds)
     */
    public long getRetryAfter(String identifier) {
        String key = "rate_limit:" + identifier;
        long currentTime = System.currentTimeMillis();
        long windowStart = currentTime - TimeUnit.MINUTES.toMillis(1);

        // Get the oldest request in the current window
        var oldestRequests = redisTemplate.opsForZSet()
                .rangeByScore(key, windowStart, currentTime, 0, 1);

        if (oldestRequests != null && !oldestRequests.isEmpty()) {
            long oldestTimestamp = Long.parseLong(oldestRequests.iterator().next());
            return oldestTimestamp + TimeUnit.MINUTES.toMillis(1) - currentTime;
        }

        return 0;
    }
}
