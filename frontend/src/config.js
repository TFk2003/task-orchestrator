// src/config.js
const config = {
  // Use environment variable with fallback to localhost for development
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:8080',
  isProduction: process.env.NODE_ENV === 'production',
};

export default config;