// Animation utilities for the casino game
class AnimationUtils {
    
    // Money counting animation
    static animateMoneyChange(element, startAmount, endAmount, duration = 1000) {
        const start = Date.now();
        const difference = endAmount - startAmount;
        
        const updateMoney = () => {
            const elapsed = Date.now() - start;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentAmount = startAmount + (difference * easeOutQuart);
            
            element.textContent = `$${currentAmount.toFixed(2)}`;
            
            if (progress < 1) {
                requestAnimationFrame(updateMoney);
            } else {
                element.textContent = `$${endAmount.toFixed(2)}`;
            }
        };
        
        requestAnimationFrame(updateMoney);
    }
    
    // Shake animation for losing
    static shakeElement(element, duration = 500) {
        element.classList.add('shake');
        setTimeout(() => {
            element.classList.remove('shake');
        }, duration);
    }
    
    // Pulse animation for winning
    static pulseElement(element, duration = 1000) {
        element.classList.add('pulse');
        setTimeout(() => {
            element.classList.remove('pulse');
        }, duration);
    }
    
    // Bounce animation
    static bounceElement(element, duration = 800) {
        element.classList.add('bounce');
        setTimeout(() => {
            element.classList.remove('bounce');
        }, duration);
    }
    
    // Fade in animation
    static fadeIn(element, duration = 500) {
        element.style.opacity = '0';
        element.style.transition = `opacity ${duration}ms ease`;
        
        setTimeout(() => {
            element.style.opacity = '1';
        }, 10);
        
        setTimeout(() => {
            element.style.transition = '';
        }, duration);
    }
    
    // Fade out animation
    static fadeOut(element, duration = 500) {
        element.style.transition = `opacity ${duration}ms ease`;
        element.style.opacity = '0';
        
        setTimeout(() => {
            element.style.display = 'none';
            element.style.transition = '';
        }, duration);
    }
    
    // Slide in from direction
    static slideIn(element, direction = 'left', duration = 500) {
        const directions = {
            left: 'translateX(-100%)',
            right: 'translateX(100%)',
            top: 'translateY(-100%)',
            bottom: 'translateY(100%)'
        };
        
        element.style.transform = directions[direction];
        element.style.transition = `transform ${duration}ms ease`;
        
        setTimeout(() => {
            element.style.transform = 'translate(0)';
        }, 10);
        
        setTimeout(() => {
            element.style.transition = '';
        }, duration);
    }
    
    // Scale animation
    static scaleElement(element, scale = 1.1, duration = 300) {
        element.style.transition = `transform ${duration}ms ease`;
        element.style.transform = `scale(${scale})`;
        
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, duration / 2);
        
        setTimeout(() => {
            element.style.transition = '';
        }, duration);
    }
    
    // Confetti animation for big wins
    static createConfetti(container, count = 50) {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#ff9ff3', '#54a0ff'];
        
        for (let i = 0; i < count; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.cssText = `
                position: absolute;
                width: 10px;
                height: 10px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                top: -10px;
                left: ${Math.random() * 100}%;
                animation: confettiFall ${Math.random() * 3 + 2}s linear forwards;
                transform: rotate(${Math.random() * 360}deg);
            `;
            
            container.appendChild(confetti);
            
            // Remove confetti after animation
            setTimeout(() => {
                if (confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 5000);
        }
    }
    
    // Floating text animation
    static floatingText(text, x, y, color = '#ffd700', duration = 2000) {
        const floatingEl = document.createElement('div');
        floatingEl.textContent = text;
        floatingEl.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            color: ${color};
            font-size: 1.5rem;
            font-weight: bold;
            pointer-events: none;
            z-index: 9999;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
            animation: floatUp ${duration}ms ease-out forwards;
        `;
        
        document.body.appendChild(floatingEl);
        
        setTimeout(() => {
            if (floatingEl.parentNode) {
                floatingEl.parentNode.removeChild(floatingEl);
            }
        }, duration);
    }
    
    // Screen transition animation
    static transitionScreen(fromElement, toElement, direction = 'slide') {
        if (direction === 'slide') {
            fromElement.style.transition = 'transform 0.5s ease';
            fromElement.style.transform = 'translateX(-100%)';
            
            toElement.style.transform = 'translateX(100%)';
            toElement.style.display = 'block';
            toElement.style.transition = 'transform 0.5s ease';
            
            setTimeout(() => {
                toElement.style.transform = 'translateX(0)';
                fromElement.style.display = 'none';
            }, 10);
            
            setTimeout(() => {
                fromElement.style.transition = '';
                fromElement.style.transform = '';
                toElement.style.transition = '';
            }, 500);
        } else if (direction === 'fade') {
            fromElement.style.transition = 'opacity 0.3s ease';
            fromElement.style.opacity = '0';
            
            setTimeout(() => {
                fromElement.style.display = 'none';
                fromElement.style.opacity = '';
                fromElement.style.transition = '';
                
                toElement.style.display = 'block';
                toElement.style.opacity = '0';
                toElement.style.transition = 'opacity 0.3s ease';
                
                setTimeout(() => {
                    toElement.style.opacity = '1';
                }, 10);
                
                setTimeout(() => {
                    toElement.style.transition = '';
                }, 300);
            }, 300);
        }
    }
    
    // Number increment animation
    static animateNumber(element, start, end, duration = 1000, prefix = '', suffix = '') {
        const startTime = Date.now();
        const range = end - start;
        
        const updateNumber = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easeOutCubic = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (range * easeOutCubic));
            
            element.textContent = prefix + current.toLocaleString() + suffix;
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            } else {
                element.textContent = prefix + end.toLocaleString() + suffix;
            }
        };
        
        requestAnimationFrame(updateNumber);
    }
    
    // Ripple effect
    static rippleEffect(element, event) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: rippleAnimation 0.6s linear;
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }
    
    // Initialize CSS animations
    static initializeCSS() {
        if (document.getElementById('animation-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'animation-styles';
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
            
            @keyframes bounce {
                0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
                40%, 43% { transform: translateY(-15px); }
                70% { transform: translateY(-7px); }
                90% { transform: translateY(-3px); }
            }
            
            @keyframes confettiFall {
                0% {
                    transform: translateY(-100vh) rotate(0deg);
                    opacity: 1;
                }
                100% {
                    transform: translateY(100vh) rotate(720deg);
                    opacity: 0;
                }
            }
            
            @keyframes floatUp {
                0% {
                    transform: translateY(0);
                    opacity: 1;
                }
                100% {
                    transform: translateY(-100px);
                    opacity: 0;
                }
            }
            
            @keyframes rippleAnimation {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            
            .shake { animation: shake 0.5s ease-in-out; }
            .pulse { animation: pulse 1s ease-in-out; }
            .bounce { animation: bounce 0.8s ease-in-out; }
        `;
        
        document.head.appendChild(style);
    }
}

// Initialize animations when page loads
document.addEventListener('DOMContentLoaded', () => {
    AnimationUtils.initializeCSS();
});

// Export for global use
if (typeof window !== 'undefined') {
    window.AnimationUtils = AnimationUtils;
}