document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
        });
    });
    
    // Header scroll effect
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Animate skill bars on scroll
    const skillBars = document.querySelectorAll('.skill-progress');
    
    function animateSkillBars() {
        skillBars.forEach(bar => {
            const width = bar.getAttribute('data-width') || bar.style.width;
            bar.style.width = '0';
            
            setTimeout(() => {
                bar.style.width = width;
            }, 100);
        });
    }
    
    // Intersection Observer for skill bars
    const skillsSection = document.querySelector('.skills');
    const observerOptions = {
        threshold: 0.2
    };
    
    if (skillsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateSkillBars();
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        observer.observe(skillsSection);
    }
    
    // Contact Form Submission
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'overlay';
        loadingOverlay.innerHTML = `
            <div class="loading-animation">
                <span class="loader"></span>
            </div>
        `;

        const alertOverlay = document.createElement('div');
        alertOverlay.className = 'overlay';
        alertOverlay.innerHTML = `
            <div class="alert-box">
                <div class="alert-icon"></div>
                <h3 class="alert-title">Success</h3>
                <p class="alert-message">Your message has been sent successfully!</p>
                <button class="alert-close">Continue</button>
            </div>
        `;

        document.body.appendChild(loadingOverlay);
        document.body.appendChild(alertOverlay);

        alertOverlay.querySelector('.alert-close').addEventListener('click', function () {
            alertOverlay.classList.remove('active');
        });

        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value,
                timestamp: new Date().toISOString()
            };

            if (!formData.name || !formData.email || !formData.subject || !formData.message) {
                showAlert('Error', 'Please fill in all fields', 'error');
                return;
            }

            if (!validateEmail(formData.email)) {
                showAlert('Error', 'Please enter a valid email address', 'error');
                return;
            }

            loadingOverlay.classList.add('active');

            fetch('https://script.google.com/macros/s/AKfycbwHIwUjshS9S-3VNE3KHeZ2KT8TlnNp1vXBo4lR4MEwY0XTTjN6ZsD6TH-RgTdwc5c_Lw/exec', {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })
            .then(() => {
                showAlert('Success', 'Thank you! Your message has been sent.', 'success');
                contactForm.reset();
            })
            .catch((error) => {
                console.error('Error:', error);
                showAlert('Error', 'There was an error sending your message. Please try again.', 'error');
            })
            .finally(() => {
                loadingOverlay.classList.remove('active');
            });
        });

        function validateEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }

        function showAlert(title, message, type) {
            const alertBox = alertOverlay.querySelector('.alert-box');
            const alertIcon = alertOverlay.querySelector('.alert-icon');
            alertBox.className = 'alert-box';
            alertIcon.innerHTML = '';

            if (type === 'success') {
                alertBox.classList.add('success');
                alertIcon.innerHTML = `
                    <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                        <circle class="checkmark-circle" cx="26" cy="26" r="20" fill="none"/>
                        <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                    </svg>
                `;
            } else {
                alertBox.classList.add('error');
                alertIcon.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                `;
            }

            alertOverlay.querySelector('.alert-title').textContent = title;
            alertOverlay.querySelector('.alert-message').textContent = message;
            alertOverlay.classList.add('active');
        }
    }
});

// Project card hover effect for touch devices
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('touchstart', function() {
            this.classList.add('hover');
        });
        
        card.addEventListener('touchend', function() {
            this.classList.remove('hover');
        });
    });

    // Dark Mode Toggle Functionality
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;

    // Check for saved user preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        body.classList.add('dark-mode');
        darkModeToggle.checked = true;
    }

    // Toggle dark mode
    darkModeToggle.addEventListener('change', function() {
        if (this.checked) {
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
    });
