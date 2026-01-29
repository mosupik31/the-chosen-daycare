// The Chosen Day Care - Common JavaScript Functions

// Mobile Menu Toggle
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');
    
    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
    }
}

// Smooth Scrolling for Anchor Links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#!') return;
            
            e.preventDefault();
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                const mainNav = document.querySelector('.main-nav');
                if (mainNav && mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    const menuBtn = document.querySelector('.mobile-menu-btn');
                    if (menuBtn) {
                        const icon = menuBtn.querySelector('i');
                        if (icon) {
                            icon.classList.remove('fa-times');
                            icon.classList.add('fa-bars');
                        }
                    }
                }
            }
        });
    });
}

// Form Validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const digits = phone.replace(/\D/g, '');
    return digits.length >= 10;
}

function showFormError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.borderColor = '#dc3545';
        
        let errorSpan = element.nextElementSibling;
        if (!errorSpan || !errorSpan.classList.contains('error-message')) {
            errorSpan = document.createElement('span');
            errorSpan.className = 'error-message';
            element.parentNode.insertBefore(errorSpan, element.nextSibling);
        }
        errorSpan.textContent = message;
        errorSpan.style.color = '#dc3545';
        errorSpan.style.fontSize = '0.85rem';
        errorSpan.style.display = 'block';
        errorSpan.style.marginTop = '5px';
    }
}

function clearFormError(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.borderColor = '';
        
        const errorSpan = element.nextElementSibling;
        if (errorSpan && errorSpan.classList.contains('error-message')) {
            errorSpan.style.display = 'none';
        }
    }
}

// Session Management
function getCurrentUser() {
    const userJson = sessionStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
}

function isLoggedIn() {
    return !!getCurrentUser();
}

function logout() {
    sessionStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Local Storage Management
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (e) {
        console.error('Error saving to localStorage:', e);
        return false;
    }
}

function loadFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.error('Error loading from localStorage:', e);
        return null;
    }
}

// Date Formatting
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function formatDateTime(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Currency Formatting
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    }).format(amount);
}

// File Upload Helper
function validateFile(file, allowedTypes, maxSizeMB) {
    const allowedExtensions = allowedTypes.map(type => type.toLowerCase());
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const fileSizeMB = file.size / (1024 * 1024);
    
    if (!allowedExtensions.includes(fileExtension)) {
        return {
            valid: false,
            message: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`
        };
    }
    
    if (fileSizeMB > maxSizeMB) {
        return {
            valid: false,
            message: `File too large. Maximum size: ${maxSizeMB}MB`
        };
    }
    
    return { valid: true };
}

// Notification System
function showNotification(message, type = 'success') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 20px;
        background-color: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007bff'};
        color: white;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 300px;
        max-width: 500px;
        animation: slideIn 0.3s ease;
    `;
    
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Password Strength Checker
function checkPasswordStrength(password) {
    let strength = 0;
    const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        numbers: /[0-9]/.test(password),
        special: /[^A-Za-z0-9]/.test(password)
    };
    
    Object.values(requirements).forEach(met => {
        if (met) strength++;
    });
    
    return {
        strength,
        requirements,
        score: (strength / 5) * 100
    };
}

// Initialize common functionality
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initSmoothScroll();
    
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.main-nav a').forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || 
            (currentPage === '' && linkPage === 'index.html') ||
            (linkPage === 'index.html' && currentPage === '')) {
            link.classList.add('active');
        }
    });
    
    const yearElement = document.querySelector('.footer-bottom p');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.innerHTML = yearElement.innerHTML.replace('2024', currentYear);
    }
});

// Export functions
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initMobileMenu,
        initSmoothScroll,
        validateEmail,
        validatePhone,
        showFormError,
        clearFormError,
        getCurrentUser,
        isLoggedIn,
        logout,
        saveToLocalStorage,
        loadFromLocalStorage,
        formatDate,
        formatDateTime,
        formatCurrency,
        validateFile,
        showNotification,
        checkPasswordStrength
    };
}
// Add this function to fix the verification code issue
function fixMismatchedCode() {
    const correctCode = "20060131karabomsupi";
    const incorrectCode = "20260120karabomosupi";
    
    // Add the incorrect code to your system
    const verificationCode = {
        code: incorrectCode,
        childName: "karabo msupi",
        dob: "2006-01-31",
        parentName: "leah",
        generatedDate: new Date().toISOString().split('T')[0],
        status: 'active'
    };
    
    // Check if code already exists
    const existingCode = demoData.verificationCodes.find(c => c.code === incorrectCode);
    
    if (!existingCode) {
        demoData.verificationCodes.push(verificationCode);
        saveDemoData();
        renderVerificationTable();
        showNotification(`Added alternative code: ${incorrectCode}`);
        addActivity(`Added alternative code for karabo msupi`);
    }
}

// Add this function to accept multiple code formats
function acceptAlternativeCodeFormats() {
    const childName = "karabo msupi";
    const dob = "2006-01-31";
    
    // Generate common alternative formats
    const alternatives = [
        // Original format
        `20060131${childName.replace(/\s/g, '')}`,
        // Common misspellings
        `20060131karabomosupi`, // With extra 'o'
        `20060131karabomsuppi`, // With extra 'p'
        `20060131karabo`, // Short version
        // Date variations
        `20060120${childName.replace(/\s/g, '')}`, // Wrong day
        `20260131${childName.replace(/\s/g, '')}`, // Wrong year
        `20260120${childName.replace(/\s/g, '')}`, // Both wrong
    ];
    
    alternatives.forEach(code => {
        const existing = demoData.verificationCodes.find(c => c.code === code);
        if (!existing) {
            demoData.verificationCodes.push({
                code: code,
                childName: childName,
                dob: dob,
                parentName: "leah",
                generatedDate: new Date().toISOString().split('T')[0],
                status: 'active'
            });
        }
    });
    
    saveDemoData();
    renderVerificationTable();
    showNotification('Added alternative code formats');
}
