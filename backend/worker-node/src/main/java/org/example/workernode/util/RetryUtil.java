package org.example.workernode.util;

public class RetryUtil {
    public static long calculateExponentialBackoff(int retryCount) {
        return (long) (1000 * Math.pow(2, retryCount - 1));
    }

    public static long calculateExponentialBackoffWithJitter(int retryCount) {
        long baseDelay = calculateExponentialBackoff(retryCount);
        double jitter = Math.random() * 0.1; // 10% jitter
        return (long) (baseDelay * (1 + jitter));
    }

    public static boolean shouldRetry(int currentRetryCount, int maxRetries) {
        return currentRetryCount < maxRetries;
    }
}
