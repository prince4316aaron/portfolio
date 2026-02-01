document.addEventListener('DOMContentLoaded', function() {
    
    // ===== MOBILE MENU TOGGLE =====
    const hamburger = document.getElementById('hamburger');
    const navbar = document.getElementById('navbar');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const navLinks = document.querySelectorAll('.navbar-buttons a');
    
    function toggleMobileMenu() {
        hamburger.classList.toggle('active');
        navbar.classList.toggle('active');
        mobileMenuOverlay.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    }
    
    function closeMobileMenu() {
        hamburger.classList.remove('active');
        navbar.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        document.body.classList.remove('menu-open');
    }
    
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }
    
    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', closeMobileMenu);
    }
    
    // Close menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // ===== HEADER SCROLL EFFECT =====
    const header = document.querySelector('header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // ===== ACTIVE LINK HIGHLIGHTER =====
    const sections = document.querySelectorAll('section');

    function updateActiveLink() {
        let currentSection = "";
        const scrollY = window.scrollY + (window.innerHeight / 3);

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.clientHeight;
            
            if (scrollY >= sectionTop && scrollY < sectionBottom) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                const targetId = href.substring(1);
                if (targetId === currentSection) {
                    link.classList.add('active');
                }
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink();

    // ===== SMOOTH SCROLL FOR NAVIGATION =====
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    const headerHeight = header.offsetHeight;
                    const targetPosition = targetSection.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // ===== SCROLL ANIMATION WITH INTERSECTION OBSERVER =====
    const animatedSections = document.querySelectorAll('.first-section, .second-section, .third-section, .fourth-section, .fifth-section');
    
    // Force sections to start hidden
    animatedSections.forEach(section => {
        section.classList.remove('show');
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // Section is in viewport - show it
                entry.target.classList.add('show');
                
                // Animate child elements with stagger effect
                const cards = entry.target.querySelectorAll('.skill-category, .service-card, .hobby-card, .trait-block');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(30px)';
                        
                        setTimeout(() => {
                            card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 50);
                    }, index * 100);
                });
            } else {
                // Section is out of viewport - hide it
                entry.target.classList.remove('show');
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '-50px 0px -50px 0px'
    });

    animatedSections.forEach((section) => observer.observe(section));

    // ===== CONTACT FORM HANDLING WITH EMAILJS =====
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalHTML = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending...</span>';
            submitBtn.disabled = true;
            
            // Get form data
            const templateParams = {
                from_name: document.getElementById('name').value,
                reply_to: document.getElementById('email').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };
            
            // Send email using EmailJS
            // Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with your actual EmailJS IDs
            emailjs.send('service_3n7vjc7', 'template_3wviv8j', templateParams)
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    
                    // Show success message
                    submitBtn.innerHTML = '<i class="fas fa-check"></i> <span>Message Sent!</span>';
                    submitBtn.style.background = 'linear-gradient(135deg, #27ae60, #2ecc71)';
                    
                    formStatus.innerHTML = '<div class="success-message"><i class="fas fa-check-circle"></i> Thank you! Your message has been sent successfully. I\'ll get back to you soon.</div>';
                    formStatus.style.display = 'block';
                    
                    // Reset form
                    contactForm.reset();
                    
                    // Reset button after 3 seconds
                    setTimeout(() => {
                        submitBtn.innerHTML = originalHTML;
                        submitBtn.style.background = '';
                        submitBtn.disabled = false;
                        formStatus.style.display = 'none';
                    }, 5000);
                }, function(error) {
                    console.error('FAILED...', error);
                    
                    // Show error message
                    submitBtn.innerHTML = '<i class="fas fa-times"></i> <span>Failed to Send</span>';
                    submitBtn.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
                    
                    formStatus.innerHTML = '<div class="error-message"><i class="fas fa-exclamation-circle"></i> Oops! Something went wrong. Please try again or contact me directly at princeaaron@gmail.com</div>';
                    formStatus.style.display = 'block';
                    
                    // Reset button after 3 seconds
                    setTimeout(() => {
                        submitBtn.innerHTML = originalHTML;
                        submitBtn.style.background = '';
                        submitBtn.disabled = false;
                    }, 3000);
                });
        });
        
        // Add floating label effect
        const formInputs = contactForm.querySelectorAll('input, textarea');
        formInputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                if (this.value === '') {
                    this.parentElement.classList.remove('focused');
                }
            });
        });
    }

    // ===== SERVICE CARDS DETAIL VIEW =====
    const serviceCards = document.querySelectorAll('.service-card');
    const serviceCardsView = document.getElementById('serviceCardsView');
    const detailView = document.getElementById('detailView');
    const detailContent = document.getElementById('detailContent');
    const backBtn = document.getElementById('backBtn');

    // Service details data
    const serviceDetails = {
        customer: {
            title: 'Customer Support',
            icon: 'fa-phone-volume',
            experiences: [
                {
                    position: 'Waiter',
                    company: 'Queensland Las Piñas City',
                    period: '2018 - 2018',
                    role: 'Catering Services',
                    responsibilities: [
                        'Managed event planning and execution for various occasions, including birthdays, baby showers, and weddings',
                        'Set up events ensuring all details aligned with client expectations',
                        'Provided exceptional service during events, ensuring guest satisfaction'
                    ]
                },
                {
                    position: 'Call Center Agent',
                    company: 'Teleperformance Pasay MOA',
                    period: '2022 - 2022',
                    role: 'Customer Service Representative',
                    responsibilities: [
                        'Handled international calls in a healthcare line of business',
                        'Scheduled appointments with healthcare providers',
                        'Processed prescription overrides for pharmacies',
                        'Meticulously documented all customer interactions'
                    ]
                },
                {
                    position: 'Customer Advisor I',
                    company: 'Concentrix Pasay MOA',
                    period: '2025 - 2026',
                    role: 'Customer Advisor I',
                    responsibilities: [
                        'Handled international calls in a financial line of business',
                        'Processed dispute transactions and card requests',
                        'Managed document requests and inquiries',
                        'Guided customers through website and app navigation',
                        'Provided comprehensive support for account-related concerns'
                    ]
                }
            ],
            tools: [
                { icon: 'fa-headset', name: 'Zendesk', description: 'Customer support ticketing' },
                { icon: 'fa-phone', name: 'VoIP Systems', description: 'Call management' },
                { icon: 'fa-envelope', name: 'Email Tools', description: 'Multi-channel support' }
            ]
        },
        admin: {
            title: 'Administrative Support',
            icon: 'fa-briefcase',
            experiences: [
                {
                    position: 'Administrative Assistant',
                    company: 'Various Projects',
                    period: '2020 - Present',
                    role: 'Virtual Assistant',
                    responsibilities: [
                        'Calendar management and appointment scheduling',
                        'Email correspondence and inbox organization',
                        'Document preparation and data entry',
                        'Meeting coordination and minutes preparation',
                        'Task prioritization and deadline management'
                    ]
                }
            ],
            tools: [
                { icon: 'fa-microsoft', name: 'MS Office', description: 'Word, Excel, PowerPoint' },
                { icon: 'fa-google', name: 'Google Workspace', description: 'Docs, Sheets, Calendar' },
                { icon: 'fa-trello', name: 'Trello', description: 'Task management' },
                { icon: 'fa-slack', name: 'Slack', description: 'Team communication' }
            ]
        },
        project: {
            title: 'Project Coordination',
            icon: 'fa-chart-bar',
            experiences: [
                {
                    position: 'Project Coordinator',
                    company: 'Freelance Projects',
                    period: '2021 - Present',
                    role: 'Project Management Support',
                    responsibilities: [
                        'Coordinated project timelines and deliverables',
                        'Tracked project milestones and progress',
                        'Facilitated team communication and collaboration',
                        'Prepared status reports and presentations',
                        'Managed project documentation and resources'
                    ]
                }
            ],
            tools: [
                { icon: 'fa-tasks', name: 'Asana', description: 'Project tracking' },
                { icon: 'fa-jira', name: 'Jira', description: 'Agile management' },
                { icon: 'fa-chart-gantt', name: 'MS Project', description: 'Timeline planning' }
            ]
        },
        tech: {
            title: 'Tech Support & Development',
            icon: 'fa-laptop',
            experiences: [
                {
                    position: 'Technical Support Specialist',
                    company: 'Various Clients',
                    period: '2020 - Present',
                    role: 'IT Support & Web Development',
                    responsibilities: [
                        'Basic IT troubleshooting and technical support',
                        'Website development and maintenance',
                        'Mobile application development',
                        'Data analysis and reporting',
                        'System optimization and performance monitoring'
                    ]
                }
            ],
            tools: [
                { icon: 'fa-html5', name: 'HTML/CSS/JS', description: 'Web development' },
                { icon: 'fa-react', name: 'React', description: 'Frontend framework' },
                { icon: 'fa-database', name: 'SQL', description: 'Database management' },
                { icon: 'fa-python', name: 'Python', description: 'Data analysis' }
            ]
        }
    };

    function generateDetailHTML(serviceType) {
        const data = serviceDetails[serviceType];
        if (!data) return '';

        let html = `
            <div class="detail-header">
                <i class="fas ${data.icon}"></i>
                <h2>${data.title}</h2>
            </div>
        `;

        if (data.experiences) {
            html += '<div class="timeline-container">';
            data.experiences.forEach(exp => {
                html += `
                    <div class="timeline-item">
                        <h4>${exp.position}</h4>
                        <div class="timeline-company">${exp.company}</div>
                        <div class="timeline-period">${exp.period}</div>
                        <p style="font-weight: 600; color: var(--accent-copper); margin-bottom: 10px;">${exp.role}</p>
                        <ul>
                            ${exp.responsibilities.map(resp => `<li>${resp}</li>`).join('')}
                        </ul>
                    </div>
                `;
            });
            html += '</div>';
        }

        if (data.tools) {
            html += `
                <div class="tools-section">
                    <h3><i class="fas fa-tools"></i> Tools & Technologies</h3>
                    <div class="tools-grid">
                        ${data.tools.map(tool => `
                            <div class="tool-card">
                                <h5><i class="fab ${tool.icon}"></i> ${tool.name}</h5>
                                <p>${tool.description}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        return html;
    }

    // Add click handlers to service cards
    serviceCards.forEach(card => {
        const learnMoreBtn = card.querySelector('.learn-more-btn');
        if (learnMoreBtn) {
            learnMoreBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const serviceType = card.getAttribute('data-service');
                showDetailView(serviceType);
            });
        }
        
        card.addEventListener('click', () => {
            const serviceType = card.getAttribute('data-service');
            showDetailView(serviceType);
        });
    });

    function showDetailView(serviceType) {
        const html = generateDetailHTML(serviceType);
        detailContent.innerHTML = html;
        
        serviceCardsView.style.display = 'none';
        detailView.style.display = 'block';
        
        // Scroll to top of section
        document.getElementById('experience').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    if (backBtn) {
        backBtn.addEventListener('click', () => {
            detailView.style.display = 'none';
            serviceCardsView.style.display = 'grid';
            
            // Scroll to top of section
            document.getElementById('experience').scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }

    // ===== PARALLAX EFFECT ON SCROLL =====
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        // Parallax for first section
        const firstSection = document.querySelector('.first-section');
        if (firstSection) {
            const parallaxElements = firstSection.querySelectorAll('.welcomePage, .profile-picture');
            parallaxElements.forEach((element, index) => {
                const speed = (index + 1) * 0.3;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });
        }
    });

    // ===== SKILL ITEMS HOVER EFFECT =====
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.skill-icon');
            icon.style.transform = 'rotate(360deg) scale(1.1)';
        });
        
        item.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.skill-icon');
            icon.style.transform = 'rotate(0deg) scale(1)';
        });
    });

    // ===== LOADING ANIMATION =====
    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
        
        // Trigger first section animation immediately
        const firstSection = document.querySelector('.first-section');
        if (firstSection) {
            setTimeout(() => {
                firstSection.classList.add('show');
            }, 100);
        }
    });

    // ===== DYNAMIC YEAR IN FOOTER =====
    const footerYear = document.querySelector('footer p');
    if (footerYear) {
        const currentYear = new Date().getFullYear();
        footerYear.innerHTML = footerYear.innerHTML.replace('2024', currentYear);
    }

    // ===== PERFORMANCE: DEBOUNCE SCROLL EVENTS =====
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Apply debounce to scroll-heavy functions
    const debouncedScroll = debounce(() => {
        updateActiveLink();
    }, 10);

    window.addEventListener('scroll', debouncedScroll);

    console.log('%c👋 Hello! Thanks for checking out the code!', 'font-size: 20px; color: #C9A961; font-weight: bold;');
    console.log('%cBuilt with care by Prince Aaron', 'font-size: 14px; color: #4A443F;');
}); 