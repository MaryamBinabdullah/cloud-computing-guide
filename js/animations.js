// Animation and visual effects for Cloud Computing Blog
class CloudAnimations {
    constructor() {
        this.initializeAnimations();
    }

    initializeAnimations() {
        this.initializeFloatingClouds();
        this.initializeScrollEffects();
        this.initializeHoverEffects();
    }

    initializeFloatingClouds() {
        // Additional cloud animations can be added here
        // The main cloud animations are handled in CSS
        console.log('Cloud animations initialized');
    }

    initializeScrollEffects() {
        // Parallax effects for header
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = document.querySelector('.header-bg-elements');
            
            if (parallax) {
                parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        });

        // Staggered animation for cards
        this.initializeStaggeredAnimations();
    }

    initializeStaggeredAnimations() {
        const cards = document.querySelectorAll('.card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.animation = `fadeInUp 0.6s ease forwards`;
                    }, index * 100);
                }
            });
        }, { threshold: 0.1 });

        cards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            observer.observe(card);
        });

        // Add keyframes for fadeInUp
        this.addAnimationStyles();
    }

    addAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            @keyframes pulse {
                0% {
                    transform: scale(1);
                    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.2);
                }
                70% {
                    transform: scale(1.05);
                    box-shadow: 0 0 0 20px rgba(255, 255, 255, 0);
                }
                100% {
                    transform: scale(1);
                    box-shadow: 0 0 0 0 rgba(255, 255, 255, 0);
                }
            }
        `;
        document.head.appendChild(style);
    }

    initializeHoverEffects() {
        // Add ripple effect to buttons
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.6);
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                `;
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });

        // Add ripple animation
        const rippleStyle = document.createElement('style');
        rippleStyle.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(rippleStyle);
    }
}

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
    window.cloudAnimations = new CloudAnimations();
});