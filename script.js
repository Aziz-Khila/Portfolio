// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Get saved theme or default to dark
const currentTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', currentTheme);

// Theme toggle functionality
themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    // Add transition effect
    themeToggle.style.transform = 'rotate(360deg) scale(0.9)';
    setTimeout(() => {
        themeToggle.style.transform = '';
    }, 300);
});

// Navigation Scroll Effect
const floatingNav = document.getElementById('floatingNav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        floatingNav.classList.add('scrolled');
    } else {
        floatingNav.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Mobile Navigation Toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks') || document.querySelector('.nav-links');
const navBackdrop = document.getElementById('navBackdrop');
let navIgnoreBackdropUntil = 0;

function isMobileNav() {
    return window.matchMedia('(max-width: 1100px)').matches;
}

function syncNavToggleLabel() {
    if (!navToggle) return;
    const open = navLinks?.classList.contains('active');
    const key = open ? 'a11y.menuClose' : 'a11y.menuOpen';
    const label = typeof getTranslation === 'function'
        ? getTranslation(currentLanguage || 'en', key)
        : (open ? 'Close menu' : 'Open menu');
    if (label) navToggle.setAttribute('aria-label', label);
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
}

function setMobileNav(open) {
    if (!navLinks) return;
    const shouldOpen = Boolean(open) && isMobileNav();
    navLinks.classList.toggle('active', shouldOpen);
    navToggle?.classList.toggle('is-open', shouldOpen);
    document.body.classList.toggle('nav-open', shouldOpen);
    if (navBackdrop) {
        if (shouldOpen) {
            navBackdrop.hidden = false;
            navIgnoreBackdropUntil = Date.now() + 400;
        } else {
            navBackdrop.hidden = true;
            navIgnoreBackdropUntil = 0;
        }
    }
    syncNavToggleLabel();
}

if (navToggle) {
    navToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        setMobileNav(!navLinks.classList.contains('active'));
    });
}

if (navBackdrop) {
    navBackdrop.addEventListener('click', () => {
        if (Date.now() < navIgnoreBackdropUntil) return;
        setMobileNav(false);
    });
}

// Close mobile nav when clicking a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        setMobileNav(false);
    });
});

window.addEventListener('resize', () => {
    if (!isMobileNav()) setMobileNav(false);
});

function getFocusable(container) {
    return [...container.querySelectorAll(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    )].filter(el => {
        if (el.hasAttribute('disabled') || el.getAttribute('aria-hidden') === 'true') return false;
        const style = window.getComputedStyle(el);
        return style.visibility !== 'hidden' && style.display !== 'none';
    });
}

function trapFocus(container, event) {
    if (event.key !== 'Tab') return;
    const focusable = getFocusable(container);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
    }
}

let lastFocusedBeforeModal = null;

function activateFocusTrap(container) {
    lastFocusedBeforeModal = document.activeElement;
    const focusable = getFocusable(container);
    (focusable[0] || container).focus();
    container._focusTrapHandler = (e) => trapFocus(container, e);
    document.addEventListener('keydown', container._focusTrapHandler);
}

function deactivateFocusTrap(container) {
    if (container?._focusTrapHandler) {
        document.removeEventListener('keydown', container._focusTrapHandler);
        container._focusTrapHandler = null;
    }
    if (lastFocusedBeforeModal && typeof lastFocusedBeforeModal.focus === 'function') {
        lastFocusedBeforeModal.focus();
    }
    lastFocusedBeforeModal = null;
}

// Active Navigation Link
const sections = document.querySelectorAll('section');
const navLinksElements = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinksElements.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Smooth Scroll for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all sections and animated elements
document.querySelectorAll('section').forEach(section => {
    section.classList.add('fade-in');
    observer.observe(section);
});

// Animate Stats Counter
const animateCounter = (element) => {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };
    
    updateCounter();
};

// Observe stat numbers
const statNumbers = document.querySelectorAll('.stat-number');
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            entry.target.classList.add('animated');
            animateCounter(entry.target);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(stat => {
    statsObserver.observe(stat);
});

// Parallax Effect for Hero Background
window.addEventListener('scroll', () => {
    if (typeof prefersReducedMotion !== 'undefined' && prefersReducedMotion) return;
    const scrolled = window.pageYOffset;
    const heroBackground = document.querySelector('.hero-background');
    if (heroBackground && scrolled < window.innerHeight) {
        heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Form Submission via FormSubmit
const contactForm = document.querySelector('#contactForm') || document.querySelector('.form');
if (contactForm) {
    const button = contactForm.querySelector('#contactSubmit') || contactForm.querySelector('.btn-primary');
    const statusEl = document.getElementById('formStatus');
    const defaultLabel = () => translations?.[currentLanguage]?.contact?.form?.submit
        || translations?.en?.contact?.form?.submit
        || 'Send Message';

    const setStatus = (message, type = '') => {
        if (!statusEl) return;
        statusEl.textContent = message;
        statusEl.className = `form-status${type ? ` is-${type}` : ''}`;
    };

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (button.disabled) return;

        const formData = new FormData(contactForm);
        const payload = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message'),
            _subject: formData.get('_subject') || 'Portfolio contact — Mohamed Aziz Khila',
            _template: 'table',
            _honey: formData.get('_honey') || ''
        };

        const originalText = button.textContent;
        button.disabled = true;
        button.textContent = translations?.[currentLanguage]?.contact?.form?.sending
            || 'Sending...';
        setStatus('');

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`Request failed (${response.status})`);
            }

            button.textContent = translations?.[currentLanguage]?.contact?.form?.sent
                || 'Message Sent!';
            button.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            setStatus(
                translations?.[currentLanguage]?.contact?.form?.success
                    || 'Thanks — your message was sent successfully.',
                'success'
            );
            contactForm.reset();
        } catch (error) {
            button.textContent = defaultLabel();
            setStatus(
                translations?.[currentLanguage]?.contact?.form?.error
                    || 'Something went wrong. Please email khilaaziz7@gmail.com directly.',
                'error'
            );
        } finally {
            setTimeout(() => {
                button.disabled = false;
                button.textContent = defaultLabel();
                button.style.background = '';
            }, 3200);
        }
    });
}

// Motion / device preferences
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;

// Particle System
const canvas = document.getElementById('particleCanvas');
if (canvas && !prefersReducedMotion) {
    const ctx = canvas.getContext('2d');
    let animationId = null;
    let isVisible = !document.hidden;

    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    resizeCanvas();

    const particles = [];
    const particleCount = window.innerWidth < 768 ? 36 : window.innerWidth < 1200 ? 60 : 80;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 2 - 1;
            this.speedY = Math.random() * 2 - 1;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x > canvas.width) this.x = 0;
            if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            if (this.y < 0) this.y = canvas.height;
        }

        draw() {
            ctx.fillStyle = 'rgba(99, 102, 241, ' + this.opacity + ')';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animateParticles() {
        if (!isVisible) {
            animationId = null;
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });

        const linkDistance = window.innerWidth < 768 ? 100 : 140;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < linkDistance) {
                    ctx.strokeStyle = 'rgba(99, 102, 241, ' + (0.18 * (1 - distance / linkDistance)) + ')';
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        animationId = requestAnimationFrame(animateParticles);
    }

    const startParticles = () => {
        if (!animationId && isVisible) {
            animationId = requestAnimationFrame(animateParticles);
        }
    };

    document.addEventListener('visibilitychange', () => {
        isVisible = !document.hidden;
        if (isVisible) startParticles();
        else if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    });

    window.addEventListener('resize', resizeCanvas);
    startParticles();
} else if (canvas) {
    canvas.style.display = 'none';
}

// Mouse Move Parallax for Terminal
const heroVisual = document.querySelector('.hero-visual');
if (heroVisual && !prefersReducedMotion && !isTouchDevice) {
    document.addEventListener('mousemove', (e) => {
        const terminal = document.querySelector('.code-terminal');
        const mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        const mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        if (terminal) {
            terminal.style.transform = 'translate(' + (mouseX * 15) + 'px, ' + (mouseY * 15) + 'px)';
        }
    });
}

// Enhanced Cursor with Trail (desktop only)
if (!isTouchDevice && !prefersReducedMotion) {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    const cursorTrail = [];
    const trailLength = 5;

    for (let i = 0; i < trailLength; i++) {
        const trailDot = document.createElement('div');
        trailDot.className = 'cursor-trail';
        trailDot.style.cssText =
            'position: fixed;' +
            'width: ' + (8 - i) + 'px;' +
            'height: ' + (8 - i) + 'px;' +
            'border-radius: 50%;' +
            'background: rgba(99, 102, 241, ' + (0.3 - i * 0.05) + ');' +
            'pointer-events: none;' +
            'z-index: 9998;' +
            'transform: translate(-50%, -50%);' +
            'transition: all 0.1s ease;';
        document.body.appendChild(trailDot);
        cursorTrail.push({ element: trailDot });
    }

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        cursorTrail.forEach((trail, index) => {
            setTimeout(() => {
                trail.element.style.left = e.clientX + 'px';
                trail.element.style.top = e.clientY + 'px';
            }, index * 20);
        });
    });

    const bindCursorHover = () => {
        document.querySelectorAll('a, button, .project-card, .skill-chip, .cv-document').forEach(element => {
            if (element.dataset.cursorBound) return;
            element.dataset.cursorBound = '1';
            element.addEventListener('mouseenter', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursor.style.borderColor = 'var(--accent-color)';
                cursorTrail.forEach(trail => {
                    trail.element.style.background = 'rgba(236, 72, 153, 0.3)';
                });
            });
            element.addEventListener('mouseleave', () => {
                cursor.style.transform = 'translate(-50%, -50%) scale(1)';
                cursor.style.borderColor = 'var(--primary-color)';
                cursorTrail.forEach(trail => {
                    trail.element.style.background = 'rgba(99, 102, 241, 0.3)';
                });
            });
        });
    };

    bindCursorHover();
    window.addEventListener('load', bindCursorHover);
} else {
    document.body.classList.add('native-cursor');
}

// 3D Tilt Effect for Project Cards
function attachProjectCardTilt(card) {
    if (typeof prefersReducedMotion !== 'undefined' && prefersReducedMotion) return;
    if (typeof isTouchDevice !== 'undefined' && isTouchDevice) return;

    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
}

// Project Modal
const projectModal = document.getElementById('projectModal');
const projectModalClose = document.getElementById('projectModalClose');
const projectModalVideo = document.getElementById('projectModalVideo');
const projectModalTitle = document.getElementById('projectModalTitle');
const projectModalCategory = document.getElementById('projectModalCategory');
const projectModalTech = document.getElementById('projectModalTech');
const projectModalDescription = document.getElementById('projectModalDescription');
const projectModalFeatures = document.getElementById('projectModalFeatures');

// Populate Projects Grid
function populateProjects() {
    const projectsGrid = document.getElementById('projectsGrid');
    if (!projectsGrid || typeof projects === 'undefined') return;

    const lang = localStorage.getItem('portfolio-language') || 'en';
    const pick = (field) => (typeof localizedText === 'function' ? localizedText(field, lang) : (field?.[lang] || field?.en || field || ''));
    
    projectsGrid.innerHTML = '';
    projectsGrid.setAttribute('data-count', String(projects.length));

    projects.forEach(project => {
        const title = pick(project.title);
        const category = pick(project.category);
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.setAttribute('data-project-id', project.id);
        projectCard.setAttribute('role', 'button');
        projectCard.setAttribute('tabindex', '0');
        projectCard.setAttribute('aria-label', `${title} — ${category}`);
        
        projectCard.innerHTML = `
            <div class="project-image">
                <div class="project-placeholder" aria-hidden="true">
                    <div class="project-placeholder-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6">
                            <rect x="3" y="5" width="18" height="14" rx="3"></rect>
                            <path d="M10 9.5v5l4.5-2.5L10 9.5z" fill="currentColor" stroke="none"></path>
                        </svg>
                    </div>
                    <div class="project-placeholder-copy">
                        <span class="project-placeholder-title">${title}</span>
                        <span class="project-placeholder-category">${category}</span>
                    </div>
                </div>
                <video class="project-thumbnail" preload="none" muted playsinline>
                    <source src="${project.video}" type="video/mp4">
                </video>
                <div class="project-grid-overlay"></div>
                <div class="project-scan-effect"></div>
                <div class="project-overlay">
                    <div class="project-info">
                        <h3 class="project-title">${title}</h3>
                        <p class="project-category">${category}</p>
                        <div class="project-link-icon">→</div>
                    </div>
                </div>
                <div class="project-play-button">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                </div>
                <div class="project-glow"></div>
            </div>
        `;
        
        projectsGrid.appendChild(projectCard);
        
        const open = () => openProjectModal(project);
        projectCard.addEventListener('click', open);
        projectCard.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                open();
            }
        });
        
        // Add hover effect to play video thumbnail (load only when needed)
        const video = projectCard.querySelector('.project-thumbnail');
        projectCard.addEventListener('mouseenter', () => {
            if (video.readyState < 2) {
                video.load();
            }
            video.play().catch(() => {});
        });
        projectCard.addEventListener('mouseleave', () => {
            video.pause();
            video.currentTime = 0;
        });

        attachProjectCardTilt(projectCard);
    });
}

// Store current project in modal for language updates
let currentProjectInModal = null;

// Open Project Modal
function openProjectModal(project) {
    currentProjectInModal = project;
    updateProjectModalContent();
    projectModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    projectModalVideo.load();
    activateFocusTrap(projectModal);
}

// Update Project Modal Content (called when language changes)
function updateProjectModalContent() {
    if (!currentProjectInModal) return;
    
    const currentLang = localStorage.getItem('portfolio-language') || 'en';
    const project = currentProjectInModal;
    const pick = (field) => (typeof localizedText === 'function' ? localizedText(field, currentLang) : (field?.[currentLang] || field?.en || field || ''));
    
    projectModalVideo.src = project.video;
    projectModalTitle.textContent = pick(project.title);
    projectModalCategory.textContent = pick(project.category);
    
    // Update description
    projectModalDescription.textContent = project.description[currentLang] || project.description.en;
    
    // Update tech stack
    projectModalTech.innerHTML = project.tech.map(tech => 
        `<span class="tech-badge">${tech}</span>`
    ).join('');
    
    // Update features
    const features = project.features[currentLang] || project.features.en;
    const featuresTitle = (typeof getTranslation === 'function'
        ? getTranslation(currentLang, 'projects.features')
        : null) || 'Key Features:';
    projectModalFeatures.innerHTML = `<h4>${featuresTitle}</h4><ul>` + 
        features.map(feature => `<li>${feature}</li>`).join('') + 
        '</ul>';
}

// Close Project Modal
function closeProjectModal() {
    projectModal.classList.remove('active');
    document.body.style.overflow = '';
    projectModalVideo.pause();
    projectModalVideo.currentTime = 0;
    currentProjectInModal = null;
    deactivateFocusTrap(projectModal);
}

// Close Project Modal event listeners
projectModalClose.addEventListener('click', () => {
    closeProjectModal();
});

projectModal.addEventListener('click', (e) => {
    if (e.target === projectModal || e.target.classList.contains('project-modal-backdrop')) {
        closeProjectModal();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal.classList.contains('active')) {
        closeProjectModal();
    }
});

// Populate Skills Grid
function populateSkills() {
    const skillsGrid = document.getElementById('skillsGrid');
    if (!skillsGrid || typeof skillsData === 'undefined') return;

    const lang = localStorage.getItem('portfolio-language') || 'en';
    skillsGrid.innerHTML = '';
    skillsGrid.classList.add('skills-groups');

    skillsData.forEach((group, groupIndex) => {
        const groupEl = document.createElement('article');
        groupEl.className = 'skill-group';
        groupEl.style.setProperty('--item-index', String(groupIndex));

        const title = group.category?.[lang] || group.category?.en || '';
        const itemsHtml = group.items.map(skill => {
            const iconHtml = skill.icon
                ? `<img src="${skill.icon}" alt="" class="skill-chip-icon${skill.name.toLowerCase() === 'laravel' ? ' is-large' : ''}">`
                : `<span class="skill-chip-initials">${skill.initials || skill.name.slice(0, 2)}</span>`;

            return `
                <div class="skill-chip">
                    <div class="skill-chip-media">${iconHtml}</div>
                    <span class="skill-chip-name">${skill.name}</span>
                </div>
            `;
        }).join('');

        groupEl.innerHTML = `
            <h3 class="skill-group-title">${title}</h3>
            <div class="skill-chip-grid">${itemsHtml}</div>
        `;

        skillsGrid.appendChild(groupEl);
    });
}

function populateExperience() {
    const timeline = document.getElementById('experienceTimeline');
    const educationGrid = document.getElementById('educationGrid');
    const lang = localStorage.getItem('portfolio-language') || 'en';

    if (timeline && typeof experienceData !== 'undefined') {
        timeline.innerHTML = experienceData.map((item, index) => {
            const type = item.type?.[lang] || item.type?.en || '';
            const tech = Array.isArray(item.tech) ? item.tech : [];
            return `
            <article class="experience-item" style="--item-index: ${index}">
                <div class="experience-marker" aria-hidden="true"></div>
                <div class="experience-card">
                    <div class="experience-card-meta">
                        <span class="experience-period">${item.period}</span>
                        ${type ? `<span class="experience-type">${type}</span>` : ''}
                    </div>
                    <h3 class="experience-role">${item.title[lang] || item.title.en}</h3>
                    <p class="experience-company">${item.company[lang] || item.company.en}</p>
                    <ul class="experience-points">
                        ${(item.points[lang] || item.points.en).map(point => `<li>${point}</li>`).join('')}
                    </ul>
                    ${tech.length ? `<div class="experience-tech">${tech.map(tag => `<span class="experience-tech-tag">${tag}</span>`).join('')}</div>` : ''}
                </div>
            </article>
        `;
        }).join('');
    }

    if (educationGrid && typeof educationData !== 'undefined') {
        educationGrid.innerHTML = educationData.map((item, index) => `
            <article class="education-card" style="--item-index: ${index}">
                <div class="education-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                        <path d="M22 10L12 5 2 10l10 5 10-5z"/>
                        <path d="M6 12v5c0 1 3 3 6 3s6-2 6-3v-5"/>
                    </svg>
                </div>
                <div class="education-body">
                    <span class="experience-period">${item.period}</span>
                    <h3 class="experience-role">${item.title[lang] || item.title.en}</h3>
                    <p class="experience-company is-school">${item.school[lang] || item.school.en}</p>
                </div>
            </article>
        `).join('');
    }

    observeExperienceReveal();
}

function observeExperienceReveal() {
    const revealItems = document.querySelectorAll('.experience-item, .education-card');
    if (!revealItems.length) return;

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2, rootMargin: '0px 0px -40px 0px' });

    revealItems.forEach(item => revealObserver.observe(item));
}

const CV_PDF_SRC = 'media/CV%20Khila%20Mohamed%20Aziz.pdf#toolbar=0&navpanes=0';
const cvWindow = document.getElementById('cvWindow');
const cvWindowFrame = document.getElementById('cvWindowFrame');
const cvPreviewOpen = document.getElementById('cvPreviewOpen');
const cvDocumentOpen = document.getElementById('cvDocumentOpen');
const cvWindowClose = document.getElementById('cvWindowClose');
const cvWindowBackdrop = document.getElementById('cvWindowBackdrop');

function openCvWindow() {
    if (!cvWindow || !cvWindowFrame) return;
    if (!cvWindowFrame.getAttribute('src')) {
        cvWindowFrame.setAttribute('src', CV_PDF_SRC);
    }
    cvWindow.hidden = false;
    requestAnimationFrame(() => {
        cvWindow.classList.add('active');
        activateFocusTrap(cvWindow);
    });
    document.body.style.overflow = 'hidden';
}

function closeCvWindow() {
    if (!cvWindow) return;
    cvWindow.classList.remove('active');
    document.body.style.overflow = '';
    deactivateFocusTrap(cvWindow);
    setTimeout(() => {
        if (!cvWindow.classList.contains('active')) {
            cvWindow.hidden = true;
        }
    }, 300);
}

[cvPreviewOpen, cvDocumentOpen].forEach(trigger => {
    if (trigger) trigger.addEventListener('click', openCvWindow);
});

if (cvWindowClose) {
    cvWindowClose.addEventListener('click', closeCvWindow);
}

if (cvWindowBackdrop) {
    cvWindowBackdrop.addEventListener('click', closeCvWindow);
}

document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (navLinks?.classList.contains('active')) {
        setMobileNav(false);
        return;
    }
    if (cvWindow && cvWindow.classList.contains('active')) {
        closeCvWindow();
    }
});

// Initialize animations on load
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Populate projects
    populateProjects();
    populateExperience();
    populateSkills();
    
    // Trigger initial animations
    setTimeout(() => {
        document.querySelectorAll('.fade-in').forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('visible');
            }, index * 100);
        });
    }, 100);
    
    // Initialize language if translations.js is loaded
    if (typeof setLanguage === 'function') {
        const savedLang = localStorage.getItem('portfolio-language') || 'en';
        setLanguage(savedLang);
    }
});

