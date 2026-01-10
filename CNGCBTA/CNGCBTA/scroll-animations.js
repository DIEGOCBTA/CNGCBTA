/**
 * Scroll Animations using Intersection Observer
 * Creates smooth reveal animations as elements enter the viewport
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all animated elements
    initScrollAnimations();
    initNavbarScroll();
    initScheduleTabs();
    initFaqAccordion();
    initLanguageSelector();
    initBadgeGenerator();
});

/**
 * Initialize scroll-triggered animations
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animate]');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const delay = element.dataset.delay || 0;

                setTimeout(() => {
                    element.classList.add('animate-in');
                }, delay * 1000);

                // Unobserve after animation
                observer.unobserve(element);
            }
        });
    }, observerOptions);

    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Navbar scroll effect - add background on scroll
 */
function initNavbarScroll() {
    const navbar = document.querySelector('.nav-bar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scroll for nav links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Schedule tabs functionality
 */
function initScheduleTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    const days = document.querySelectorAll('.schedule-day');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const day = tab.dataset.day;

            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Show corresponding day
            days.forEach(d => {
                d.classList.remove('active');
                if (d.dataset.day === day) {
                    d.classList.add('active');
                    // Re-animate items
                    d.querySelectorAll('[data-animate]').forEach(item => {
                        item.classList.remove('animate-in');
                        setTimeout(() => {
                            item.classList.add('animate-in');
                        }, 100);
                    });
                }
            });
        });
    });
}

/**
 * FAQ accordion functionality
 */
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all other items
            faqItems.forEach(i => i.classList.remove('active'));

            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

/**
 * Language selector functionality with translations
 */
function initLanguageSelector() {
    const langButtons = document.querySelectorAll('.lang-btn');

    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;

            // Update active button
            langButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Apply translations
            applyTranslations(lang);

            // Save preference
            localStorage.setItem('congress-lang', lang);
        });
    });

    // Load saved language preference
    const savedLang = localStorage.getItem('congress-lang') || 'es';
    const savedBtn = document.querySelector(`[data-lang="${savedLang}"]`);
    if (savedBtn) {
        savedBtn.click();
    }
}

/**
 * Translation strings
 */
const translations = {
    es: {
        // Navigation
        'nav.about': 'Acerca de',
        'nav.speakers': 'Ponentes',
        'nav.experience': 'Programa',
        'nav.courses': 'Cursos',
        'nav.faq': 'Dudas',
        'nav.register': 'Registrarse',

        // Hero
        'hero.badge': '23 de Enero 2026 • Modalidad En Línea',
        'hero.title1': 'VII Congreso Académico',
        'hero.title2': 'CBTa 197: Metodología STEAM',
        'hero.title3': '2026',
        'hero.subtitle': '“Divulgación Científica y Metodología STEAM: Soluciones con Ciencia”. Fortaleciendo la formación continua docente para los retos globales.',
        'hero.cta1': 'Registrarse Gratis',
        'hero.cta2': 'Ver Cronograma',
        'hero.stat1': 'Ponentes',
        'hero.stat2': 'Talleres',
        'hero.stat3': 'Países',
        'hero.stat4': 'Asistentes',
        'hero.scroll': 'Explora el Congreso',

        // About
        'about.tag': 'VII Congreso CBTa 197',
        'about.title': 'Divulgación Científica y Metodología STEAM',
        'about.card1.title': 'Objetivo Central',
        'about.card1.desc': 'Fortalecer la formación continua docente y garantizar una educación de calidad ante los retos globales.',
        'about.card2.title': 'Modalidad Online',
        'about.card2.desc': 'Transmisión simultánea en Google Meet, YouTube y Facebook Live de forma gratuita.',
        'about.card3.title': 'Soluciones con Ciencia',
        'about.card3.desc': 'Enfoque en la metodología STEAM como catalizador de innovación y pensamiento crítico.',
        'about.card4.title': 'Red Internacional',
        'about.card4.desc': 'Conectando expertos de México, España, Colombia y Panamá para encender la chispa del aprendizaje.',

        // Speakers
        'speakers.tag': 'Expertos Internacionales',
        'speakers.title': 'Ponentes Destacados',
        'speakers.confirmed': 'Confirmado',
        'speakers.talkLabel': 'Tema:',
        'speakers.duration': '50 min',
        'speakers.joinLink': 'Ver Perfil Completo →',
        'speakers.s1.role': 'Education Project Manager • Letcraft Educación (España)',
        'speakers.s1.talk': '"Minecraft Education para el aprendizaje de Ciencias"',
        'speakers.s2.role': 'CEO Libros Mágicos • Experto en IA (Colombia)',
        'speakers.s2.talk': '"Investigación potenciada con Inteligencia Artificial"',
        'speakers.s3.role': 'Educadora en Pedagogías Alternativas (Panamá)',
        'speakers.s3.talk': '"Artes en la Ciencia: Pensamiento Artístico"',
        'speakers.s4.role': 'Doctora en Ciencias (México)',
        'speakers.s4.talk': '"Cultura Científica: Toma de decisiones"',

        // Experience
        'experience.tag': 'Cronograma del Congreso',
        'experience.title': 'Programa y Experiencia',

        // Panels
        'panels.tag': 'Discusiones en Vivo',
        'panels.title': 'Paneles de Expertos',
        'panels.jan': 'ENE',
        'panels.panelists': 'Panelistas:',
        'panels.liveQA': 'Q&A en vivo',
        'panels.networking': 'Networking',
        'panels.workshop': 'Workshop',
        'panels.joinLink': 'Registrarse al panel →',
        'panels.p1.title': 'Inteligencia Artificial y Ética',
        'panels.p1.desc': 'Un debate sobre los desafíos éticos en el desarrollo de IA y su impacto en la sociedad.',
        'panels.p2.title': 'Innovación Tecnológica en LATAM',
        'panels.p2.desc': 'Líderes de la industria comparten sus experiencias construyendo empresas tech en América Latina.',
        'panels.p3.title': 'El Futuro del Trabajo Remoto',
        'panels.p3.desc': 'Explorando nuevas formas de colaboración y productividad en equipos distribuidos.',

        // Courses
        'courses.tag': 'Aprende Haciendo',
        'courses.title': 'Workshops y Cursos',
        'courses.beginner': 'Principiante',
        'courses.intermediate': 'Intermedio',
        'courses.advanced': 'Avanzado',
        'courses.toolsLabel': 'Herramientas:',
        'courses.enroll': 'Inscribirse al curso →',
        'courses.c1.title': 'Python para Data Science',
        'courses.c1.desc': 'Domina los fundamentos de Python aplicados al análisis de datos y visualización.',
        'courses.c1.instructor': 'Data Scientist Senior',
        'courses.c1.duration': '3 horas',
        'courses.c2.title': 'Desarrollo Web Moderno',
        'courses.c2.desc': 'Crea aplicaciones web utilizando las últimas tecnologías y mejores prácticas.',
        'courses.c2.instructor': 'Frontend Lead @ Mercado Libre',
        'courses.c2.duration': '4 horas',
        'courses.c3.title': 'Cloud Architecture con AWS',
        'courses.c3.desc': 'Diseña e implementa arquitecturas escalables en la nube de Amazon.',
        'courses.c3.instructor': 'Solutions Architect @ AWS',
        'courses.c3.duration': '3.5 horas',

        // Schedule
        'schedule.tag': 'Cronograma de Actividades',
        'schedule.title': 'Agenda del Congreso',
        'schedule.day1': 'Viernes 23 de Enero',
        'schedule.day2': 'Talleres Simultáneos',
        'schedule.day3': 'Clausura',
        'schedule.join': 'Entrar',
        'schedule.opening': 'Protocolo',
        'schedule.keynote': 'Conferencia',
        'schedule.talk': 'Conferencia',
        'schedule.panel': 'Taller',
        'schedule.workshop': 'Taller',
        'schedule.closing': 'Cierre',
        'schedule.d1.e1.title': 'Bienvenida y Honores a la bandera',
        'schedule.d1.e1.desc': 'Inauguración por el Director General y Directora Académica.',
        'schedule.d1.e2.title': 'Conferencia Magistral Inaugural',
        'schedule.d1.e3.title': 'Minecraft Education en el Aula',
        'schedule.d1.e4.title': 'Talleres Cortos Simultáneos',
        'schedule.d1.e4.desc': 'IA, Simulador Phet y Diseño 3D',
        'schedule.d2.e1.title': 'Investigación potenciada con IA',
        'schedule.d2.e2.title': 'Simulador Phet (Dora González)',
        'schedule.d2.e2.desc': 'Experimentación virtual STEAM',
        'schedule.d2.e3.title': 'Diseño 3D (Jesús Gabriel Félix)',
        'schedule.d2.e4.title': 'Artes en la Ciencia (Deylin Hernández)',
        'schedule.d3.e1.title': 'Cultura Científica (Roxana de León)',
        'schedule.d3.e2.title': 'Conclusiones y Resultados',
        'schedule.d3.e2.desc': 'Resumen de aprendizajes STEAM',
        'schedule.d3.e3.title': 'Entrega de Reconocimientos',
        'schedule.d3.e4.title': 'Cierre y Clausura Oficial',
        'schedule.d3.e4.desc': 'Palabras finales del Director General',

        // FAQ
        'faq.tag': '¿Dudas sobre el Congreso?',
        'faq.title': 'Preguntas Frecuentes',
        'faq.q1': '¿Cómo puedo obtener acceso al congreso?',
        'faq.a1': 'El congreso es completamente gratuito. Puedes conectarte a través de los enlaces de Google Meet, YouTube o Facebook Live que se publicarán en nuestras redes oficiales.',
        'faq.q2': '¿En qué horario se llevará a cabo?',
        'faq.a2': 'Las actividades inician a las 8:00 AM y terminan a las 3:00 PM (Hora Pacífico).',
        'faq.q3': '¿Habrá constancia de participación?',
        'faq.a3': 'Sí, se otorgará constancia digital a los docentes que participen en las sesiones y talleres programados.',
        'faq.q4': '¿Los talleres tienen cupo limitado?',
        'faq.a4': 'Las salas de Google Meet para talleres tienen cupo limitado, pero la transmisión en YouTube y Facebook es abierta para todos.',

        // CTA
        'cta.title': '¿Listo para innovar en el aula?',
        'cta.subtitle': 'Únete al evento STEAM más importante de la Educación Media Superior en la región.',
        'cta.button': 'Ir al Registro',

        // Footer
        'footer.privacy': 'Aviso de Privacidad',
        'footer.terms': 'Términos CBTa 197',
        'footer.contact': 'Contacto',
        'footer.rights': 'Todos los derechos reservados. CBTa 197.',

        // Chatbot
        'chatbot.title': 'Bender - Asistente VII Congreso',
        'chatbot.status': 'En línea',
        'chatbot.welcome': '¡Ey, humano! Soy Bender, el glorioso anfitrión metálico del VII Congreso CBTa 197. Estoy aquí para iluminar tu frágil mente sobre metodología STEAM y soluciones con ciencia. ¿Qué quieres saber?',
        'chatbot.suggestion1': '📅 Horarios del congreso',
        'chatbot.suggestion2': '👥 ¿Quiénes son los ponentes?',
        'chatbot.suggestion3': '📝 ¿Cómo me registro?',
        'chatbot.placeholder': 'Escribe tu pregunta...',
        'chatbot.tooltip': '¿DUDAS? HABLA CONMIGO'
    },
    en: {
        // Navigation
        'nav.about': 'About',
        'nav.speakers': 'Speakers',
        'nav.experience': 'Program',
        'nav.courses': 'Courses',
        'nav.faq': 'FAQ',
        'nav.register': 'Register',

        // Hero
        'hero.badge': 'January 23, 2026 • Online Modality',
        'hero.title1': 'VII International Academic',
        'hero.title2': 'CBTa 197: STEAM Methodology',
        'hero.title3': '2026',
        'hero.subtitle': '"Scientific Disclosure and STEAM Methodology: Solutions with Science". Strengthening continuous teacher training for global challenges.',
        'hero.cta1': 'Register for Free',
        'hero.cta2': 'View Schedule',
        'hero.stat1': 'Speakers',
        'hero.stat2': 'Workshops',
        'hero.stat3': 'Countries',
        'hero.stat4': 'Attendees',
        'hero.scroll': 'Scroll to explore',

        // About
        'about.tag': 'VII CBTa 197 Congress',
        'about.title': 'Scientific Disclosure and STEAM Methodology',
        'about.card1.title': 'Main Objective',
        'about.card1.desc': 'Strengthening continuous teacher training and guaranteeing quality education for global challenges.',
        'about.card2.title': 'Online Modality',
        'about.card2.desc': 'Simultaneous transmission on Google Meet, YouTube, and Facebook Live for free.',
        'about.card3.title': 'Solutions with Science',
        'about.card3.desc': 'Focused on STEAM methodology as a catalyst for innovation and critical thinking.',
        'about.card4.title': 'International Network',
        'about.card4.desc': 'Connecting experts from Mexico, Spain, Colombia, and Panama to ignite the spark of learning.',

        // Speakers
        'speakers.tag': 'International Experts',
        'speakers.title': 'Featured Speakers',
        'speakers.confirmed': 'Confirmed',
        'speakers.talkLabel': 'Topic:',
        'speakers.duration': '50 min',
        'speakers.joinLink': 'View Full Profile →',
        'speakers.s1.role': 'Education Project Manager • Letcraft Educación (Spain)',
        'speakers.s1.talk': '"Minecraft Education for Science learning"',
        'speakers.s2.role': 'CEO Libros Mágicos • AI Expert (Colombia)',
        'speakers.s2.talk': '"Research powered by Artificial Intelligence"',
        'speakers.s3.role': 'Educator in Alternative Pedagogies (Panama)',
        'speakers.s3.talk': '"Arts in Science: Artistic Thinking"',
        'speakers.s4.role': 'Doctor of Science (Mexico)',
        'speakers.s4.talk': '"Scientific Culture: Decision Making"',

        // Experience
        'experience.tag': 'Congress Schedule',
        'experience.title': 'Program & Experience',

        // Panels
        'panels.tag': 'Live Discussions',
        'panels.title': 'Expert Panels',
        'panels.jan': 'JAN',
        'panels.panelists': 'Panelists:',
        'panels.liveQA': 'Live Q&A',
        'panels.networking': 'Networking',
        'panels.workshop': 'Workshop',
        'panels.joinLink': 'Register for panel →',
        'panels.p1.title': 'Artificial Intelligence and Ethics',
        'panels.p1.desc': 'A debate about ethical challenges in AI development and its impact on society.',
        'panels.p2.title': 'Technological Innovation in LATAM',
        'panels.p2.desc': 'Industry leaders share their experiences building tech companies in Latin America.',
        'panels.p3.title': 'The Future of Remote Work',
        'panels.p3.desc': 'Exploring new ways of collaboration and productivity in distributed teams.',

        // Courses
        'courses.tag': 'Learn by Doing',
        'courses.title': 'Workshops and Courses',
        'courses.beginner': 'Beginner',
        'courses.intermediate': 'Intermediate',
        'courses.advanced': 'Advanced',
        'courses.toolsLabel': 'Tools:',
        'courses.enroll': 'Enroll in course →',
        'courses.c1.title': 'Python for Data Science',
        'courses.c1.desc': 'Master Python fundamentals applied to data analysis and visualization.',
        'courses.c1.instructor': 'Senior Data Scientist',
        'courses.c1.duration': '3 hours',
        'courses.c2.title': 'Modern Web Development',
        'courses.c2.desc': 'Create web applications using the latest technologies and best practices.',
        'courses.c2.instructor': 'Frontend Lead @ Mercado Libre',
        'courses.c2.duration': '4 hours',
        'courses.c3.title': 'Cloud Architecture with AWS',
        'courses.c3.desc': 'Design and implement scalable architectures in Amazon cloud.',
        'courses.c3.instructor': 'Solutions Architect @ AWS',
        'courses.c3.duration': '3.5 hours',

        // Schedule
        'schedule.tag': 'Activity Schedule',
        'schedule.title': 'Congress Agenda',
        'schedule.day1': 'Friday January 23',
        'schedule.day2': 'Simultaneous Workshops',
        'schedule.day3': 'Closing',
        'schedule.join': 'Join',
        'schedule.opening': 'Protocol',
        'schedule.keynote': 'Conference',
        'schedule.talk': 'Conference',
        'schedule.panel': 'Workshop',
        'schedule.workshop': 'Workshop',
        'schedule.closing': 'Closing',
        'schedule.d1.e1.title': 'Welcome and Flag Honors',
        'schedule.d1.e1.desc': 'Inauguration by General Director and Academic Director.',
        'schedule.d1.e2.title': 'Inaugural Keynote Conference',
        'schedule.d1.e3.title': 'Minecraft Education in the Classroom',
        'schedule.d1.e4.title': 'Simultaneous Short Workshops',
        'schedule.d1.e4.desc': 'AI, Phet Simulator, and 3D Design',
        'schedule.d2.e1.title': 'Research powered by IA',
        'schedule.d2.e2.title': 'Phet Simulator (Dora' + " González" + ')',
        'schedule.d2.e2.desc': 'Virtual STEAM experimentation',
        'schedule.d2.e3.title': '3D Design (Jesús Gabriel Félix)',
        'schedule.d2.e4.title': 'Arts in Science (Deylin Hernández)',
        'schedule.d3.e1.title': 'Scientific Culture (Roxana de León)',
        'schedule.d3.e2.title': 'Conclusions and Results',
        'schedule.d3.e2.desc': 'Summary of STEAM learning',
        'schedule.d3.e3.title': 'Recognition Awards',
        'schedule.d3.e4.title': 'Official Closing ceremony',
        'schedule.d3.e4.desc': 'Final words from General Director',

        // FAQ
        'faq.tag': 'Questions about the Congress?',
        'faq.title': 'Frequently Asked Questions',
        'faq.q1': 'How can I get access to the congress?',
        'faq.a1': 'The congress is completely free. You can connect through the Google Meet, YouTube, or Facebook Live links that will be published on our official networks.',
        'faq.q2': 'What time will it take place?',
        'faq.a2': 'Activities start at 8:00 AM and end at 3:00 PM (Pacific Time).',
        'faq.q3': 'Will there be a certificate of participation?',
        'faq.a3': 'Yes, a digital certificate will be granted to teachers who participate in the scheduled sessions and workshops.',
        'faq.q4': 'Do workshops have limited capacity?',
        'faq.a4': 'Google Meet rooms for workshops have limited capacity, but the YouTube and Facebook broadcast is open to everyone.',

        // CTA
        'cta.title': 'Ready to innovate in the classroom?',
        'cta.subtitle': 'Join the most important STEAM event for Higher Secondary Education in the region.',
        'cta.button': 'Go to Register',

        // Footer
        'footer.privacy': 'Privacy Notice',
        'footer.terms': 'CBTa 197 Terms',
        'footer.contact': 'Contact',
        'footer.rights': 'All rights reserved. CBTa 197.',

        // Chatbot
        'chatbot.title': 'Bender - VII Congress Assistant',
        'chatbot.status': 'Online',
        'chatbot.welcome': 'Hey, human! I\'m Bender, the glorious metallic host of the VII CBTa 197 Congress. I\'m here to enlighten your fragile mind about STEAM methodology and solutions with science. What do you want to know?',
        'chatbot.suggestion1': '📅 Congress schedules',
        'chatbot.suggestion2': '👥 Who are the speakers?',
        'chatbot.suggestion3': '📝 How do I register?',
        'chatbot.placeholder': 'Type your question...',
        'chatbot.tooltip': 'QUESTIONS? TALK TO ME'
    }
};

/**
 * Apply translations to all elements with data-i18n attribute
 */
function applyTranslations(lang) {
    const elements = document.querySelectorAll('[data-i18n]');

    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });

    // Handle placeholder translations
    const placeholders = document.querySelectorAll('[data-i18n-placeholder]');
    placeholders.forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (translations[lang] && translations[lang][key]) {
            element.placeholder = translations[lang][key];
        }
    });

    // Update HTML lang attribute
    document.documentElement.lang = lang;

    // Dispatch event for chatbot to update
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
}

// Export for chatbot
window.currentLanguage = 'es';
window.translations = translations;

/**
 * Badge Generator Logic
 * Handles the virtual ID card creation and download
 */
function initBadgeGenerator() {
    const modal = document.getElementById("badge-modal");
    const openBtn = document.getElementById("open-badge-modal");
    const closeBtn = document.getElementById("close-badge-modal");
    const downloadBtn = document.getElementById("download-badge-btn");

    console.log("Badge Generator Init attempt...");
    console.log("Modal:", modal);
    console.log("OpenBtn:", openBtn);

    if (!modal || !openBtn) {
        console.error("Badge elements not found!");
        return;
    }

    // Open Modal
    openBtn.addEventListener("click", () => {
        modal.classList.add("active");
        generateRandomID();
    });

    // Close Modal
    closeBtn.addEventListener("click", () => {
        modal.classList.remove("active");
    });

    // Close on click outside
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.remove("active");
        }
    });

    // Live Preview Updates
    const nameInput = document.getElementById("badge-name-input");
    const roleInput = document.getElementById("badge-role-input");
    const nameDisplay = document.getElementById("badge-name-display");
    const roleDisplay = document.getElementById("badge-role-display");
    const initialsDisplay = document.getElementById("badge-initials");

    nameInput.addEventListener("input", (e) => {
        const val = e.target.value;
        nameDisplay.textContent = val || "Tu Nombre";

        // Update initials
        if (val) {
            const parts = val.trim().split(" ");
            let initials = parts[0][0];
            if (parts.length > 1 && parts[parts.length - 1][0]) {
                initials += parts[parts.length - 1][0];
            }
            initialsDisplay.textContent = initials.toUpperCase();
        } else {
            initialsDisplay.textContent = "JP";
        }
    });

    roleInput.addEventListener("change", (e) => {
        roleDisplay.textContent = e.target.value;
    });

    // Random ID Generator
    function generateRandomID() {
        const idDisplay = document.getElementById("badge-random-id");
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        idDisplay.textContent = `MX-2026-${randomNum}`;
    }

    // Download Logic (using html2canvas)
    downloadBtn.addEventListener("click", () => {
        const badgeElement = document.getElementById("virtual-badge");

        // Show loading state
        const originalText = downloadBtn.textContent;
        downloadBtn.textContent = "Generando...";
        downloadBtn.style.opacity = "0.7";

        html2canvas(badgeElement, {
            scale: 2, // High resolution
            backgroundColor: null,
            useCORS: true
        }).then(canvas => {
            // Create download link
            const link = document.createElement("a");
            link.download = `Pase_Virtual_CBTa197.png`;
            link.href = canvas.toDataURL("image/png");
            link.click();

            // Reset button
            downloadBtn.textContent = originalText;
            downloadBtn.style.opacity = "1";
        }).catch(err => {
            console.error("Error generating badge:", err);
            downloadBtn.textContent = "Error";
        });
    });
}

