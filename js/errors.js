// Centralized error handling utility

/**
 * Error types for consistent error handling
 */
export const ErrorType = {
    NETWORK: 'NETWORK',
    AUTH: 'AUTH',
    API: 'API',
    VALIDATION: 'VALIDATION',
    UNKNOWN: 'UNKNOWN'
};

/**
 * Check if an error is a network/CORS error
 */
export function isNetworkError(error) {
    if (!error) return false;
    
    const message = error.message || '';
    const name = error.name || '';
    
    return (
        message.includes('Failed to fetch') ||
        message.includes('NetworkError') ||
        message.includes('Network request failed') ||
        name === 'TypeError' ||
        name === 'NetworkError'
    );
}

/**
 * Normalize error to a user-friendly message
 */
export function normalizeError(error, context = '') {
    if (!error) {
        return 'An unexpected error occurred.';
    }
    
    // If it's already a user-friendly message, return it
    if (typeof error === 'string') {
        return error;
    }
    
    const message = error.message || 'An unexpected error occurred.';
    
    // Handle network errors
    if (isNetworkError(error)) {
        return 'Unable to connect to the server. Please check your internet connection and try again.';
    }
    
    // Handle authentication errors
    if (message.includes('401') || message.includes('Unauthorized') || message.includes('token') || message.includes('expired')) {
        return 'Your session has expired. Please log in again.';
    }
    
    // Handle invalid credentials
    if (message.includes('Invalid username') || message.includes('Invalid email') || message.includes('Invalid password') || message.includes('Invalid credentials')) {
        return 'Invalid username/email or password. Please try again.';
    }
    
    // Handle authentication failed messages
    if (message.includes('Authentication failed') || message.includes('authentication failed')) {
        return 'Invalid username/email or password. Please try again.';
    }
    
    // Handle 403 errors
    if (message.includes('403') || message.includes('Forbidden')) {
        return 'You do not have permission to access this resource.';
    }
    
    // Handle 404 errors
    if (message.includes('404') || message.includes('Not Found')) {
        return 'The requested resource was not found.';
    }
    
    // Handle 500 errors
    if (message.includes('500') || message.includes('Internal Server Error')) {
        return 'The server encountered an error. Please try again later.';
    }
    
    // Handle GraphQL errors
    if (message.includes('GraphQL') || message.includes('query failed')) {
        return 'Failed to fetch data. Please try again.';
    }
    
    // Return the original message if it's user-friendly, otherwise generic message
    if (message.length < 100 && !message.includes('Error:') && !message.includes('at ')) {
        return message;
    }
    
    return context 
        ? `An error occurred while ${context}. Please try again.`
        : 'An unexpected error occurred. Please try again.';
}

/**
 * Check if we're in development mode
 */
function isDevelopment() {
    return window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1';
}

/**
 * Log error with context
 * Only logs detailed information in development mode
 */
export function logError(error, context = '') {
    if (!error) return;
    
    const isDev = isDevelopment();
    const errorInfo = {
        message: error.message || 'Unknown error',
        type: error.type || 'UNKNOWN',
        context: context || 'unknown',
        timestamp: error.timestamp || new Date().toISOString()
    };
    
    if (isDev) {
        // Development: Detailed logging
        console.group(`❌ Error${context ? ` [${context}]` : ''}`);
        console.error('Message:', errorInfo.message);
        console.error('Type:', errorInfo.type);
        
        if (error.stack) {
            console.error('Stack:', error.stack);
        }
        if (error.originalError) {
            console.error('Original:', error.originalError);
        }
        if (error.response) {
            console.error('Response:', error.response);
        }
        console.groupEnd();
    } else {
        // Production: Minimal structured logging
        console.error(`[${errorInfo.type}] ${errorInfo.context}:`, errorInfo.message);
    }
}

/**
 * Create a standardized error object
 */
export function createError(type, message, originalError = null) {
    const error = new Error(message);
    error.type = type;
    error.originalError = originalError;
    error.timestamp = new Date().toISOString();
    return error;
}

/**
 * Handle error with consistent logging and user message
 */
export function handleError(error, context = '') {
    logError(error, context);
    return normalizeError(error, context);
}

