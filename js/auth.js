// Authentication module for handling login, logout, and JWT management

import { API_BASE_URL, AUTH_ENDPOINT } from './config.js';
import { handleError, isNetworkError, createError, ErrorType, logError } from './errors.js';

// Login function that authenticates user with username/email and password
export async function login(identifier, password) {
    try {
        // Create Base64 encoded credentials
        const credentials = btoa(`${identifier}:${password}`);
        
        // Make POST request to signin endpoint
        const response = await fetch(AUTH_ENDPOINT, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            if (response.status === 401) {
                throw createError(ErrorType.AUTH, 'Invalid username/email or password');
            }
            if (response.status >= 500) {
                throw createError(ErrorType.API, 'Server error. Please try again later.');
            }
            throw createError(ErrorType.AUTH, `Authentication failed: ${response.statusText}`);
        }
        
        // Get JWT token from response
        const data = await response.json();
        const token = data.token || data;
        
        if (!token) {
            throw createError(ErrorType.AUTH, 'No authentication token received. Please try again.');
        }
        
        // Store JWT in localStorage
        localStorage.setItem('jwt_token', token);
        
        // Decode and store user ID for quick access
        const userId = getUserIdFromToken(token);
        if (userId) {
            localStorage.setItem('user_id', userId);
        }
        
        return token;
    } catch (error) {
        // Handle network errors
        if (isNetworkError(error)) {
            throw createError(ErrorType.NETWORK, handleError(error, 'connecting to the server'));
        }
        // Re-throw if already a created error, otherwise normalize
        if (error.type) {
            throw error;
        }
        throw createError(ErrorType.AUTH, handleError(error, 'logging in'));
    }
}

// Logout function that clears stored credentials and navigates to login
export function logout() {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_id');
    // Use hash navigation instead of page reload
    window.location.hash = 'login';
}

// Get stored JWT token
export function getToken() {
    return localStorage.getItem('jwt_token');
}

// Check if user is authenticated
export function isAuthenticated() {
    const token = getToken();
    if (!token) return false;
    
    try {
        // Decode JWT and check expiration
        const payload = JSON.parse(atob(token.split('.')[1]));
        const exp = payload.exp;
        
        // Check if token is expired
        if (exp && Date.now() >= exp * 1000) {
            logout();
            return false;
        }
        
        return true;
    } catch (error) {
        logError(error, 'checking authentication');
        return false;
    }
}

// Decode JWT token to extract user ID
function getUserIdFromToken(token) {
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.sub || payload.userId || payload.id || null;
    } catch (error) {
        logError(error, 'decoding token');
        return null;
    }
}

