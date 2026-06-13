document.addEventListener('DOMContentLoaded', () => {
    // === DOM ELEMENTS ===
    const header = document.querySelector('header');
    const burgerMenu = document.querySelector('.burger-menu');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('.page-section');
    const reveals = document.querySelectorAll('.reveal');
    const skillBars = document.querySelectorAll('.skill-progress');

    // === 1. MOBILE MENU TOGGLE ===
    if (burgerMenu && navLinks) {
        burgerMenu.addEventListener('click', () => {
            burgerMenu.classList.toggle('open');
            navLinks.classList.toggle('open');
            // Toggle body scroll to prevent background scrolling when menu is open
            document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
        });

        // Close menu when clicking a link
        navItems.forEach(link => {
            link.addEventListener('click', () => {
                burgerMenu.classList.remove('open');
                navLinks.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    // === 2. HEADER SCROLL EFFECT ===
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Trigger once on load in case page is refreshed midway

    // === 3. ACTIVE NAV LINK HIGHLIGHT & SCROLL REVEAL ===
    const activeSectionOptions = {
        root: null, // viewport
        rootMargin: '-20% 0px -40% 0px', // Trigger highlight when section occupies middle part
        threshold: 0.1
    };

    const activeSectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');
                navItems.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href === `#${currentId}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, activeSectionOptions);

    sections.forEach(section => {
        activeSectionObserver.observe(section);
    });

    // === 4. GENERAL SCROLL REVEAL ANIMATION ===
    const revealOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px', // Trigger slightly before the item enters viewport
        threshold: 0.15
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Once it has animated in, we can stop observing it
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    reveals.forEach(el => {
        revealObserver.observe(el);
    });

    // === 5. SKILLS BAR PROGRESS ANIMATION ===
    const skillOptions = {
        root: null,
        threshold: 0.2
    };

    const skillObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const percent = bar.getAttribute('data-percent') || '0%';
                bar.style.width = percent;
                observer.unobserve(bar); // Animate only once
            }
        });
    }, skillOptions);

    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });

    // === 6. SMOOTH SCROLL FOR BUTTONS & LOGO ===
    // (Nav links automatically scroll smoothly via CSS, but custom buttons/logo navigation is handled here)
    const smoothLinks = document.querySelectorAll('.smooth-scroll');
    smoothLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                // Account for header height if page scrolled, or scroll exactly
                const headerOffset = header.offsetHeight;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - (headerOffset - 10);

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});
