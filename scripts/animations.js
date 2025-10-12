// Mouse follower effect
function initMouseFollower() {
    const mouseFollower = document.querySelector('.mouse-follower');

    document.addEventListener('mousemove', (e) => {
        mouseFollower.style.left = e.clientX + 'px';
        mouseFollower.style.top = e.clientY + 'px';
    });
}

// Intersection Observer for scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Animate skill bars
                if (entry.target.id === 'skills') {
                    document.querySelectorAll('.skill-bar').forEach(bar => {
                        bar.classList.add('animated');
                    });
                }

                // Animate stat counters
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(stat => {
                    animateCounter(stat);
                });
            }
        });
    }, observerOptions);

    // Observe scroll-fade elements
    document.querySelectorAll('.scroll-fade').forEach(el => {
        observer.observe(el);
    });

    // Observe section titles
    document.querySelectorAll('.section-title').forEach(el => {
        observer.observe(el);
    });
}

// Counter animation
function animateCounter(stat) {
    const rawTarget = stat.getAttribute('data-target');
    const hasPlus = rawTarget.includes('+');
    const target = parseInt(rawTarget);
    let current = 0;
    const increment = target / 50;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            stat.textContent = target + (hasPlus ? '+' : '');
            clearInterval(timer);
        } else {
            stat.textContent = Math.floor(current);
        }
    }, 30);
}


// Smooth scroll for anchor links
function initSmoothScroll() {
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
}

// Parallax effect for header
function initParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('.parallax-header');
        if (parallax) {
            parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
}

// Tech badge pulse effect
function initTechBadges() {
    document.querySelectorAll('.tech-badge').forEach(badge => {
        badge.addEventListener('click', () => {
            badge.style.animation = 'pulse 0.5s ease';
            setTimeout(() => {
                badge.style.animation = '';
            }, 500);
        });
    });
}

// Initialize all animations
function initAllAnimations() {
    initMouseFollower();
    initScrollAnimations();
    initSmoothScroll();
    initParallax();
    initTechBadges();
}

// Run on page load
document.addEventListener('DOMContentLoaded', initAllAnimations);