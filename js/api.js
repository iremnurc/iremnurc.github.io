// GraphQL API module for querying Zone01 data

import { getToken, logout } from './auth.js';
import { queries } from './queries.js';
import { GRAPHQL_ENDPOINT } from './config.js';
import { handleError, isNetworkError, createError, ErrorType, logError } from './errors.js';

// Generic GraphQL query function
export async function graphqlQuery(query, variables = {}) {
    const token = getToken();
    
    if (!token) {
        throw createError(ErrorType.AUTH, 'No authentication token found. Please log in again.');
    }
    
    try {
        const response = await fetch(GRAPHQL_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                query,
                variables
            })
        });
        
        if (!response.ok) {
            if (response.status === 401) {
                logout();
                throw createError(ErrorType.AUTH, 'Your session has expired. Please log in again.');
            }
            if (response.status >= 500) {
                throw createError(ErrorType.API, 'Server error. Please try again later.');
            }
            throw createError(ErrorType.API, `Request failed: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        if (result.errors) {
            logError(result.errors, 'GraphQL query');
            const errorMessage = result.errors[0]?.message || 'Failed to fetch data';
            throw createError(ErrorType.API, errorMessage);
        }
        
        return result.data;
    } catch (error) {
        // Handle network errors
        if (isNetworkError(error)) {
            throw createError(ErrorType.NETWORK, handleError(error, 'connecting to the API'));
        }
        // Re-throw if already a created error, otherwise normalize
        if (error.type) {
            throw error;
        }
        throw createError(ErrorType.API, handleError(error, 'fetching data'));
    }
}

// Get basic user information
export async function getUserInfo() {
    const data = await graphqlQuery(queries.getUserInfo);
    const user = data.user[0] || data.user;
    
    // Extract email from attrs if it exists
    return {
        id: user.id,
        login: user.login,
        email: user.attrs?.email || user.login
    };
}

// Get all XP transactions for the user
export async function getXPTransactions() {
    const data = await graphqlQuery(queries.getXPTransactions);
    return data.transaction || [];
}

// Get total XP - excludes piscine exercises but includes final piscine rewards
export async function getTotalXP() {
    const transactions = await getXPTransactions();
    
    // Filter logic: Exclude piscine exercises but keep final piscine rewards
    const filteredTransactions = transactions.filter(t => {
        const path = t.path?.toLowerCase() || '';
        const objectType = t.object?.type?.toLowerCase() || '';
        
        // If path contains piscine-go, piscine-js, or piscine-ux
        if (path.includes('piscine-go') || path.includes('piscine-js') || path.includes('piscine-ux')) {
            // Exclude only if it's an exercise
            return objectType !== 'exercise';
        }
        
        // Keep all other transactions
        return true;
    });
    
    const total = filteredTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
    return total;
}

// Get user progress data
export async function getProgressData() {
    const data = await graphqlQuery(queries.getProgress);
    return data.progress || [];
}

// Get audit ratio data
export async function getAuditRatio() {
    const data = await graphqlQuery(queries.getAuditTransactions);
    const transactions = data.transaction || [];
    
    let totalUp = 0;
    let totalDown = 0;
    
    // Calculate from transactions (up = audits given, down = audits received)
    transactions.forEach(t => {
        if (t.type === 'up') {
            totalUp += t.amount;
        } else if (t.type === 'down') {
            totalDown += t.amount;
        }
    });
    
    // Calculate audit ratio (1 decimal place)
    const auditRatio = totalDown > 0 ? (totalUp / totalDown).toFixed(1) : '0.0';
    
    return {
        auditRatio,
        totalUp,
        totalDown
    };
}

// Get skills data from skill transactions
export async function getSkillsData() {
    try {
        const data = await graphqlQuery(queries.getSkillTransactions);
        const transactions = data.transaction || [];
        
        // Map skill types to display names
        const skillMapping = {
            'skill_go': 'Go',
            'skill_js': 'JavaScript',
            'skill_algo': 'Algorithm',
            'skill_prog': 'Programming',  
            'skill_front-end': 'Frontend',
            'skill_back-end': 'Backend',
            'skill_git': 'Git',
            'skill_docker': 'Docker'
        };
        
        // Get max value for each skill type (cumulative, so max = current level)
        const skillValues = new Map();
        
        transactions.forEach(t => {
            const displayName = skillMapping[t.type];
            if (displayName) {
                const currentMax = skillValues.get(displayName) || 0;
                if (t.amount > currentMax) {
                    skillValues.set(displayName, t.amount);
                }
            }
        });
        
        // Create array with our 8 target skills
        const targetSkills = ['Frontend', 'Programming', 'Backend', 'Go', 'JavaScript', 'Git', 'Docker', 'Algorithm'];
        const skills = targetSkills.map(name => ({
            name,
            value: skillValues.get(name) || 0
        }));
        
        return skills;
    } catch (error) {
        logError(error, 'fetching skills');
        // Return empty skills array on error (graceful degradation)
        return [
            { name: 'Frontend', value: 0 },
            { name: 'Programming', value: 0 },
            { name: 'Backend', value: 0 },
            { name: 'Go', value: 0 },
            { name: 'JavaScript', value: 0 },
            { name: 'Git', value: 0 },
            { name: 'Docker', value: 0 },
            { name: 'Algorithm', value: 0 },
        ];
    }
}

// Fetch all profile data in parallel
export async function getAllProfileData() {
    try {
        const [user, xpTransactions, totalXP, auditData, skillsData] = await Promise.all([
            getUserInfo(),
            getXPTransactions(),
            getTotalXP(),
            getAuditRatio(),
            getSkillsData()
        ]);
        
        return {
            user,
            xpTransactions,
            totalXP,
            auditRatio: auditData.auditRatio,
            skills: skillsData
        };
    } catch (error) {
        logError(error, 'fetching profile data');
        // Re-throw to let the caller handle it
        throw error;
    }
}

