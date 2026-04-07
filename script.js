// ===========================
// PINTAR Landing Page JavaScript
// ===========================

(function() {
    'use strict';

    // ===========================
    // DOM Elements
    // ===========================
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // ===========================
    // Mobile Navigation Toggle
    // ===========================
    function initMobileNav() {
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', function() {
                navToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
                
                // Update ARIA attributes for accessibility
                const isExpanded = navToggle.classList.contains('active');
                navToggle.setAttribute('aria-expanded', isExpanded);
            });

            // Close mobile menu when clicking a link
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false');
                });
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', function(event) {
                const isClickInside = navMenu.contains(event.target) || navToggle.contains(event.target);
                
                if (!isClickInside && navMenu.classList.contains('active')) {
                    navToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false');
                }
            });
        }
    }

    // ===========================
    // Navbar Scroll Effect
    // ===========================
    function initNavbarScroll() {
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add shadow when scrolled
            if (scrollTop > 20) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            lastScrollTop = scrollTop;
        }, { passive: true });
    }

    // ===========================
    // Smooth Scrolling
    // ===========================
    function initSmoothScroll() {
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Only handle internal links
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        // Calculate offset for fixed navbar
                        const navbarHeight = navbar.offsetHeight;
                        const targetPosition = targetElement.offsetTop - navbarHeight - 20;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    // ===========================
    // Intersection Observer for Animations
    // ===========================
    function initScrollAnimations() {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    // Optional: Unobserve after animation to improve performance
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe problem cards
        const problemCards = document.querySelectorAll('.problem-card');
        problemCards.forEach((card, index) => {
            // Add staggered delay
            card.style.animationDelay = `${index * 0.1}s`;
            observer.observe(card);
        });

        // Observe feature cards
        const featureCards = document.querySelectorAll('.feature-card');
        featureCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            observer.observe(card);
        });

        // Observe impact stats
        const impactStats = document.querySelectorAll('.impact-stat');
        impactStats.forEach((stat, index) => {
            stat.style.animationDelay = `${index * 0.05}s`;
            observer.observe(stat);
        });

        // Observe user cards
        const userCards = document.querySelectorAll('.user-card');
        userCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            observer.observe(card);
        });

        // Observe about cards
        const aboutCards = document.querySelectorAll('.about-card');
        aboutCards.forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            observer.observe(card);
        });
    }

    // ===========================
    // Active Navigation Link
    // ===========================
    function initActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        
        window.addEventListener('scroll', function() {
            const scrollPosition = window.pageYOffset + navbar.offsetHeight + 50;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${sectionId}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, { passive: true });
    }

    // ===========================
    // Number Counter Animation
    // ===========================
    function animateValue(element, start, end, duration) {
        const range = end - start;
        const increment = range / (duration / 16); // 60fps
        let current = start;
        const isDecimal = end % 1 !== 0;
        
        const timer = setInterval(function() {
            current += increment;
            
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                current = end;
                clearInterval(timer);
            }
            
            element.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);
        }, 16);
    }

    function initCounterAnimation() {
        const counters = document.querySelectorAll('.stat-value');
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5
        };

        const counterObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    entry.target.classList.add('counted');
                    
                    const text = entry.target.textContent;
                    const numberMatch = text.match(/[\d.,]+/);
                    
                    if (numberMatch) {
                        const number = parseFloat(numberMatch[0].replace(',', '.'));
                        const suffix = text.replace(numberMatch[0], '').trim();
                        
                        if (!isNaN(number)) {
                            entry.target.textContent = '0';
                            setTimeout(() => {
                                animateValue(entry.target, 0, number, 1500);
                                
                                // Add suffix after animation
                                setTimeout(() => {
                                    if (suffix) {
                                        entry.target.textContent = entry.target.textContent + ' ' + suffix;
                                    }
                                }, 1500);
                            }, 200);
                        }
                    }
                    
                    counterObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    // ===========================
    // Parallax Effect (Subtle)
    // ===========================
    function initParallax() {
        const hero = document.querySelector('.hero');
        
        if (hero) {
            window.addEventListener('scroll', function() {
                const scrolled = window.pageYOffset;
                const rate = scrolled * 0.3;
                
                hero.style.transform = `translateY(${rate}px)`;
            }, { passive: true });
        }
    }

    // ===========================
    // Accessibility: Skip to Content
    // ===========================
    function initAccessibility() {
        // Handle keyboard navigation
        document.addEventListener('keydown', function(e) {
            // Skip to main content with Ctrl+Alt+1
            if (e.ctrlKey && e.altKey && e.key === '1') {
                e.preventDefault();
                const mainContent = document.querySelector('.hero');
                if (mainContent) {
                    mainContent.scrollIntoView({ behavior: 'smooth' });
                    mainContent.focus();
                }
            }
        });
    }

    // ===========================
    // Performance: Lazy Loading
    // ===========================
    function initLazyLoading() {
        if ('loading' in HTMLImageElement.prototype) {
            const images = document.querySelectorAll('img[loading="lazy"]');
            images.forEach(img => {
                img.src = img.dataset.src;
            });
        } else {
            // Fallback for browsers that don't support lazy loading
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
            document.body.appendChild(script);
        }
    }

    // ===========================
    // Easter Egg: Konami Code
    // ===========================
    function initEasterEgg() {
        const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
        let konamiPosition = 0;

        document.addEventListener('keydown', function(e) {
            if (e.key === konamiCode[konamiPosition]) {
                konamiPosition++;
                
                if (konamiPosition === konamiCode.length) {
                    // Easter egg activated!
                    const heroTitle = document.querySelector('.hero-title');
                    if (heroTitle) {
                        heroTitle.style.background = 'linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3)';
                        heroTitle.style.backgroundSize = '200% 200%';
                        heroTitle.style.webkitBackgroundClip = 'text';
                        heroTitle.style.webkitTextFillColor = 'transparent';
                        heroTitle.style.animation = 'rainbow 2s ease infinite';
                        
                        // Add rainbow animation
                        const style = document.createElement('style');
                        style.textContent = `
                            @keyframes rainbow {
                                0% { background-position: 0% 50%; }
                                50% { background-position: 100% 50%; }
                                100% { background-position: 0% 50%; }
                            }
                        `;
                        document.head.appendChild(style);
                    }
                    konamiPosition = 0;
                }
            } else {
                konamiPosition = 0;
            }
        });
    }

    // ===========================
    // Initialize All Functions
    // ===========================
    function init() {
        // Core functionality
        initMobileNav();
        initNavbarScroll();
        initSmoothScroll();
        initScrollAnimations();
        initActiveNavLink();
        initAccessibility();
        
        // Enhanced features
        initCounterAnimation();
        initParallax();
        initLazyLoading();
        
        // Fun easter egg
        initEasterEgg();
        
        // Page-specific functionality
        initLoginPage();
        initDashboard();
        
        // Log initialization
        console.log('%cPINTAR Platform Initialized', 'color: #1565C0; font-size: 16px; font-weight: bold;');
        console.log('%cPlatform Integrasi Nasional Transparan untuk Akademik & Reward', 'color: #757575; font-size: 12px;');
    }

    // ===========================
    // LOGIN PAGE FUNCTIONALITY
    // ===========================
    function initLoginPage() {
        const loginForm = document.getElementById('loginForm');
        const loginButton = document.getElementById('loginButton');
        const togglePassword = document.getElementById('togglePassword');
        const passwordInput = document.getElementById('password');

        if (!loginForm) return; // Not on login page

        // Password visibility toggle
        if (togglePassword && passwordInput) {
            togglePassword.addEventListener('click', function() {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                
                const eyeIcon = this.querySelector('.eye-icon');
                eyeIcon.textContent = type === 'password' ? '👁️' : '👁️‍🗨️';
                
                this.setAttribute('aria-label', type === 'password' ? 'Tampilkan password' : 'Sembunyikan password');
            });
        }

        // Form validation
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email');
            const password = document.getElementById('password');
            const emailError = document.getElementById('emailError');
            const passwordError = document.getElementById('passwordError');
            
            // Reset errors
            emailError.textContent = '';
            passwordError.textContent = '';
            email.classList.remove('error');
            password.classList.remove('error');
            
            let isValid = true;
            
            // Validate email
            if (!email.value.trim()) {
                emailError.textContent = 'Email atau username tidak boleh kosong';
                email.classList.add('error');
                isValid = false;
            } else if (email.value.includes('@') && !isValidEmail(email.value)) {
                emailError.textContent = 'Format email tidak valid';
                email.classList.add('error');
                isValid = false;
            }
            
            // Validate password
            if (!password.value) {
                passwordError.textContent = 'Password tidak boleh kosong';
                password.classList.add('error');
                isValid = false;
            } else if (password.value.length < 6) {
                passwordError.textContent = 'Password minimal 6 karakter';
                password.classList.add('error');
                isValid = false;
            }
            
            if (isValid) {
                // Show loading state
                loginButton.classList.add('loading');
                loginButton.disabled = true;
                
                // Simulate API call
                setTimeout(function() {
                    // Store user session (in real app, would handle authentication properly)
                    sessionStorage.setItem('isLoggedIn', 'true');
                    sessionStorage.setItem('userName', 'Ahmad Rizki');
                    
                    // Redirect to dashboard
                    window.location.href = 'dashboard.html';
                }, 1500);
            }
        });
        
        // Real-time validation
        const inputs = loginForm.querySelectorAll('input[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateField(this);
                }
            });
        });
    }

    function validateField(field) {
        const errorElement = document.getElementById(field.id + 'Error');
        
        if (!field.value.trim()) {
            errorElement.textContent = `${field.labels[0].textContent} tidak boleh kosong`;
            field.classList.add('error');
            return false;
        } else if (field.type === 'email' || (field.id === 'email' && field.value.includes('@'))) {
            if (!isValidEmail(field.value)) {
                errorElement.textContent = 'Format email tidak valid';
                field.classList.add('error');
                return false;
            }
        } else if (field.type === 'password' && field.value.length < 6) {
            errorElement.textContent = 'Password minimal 6 karakter';
            field.classList.add('error');
            return false;
        }
        
        errorElement.textContent = '';
        field.classList.remove('error');
        return true;
    }

    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // ===========================
    // DASHBOARD FUNCTIONALITY
    // ===========================
    function initDashboard() {
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebar = document.getElementById('dashboardSidebar');
        const userMenuBtn = document.getElementById('userMenuBtn');
        const userDropdown = document.getElementById('userDropdown');

        if (!sidebarToggle) return; // Not on dashboard page

        // Check if user is logged in
        if (!sessionStorage.getItem('isLoggedIn')) {
            // Redirect to login if not logged in
            // window.location.href = 'login.html';
            // Commented out for demo purposes
        }

        // Sidebar toggle
        sidebarToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            sidebar.classList.toggle('active');
        });

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', function(event) {
            const isClickInsideSidebar = sidebar.contains(event.target);
            const isClickOnToggle = sidebarToggle.contains(event.target);
            
            if (!isClickInsideSidebar && !isClickOnToggle && sidebar.classList.contains('active')) {
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('active');
                    sidebarToggle.classList.remove('active');
                }
            }
        });

        // User dropdown menu
        if (userMenuBtn && userDropdown) {
            userMenuBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                userDropdown.classList.toggle('active');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', function(event) {
                if (!userMenuBtn.contains(event.target)) {
                    userDropdown.classList.remove('active');
                }
            });

            // Close dropdown when clicking on a menu item
            const dropdownItems = userDropdown.querySelectorAll('.dropdown-item');
            dropdownItems.forEach(item => {
                item.addEventListener('click', function() {
                    userDropdown.classList.remove('active');
                });
            });
        }

        // Sidebar active state
        const sidebarLinks = document.querySelectorAll('.sidebar-link');
        sidebarLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Only prevent default for demo purposes
                if (this.getAttribute('href') === '#') {
                    e.preventDefault();
                }
                
                sidebarLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            });
        });

        // Animate stat cards on load
        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.5s ease-out';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });

        // Course action buttons
        const courseActions = document.querySelectorAll('.course-action');
        courseActions.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Simple animation feedback
                this.textContent = 'Loading...';
                this.disabled = true;
                
                setTimeout(() => {
                    this.textContent = this.textContent === 'Loading...' ? 'Lanjutkan' : 'Selesaikan';
                    this.disabled = false;
                    
                    // Show success message (in real app would navigate to course)
                    showNotification('Membuka kursus...', 'success');
                }, 800);
            });
        });

        // Wallet buttons
        const walletBtns = document.querySelectorAll('.wallet-btn');
        walletBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const action = this.textContent.includes('Withdraw') ? 'Withdraw' : 'Riwayat';
                showNotification(`Membuka ${action}...`, 'info');
            });
        });
    }

    // ===========================
    // Notification System
    // ===========================
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background-color: ${type === 'success' ? '#2E7D32' : type === 'error' ? '#C62828' : '#1565C0'};
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
            max-width: 300px;
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
        
        // Add animations
        if (!document.getElementById('notification-animations')) {
            const style = document.createElement('style');
            style.id = 'notification-animations';
            style.textContent = `
                @keyframes slideInRight {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes slideOutRight {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // ===========================
    // Execute when DOM is ready
    // ===========================
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ===========================
    // Handle Page Visibility
    // ===========================
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // Pause animations when page is not visible
            console.log('Page hidden - animations paused');
        } else {
            // Resume animations when page is visible
            console.log('Page visible - animations resumed');
        }
    });

})();
