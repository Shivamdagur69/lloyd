// DOM Elements
const navLinks = document.querySelectorAll('.nav-link');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const registrationForm = document.getElementById('registrationForm');
const successMessage = document.getElementById('successMessage');

// Event Date for Countdown (1st April 2026)
const eventDate = new Date('April 1, 2026 00:00:00').getTime();

// ============================================
// PARTICLES
// ============================================
function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    const colors = ['#ff6b35', '#4ecdc4', '#45b7d1', '#ff8e53'];
    for (let i = 0; i < 20; i++) {
        const p = document.createElement('div');
        p.classList.add('particle');
        const size = Math.random() * 6 + 2;
        p.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}%;
            animation-duration: ${Math.random() * 15 + 10}s;
            animation-delay: ${Math.random() * 10}s;
        `;
        container.appendChild(p);
    }
}

// ============================================
// SMOOTH SCROLLING
// ============================================
function smoothScroll(target) {
    const el = document.querySelector(target);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
    }
}

// Navigation click
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = link.getAttribute('href');
        smoothScroll(target);
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// CTA buttons
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = anchor.getAttribute('href');
        if (target && target !== '#') smoothScroll(target);
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// ============================================
// MOBILE MENU TOGGLE
// ============================================
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// ============================================
// NAVBAR BACKGROUND ON SCROLL
// ============================================
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(10, 10, 15, 0.99)';
        navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,0.4)';
    } else {
        navbar.style.background = 'rgba(10, 10, 15, 0.92)';
        navbar.style.boxShadow = 'none';
    }
});

// ============================================
// COUNTDOWN TIMER
// ============================================
function updateCountdown() {
    const now = new Date().getTime();
    const distance = eventDate - now;

    if (distance < 0) {
        document.getElementById('countdown').innerHTML = '<h3 style="color:#ff6b35;font-family:Orbitron,monospace;">🎮 Event Started!</h3>';
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = days.toString().padStart(2, '0');
    document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
    document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
}

// ============================================
// FORM VALIDATION
// ============================================
function validateForm() {
    let isValid = true;
    const errors = {};

    const name = document.getElementById('fullName').value.trim();
    if (name.length < 2) {
        errors.name = 'Name must be at least 2 characters';
        isValid = false;
    }

    const phone = document.getElementById('phone').value.trim();
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
        errors.phone = 'Enter valid 10-digit Indian phone number';
        isValid = false;
    }

    const email = document.getElementById('email').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        errors.email = 'Enter valid email address';
        isValid = false;
    }

    const college = document.getElementById('college').value.trim();
    if (college.length < 2) {
        errors.college = 'College/Department name required';
        isValid = false;
    }

    const game = document.getElementById('game').value;
    if (!game) {
        errors.game = 'Please select a game';
        isValid = false;
    }

    const mode = document.getElementById('mode').value;
    if (!mode) {
        errors.mode = 'Please select game mode';
        isValid = false;
    }

    const playerId = document.getElementById('playerId').value.trim();
    if (playerId.length < 5) {
        errors.playerId = 'Player ID must be at least 5 characters';
        isValid = false;
    }

    // Show/clear error messages
    const errorMap = {
        name: 'nameError',
        phone: 'phoneError',
        email: 'emailError',
        college: 'collegeError',
        game: 'gameError',
        mode: 'modeError',
        playerId: 'playerIdError'
    };

    Object.keys(errorMap).forEach(key => {
        const el = document.getElementById(errorMap[key]);
        if (el) {
            if (errors[key]) {
                el.textContent = errors[key];
                el.style.display = 'block';
            } else {
                el.style.display = 'none';
            }
        }
    });

    return isValid;
}

// ============================================
// FORM SUBMISSION
// ============================================
registrationForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Clear previous errors
    document.querySelectorAll('.error-message').forEach(el => {
        el.style.display = 'none';
    });

    if (validateForm()) {
        const formData = new FormData(registrationForm);
        const registrationData = Object.fromEntries(formData);

        // Store in localStorage
        const registrations = JSON.parse(localStorage.getItem('esports_registrations') || '[]');
        const newReg = {
            ...registrationData,
            timestamp: new Date().toISOString(),
            id: 'REG' + Date.now()
        };
        registrations.push(newReg);
        localStorage.setItem('esports_registrations', JSON.stringify(registrations));

        console.log('🎮 NEW REGISTRATION:', newReg);
        console.table(registrations);

        registrationForm.style.display = 'none';
        successMessage.style.display = 'block';
        successMessage.scrollIntoView({ behavior: 'smooth' });
    }
});

// ============================================
// CLOSE SUCCESS
// ============================================
function closeSuccess() {
    successMessage.style.display = 'none';
    registrationForm.style.display = 'flex';
    registrationForm.reset();
    registrationForm.scrollIntoView({ behavior: 'smooth' });
}

// ============================================
// DYNAMIC TEAM NAME FIELD
// ============================================
document.getElementById('mode').addEventListener('change', (e) => {
    const teamNameField = document.getElementById('teamName');
    if (e.target.value === 'Squad') {
        teamNameField.required = true;
        teamNameField.placeholder = 'Team Name (required for Squad)';
    } else {
        teamNameField.required = false;
        teamNameField.placeholder = 'Team Name (Squad only)';
        teamNameField.value = '';
    }
});

// ============================================
// SCROLL ANIMATION
// ============================================
function initScrollAnimation() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Animate cards and items
    document.querySelectorAll('.game-card, .detail-item, .payment-step, .contact-card').forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `all 0.6s ease ${i * 0.1}s`;
        observer.observe(el);
    });

    // Override the IntersectionObserver callback to apply styles
    const styleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.game-card, .detail-item, .payment-step, .contact-card').forEach(el => {
        styleObserver.observe(el);
    });
}

// ============================================
// ADMIN: VIEW REGISTRATIONS
// ============================================
function viewRegistrations() {
    const registrations = JSON.parse(localStorage.getItem('esports_registrations') || '[]');
    console.log('📋 ALL REGISTRATIONS:', registrations);
    console.table(registrations);
    return registrations;
}

// ============================================
// INITIALIZE
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    createParticles();
    updateCountdown();
    setInterval(updateCountdown, 1000);
    initScrollAnimation();
});

// Export for global use
window.viewRegistrations = viewRegistrations;
window.closeSuccess = closeSuccess;
