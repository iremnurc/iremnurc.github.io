// Login form module
import { login } from './auth.js';
import { navigate } from './router.js';

// Initialize login form
export function initLogin() {
    const form = document.getElementById('loginForm');
    if (!form) return;
    
    // Remove any existing listeners by cloning the form
    const newForm = form.cloneNode(true);
    form.parentNode.replaceChild(newForm, form);
    
    // Reset button state to ensure it's not stuck in loading state
    const loginButton = newForm.querySelector('#loginButton');
    const loginButtonText = newForm.querySelector('#loginButtonText');
    const loginSpinner = newForm.querySelector('#loginSpinner');
    
    if (loginButton && loginButtonText && loginSpinner) {
        loginButton.disabled = false;
        loginButtonText.classList.remove('hidden');
        loginSpinner.classList.add('hidden');
    }
    
    // Add submit event listener
    newForm.addEventListener('submit', handleLoginSubmit);
    
    // Add password toggle functionality
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Update icon
            const icon = togglePassword.querySelector('svg');
            if (type === 'text') {
                // Show eye-off icon
                icon.innerHTML = `
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                `;
            } else {
                // Show eye icon
                icon.innerHTML = `
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                `;
            }
        });
    }
    
    // Gradient blob mouse tracking animation (only on left section)
    const blob = document.querySelector('.blob');
    const leftSection = document.querySelector('.login-left-section');
    
    if (blob && leftSection) {
        let isMouseInLeftSection = false;
        
        leftSection.addEventListener('mouseenter', () => {
            isMouseInLeftSection = true;
        });
        
        leftSection.addEventListener('mouseleave', () => {
            isMouseInLeftSection = false;
        });
        
        leftSection.addEventListener('mousemove', function(e) {
            if (isMouseInLeftSection) {
                const rect = leftSection.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                blob.style.transform = `translate3d(calc(${x}px - 50%), calc(${y}px - 50%), 0)`;
            }
        });
    }
}

// Handle login form submission
async function handleLoginSubmit(e) {
    e.preventDefault();
    
    const identifier = document.getElementById('identifier').value.trim();
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    const loginButton = document.getElementById('loginButton');
    const loginButtonText = document.getElementById('loginButtonText');
    const loginSpinner = document.getElementById('loginSpinner');
    
    // Hide error message
    errorMessage.classList.add('hidden');
    
    // Show loading state
    loginButton.disabled = true;
    loginButtonText.classList.add('hidden');
    loginSpinner.classList.remove('hidden');
    
    try {
        await login(identifier, password);
        // Navigate to profile on success
        navigate('profile');
    } catch (error) {
        // Show error message
        errorText.textContent = error.message || 'Invalid credentials. Please try again.';
        errorMessage.classList.remove('hidden');
        
        // Reset button state
        loginButton.disabled = false;
        loginButtonText.classList.remove('hidden');
        loginSpinner.classList.add('hidden');
    }
}

