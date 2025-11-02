// Main JavaScript for Cloud Computing Blog
class CloudComputingBlog {
     constructor() {
        this.currentSection = 0;
        this.totalSections = 0;
        this.translationManager = null;
        this.init();
    }

    

    initializeTranslation() {
        this.translationManager = new TranslationManager();
    }

    init() {
        this.initializeScrollAnimations();
        this.initializeProgressIndicator();
        this.initializeCarousels();
        this.initializeEventListeners();
        this.initializeMissingSections();
        this.initializeTranslation();
    }

    initializeScrollAnimations() {
        const sections = document.querySelectorAll('section');
        this.totalSections = sections.length;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    this.updateCurrentSection(entry.target);
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '-50px 0px -50px 0px'
        });
        
        sections.forEach(section => {
            observer.observe(section);
        });
    }

    initializeProgressIndicator() {
        window.addEventListener('scroll', () => {
            const winHeight = window.innerHeight;
            const docHeight = document.documentElement.scrollHeight;
            const scrollTop = window.pageYOffset;
            const trackLength = docHeight - winHeight;
            const progress = scrollTop / trackLength;
            
            const progressIndicator = document.getElementById('progressIndicator');
            if (progressIndicator) {
                progressIndicator.style.transform = `scaleX(${progress})`;
            }
        });
    }

    initializeCarousels() {
        // Initialize provider carousels
        this.initCarousel('developerScroll', 'developerControls');
        this.initCarousel('serverlessScroll', 'serverlessControls');
    }

    initCarousel(scrollId, controlsId) {
        const scroll = document.getElementById(scrollId);
        const controls = document.getElementById(controlsId);
        
        if (!scroll || !controls) return;

        const items = scroll.querySelectorAll('.provider-scroll-item');
        if (items.length === 0) return;

        const itemWidth = items[0].offsetWidth + 20;
        
        // Create control buttons
        items.forEach((_, index) => {
            const btn = document.createElement('button');
            btn.className = 'carousel-btn';
            btn.setAttribute('aria-label', `Slide ${index + 1}`);
            if (index === 0) btn.classList.add('active');
            
            btn.addEventListener('click', () => {
                scroll.scrollTo({ left: index * itemWidth, behavior: 'smooth' });
                this.updateActiveButton(controls, index);
            });
            
            controls.appendChild(btn);
        });

        // Auto-scroll functionality
        let autoScroll = setInterval(() => {
            const currentIndex = Math.round(scroll.scrollLeft / itemWidth);
            const nextIndex = (currentIndex + 1) % items.length;
            scroll.scrollTo({ left: nextIndex * itemWidth, behavior: 'smooth' });
            this.updateActiveButton(controls, nextIndex);
        }, 4000);

        // Pause auto-scroll on hover
        scroll.addEventListener('mouseenter', () => clearInterval(autoScroll));
        scroll.addEventListener('mouseleave', () => {
            autoScroll = setInterval(() => {
                const currentIndex = Math.round(scroll.scrollLeft / itemWidth);
                const nextIndex = (currentIndex + 1) % items.length;
                scroll.scrollTo({ left: nextIndex * itemWidth, behavior: 'smooth' });
                this.updateActiveButton(controls, nextIndex);
            }, 4000);
        });

        // Update buttons on manual scroll
        scroll.addEventListener('scroll', () => {
            const currentIndex = Math.round(scroll.scrollLeft / itemWidth);
            this.updateActiveButton(controls, currentIndex);
        });
    }

    updateActiveButton(controls, activeIndex) {
        const buttons = controls.querySelectorAll('.carousel-btn');
        buttons.forEach((btn, index) => {
            btn.classList.toggle('active', index === activeIndex);
        });
    }

    initializeEventListeners() {
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Enhanced quiz functionality
        this.initializeEnhancedQuiz();
    }

    initializeEnhancedQuiz() {
        const quizCards = document.querySelectorAll('.quiz-card.enhanced');
        quizCards.forEach(card => {
            card.addEventListener('click', (e) => {
                // Don't toggle if clicking on links or buttons inside the card
                if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') {
                    return;
                }
                card.classList.toggle('active');
            });
        });
    }

    updateCurrentSection(section) {
        const sections = document.querySelectorAll('section');
        const index = Array.from(sections).indexOf(section);
        this.currentSection = index;
    }

    initializeMissingSections() {
        // This would initialize any sections that are missing from your current HTML
        // For now, it's a placeholder for future functionality
        console.log('Blog initialized successfully');
    }

    // Utility method for showing notifications
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add styles for notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '8px',
            color: 'white',
            zIndex: '10000',
            transition: 'all 0.3s ease',
            transform: 'translateX(100%)'
        });

        if (type === 'success') {
            notification.style.background = 'var(--success)';
        } else if (type === 'error') {
            notification.style.background = 'var(--error)';
        } else {
            notification.style.background = 'var(--primary)';
        }

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize the blog when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.cloudBlog = new CloudComputingBlog();
});

// Utility functions
const CloudUtils = {
    // Format numbers with commas
    formatNumber: (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    // Debounce function for performance
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Check if element is in viewport
    isInViewport: (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CloudComputingBlog, CloudUtils };
}