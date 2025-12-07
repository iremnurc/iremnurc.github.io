// Use localhost for development, proxy for production
const isDevelopment = window.location.hostname === 'localhost';
const PRODUCTION_PROXY_URL = 'https://profile01-backend.onrender.com';

export const API_BASE_URL = isDevelopment 
    ? 'http://localhost:8080' 
    : PRODUCTION_PROXY_URL;
export const AUTH_ENDPOINT = `${API_BASE_URL}/api/auth/signin`;
export const GRAPHQL_ENDPOINT = `${API_BASE_URL}/api/graphql`;

