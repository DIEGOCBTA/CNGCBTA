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
        'nav.panels': 'Paneles',
        'nav.courses': 'Cursos',
        'nav.schedule': 'Agenda',
        'nav.register': 'Registrarse',

        // Hero
        'hero.badge': '20-22 Enero 2025 • Virtual & Presencial',
        'hero.title1': 'Congreso de',
        'hero.title2': 'Innovación & Tecnología',
        'hero.title3': '2025',
        'hero.subtitle': 'Explora el futuro de la tecnología con expertos líderes de la industria. Pláticas, paneles, workshops y networking en un solo lugar.',
        'hero.cta1': 'Obtener Acceso',
        'hero.cta2': 'Ver Programa',
        'hero.stat1': 'Ponentes',
        'hero.stat2': 'Paneles',
        'hero.stat3': 'Workshops',
        'hero.stat4': 'Asistentes',
        'hero.scroll': 'Desplázate para explorar',

        // About
        'about.tag': 'Sobre el Congreso',
        'about.title': 'El evento tecnológico más importante del año',
        'about.card1.title': 'Pláticas Magistrales',
        'about.card1.desc': 'Aprende de los mejores expertos en tecnología, innovación y desarrollo de software.',
        'about.card2.title': 'Paneles de Discusión',
        'about.card2.desc': 'Participa en debates sobre los temas más relevantes de la industria tech.',
        'about.card3.title': 'Workshops Prácticos',
        'about.card3.desc': 'Cursos hands-on con herramientas y tecnologías de vanguardia.',
        'about.card4.title': 'Networking',
        'about.card4.desc': 'Conecta con profesionales y empresas líderes de toda Latinoamérica.',

        // Speakers
        'speakers.tag': 'Conoce a los Expertos',
        'speakers.title': 'Ponentes Destacados',
        'speakers.confirmed': 'Confirmado',
        'speakers.talkLabel': 'Plática:',
        'speakers.duration': '45 min',
        'speakers.joinLink': 'Unirse a la sesión →',
        'speakers.s1.role': 'Investigadora en IA • Google DeepMind',
        'speakers.s1.talk': '"Machine Learning en la Educación del Futuro"',
        'speakers.s2.role': 'Director de Innovación • TechMX',
        'speakers.s2.talk': '"El Futuro de la Tecnología en LATAM"',
        'speakers.s3.role': 'Security Lead • Microsoft',
        'speakers.s3.talk': '"Ciberseguridad: Protegiendo el Futuro Digital"',
        'speakers.s4.role': 'CTO • StartupTech',
        'speakers.s4.talk': '"Cloud Computing y Arquitectura Moderna"',

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
        'schedule.tag': 'Planifica tu Experiencia',
        'schedule.title': 'Agenda Completa',
        'schedule.day1': 'Día 1 - 20 Enero',
        'schedule.day2': 'Día 2 - 21 Enero',
        'schedule.day3': 'Día 3 - 22 Enero',
        'schedule.join': 'Unirse',
        'schedule.opening': 'Apertura',
        'schedule.keynote': 'Keynote',
        'schedule.talk': 'Plática',
        'schedule.panel': 'Panel',
        'schedule.workshop': 'Workshop',
        'schedule.closing': 'Clausura',
        'schedule.d1.e1.title': 'Ceremonia de Inauguración',
        'schedule.d1.e1.desc': 'Bienvenida y presentación del programa del congreso.',
        'schedule.d1.e2.title': 'Machine Learning en la Educación',
        'schedule.d1.e3.title': 'El Futuro de la Tecnología en LATAM',
        'schedule.d1.e4.title': 'IA y Ética: El Debate',
        'schedule.d1.e4.desc': 'Panel con 4 expertos',
        'schedule.d2.e1.title': 'Ciberseguridad: Protegiendo el Futuro',
        'schedule.d2.e2.title': 'Innovación Tecnológica en LATAM',
        'schedule.d2.e2.desc': 'Líderes de la industria',
        'schedule.d2.e3.title': 'Python para Data Science',
        'schedule.d2.e4.title': 'Cloud Computing y Arquitectura Moderna',
        'schedule.d3.e1.title': 'Desarrollo Web Moderno',
        'schedule.d3.e2.title': 'El Futuro del Trabajo Remoto',
        'schedule.d3.e2.desc': 'Expertos en productividad',
        'schedule.d3.e3.title': 'Cloud Architecture con AWS',
        'schedule.d3.e4.title': 'Ceremonia de Cierre y Networking',
        'schedule.d3.e4.desc': 'Despedida y conexiones',

        // FAQ
        'faq.tag': '¿Tienes Dudas?',
        'faq.title': 'Preguntas Frecuentes',
        'faq.q1': '¿Cómo puedo registrarme al congreso?',
        'faq.a1': 'Puedes registrarte haciendo clic en el botón "Registrarse" en la parte superior de la página. El registro es gratuito para estudiantes y tiene un costo de $50 USD para profesionales.',
        'faq.q2': '¿El congreso es presencial o virtual?',
        'faq.a2': 'El congreso es híbrido. Puedes asistir de manera presencial en el Centro de Convenciones o participar de forma virtual a través de las plataformas de videoconferencia indicadas en cada sesión.',
        'faq.q3': '¿Recibiré un certificado de participación?',
        'faq.a3': 'Sí, todos los participantes registrados recibirán un certificado digital de participación al finalizar el congreso. Los workshops otorgan certificados adicionales por cada curso completado.',
        'faq.q4': '¿Puedo acceder a las grabaciones después del evento?',
        'faq.a4': 'Sí, todas las sesiones serán grabadas y estarán disponibles para los participantes registrados durante 30 días después del evento.',

        // CTA
        'cta.title': '¿Listo para ser parte del futuro?',
        'cta.subtitle': 'Únete a cientos de profesionales y estudiantes en el congreso tecnológico más innovador del año.',
        'cta.button': 'Registrarse Ahora',

        // Footer
        'footer.privacy': 'Política de Privacidad',
        'footer.terms': 'Términos y Condiciones',
        'footer.contact': 'Contacto',
        'footer.rights': 'Todos los derechos reservados.',

        // Chatbot
        'chatbot.title': 'Bender - Asistente del Congreso con IA',
        'chatbot.status': 'En línea',
        'chatbot.welcome': '¡Ey, humano! Soy Bender, el glorioso y metálico anfitrión del Congreso Tech Innovation 2025. Estoy aquí porque soy increíble… y quizá para ayudarte. Entonces, dime, ¿qué se te ofrece?',
        'chatbot.suggestion1': ' ¿Cuándo es el congreso?',
        'chatbot.suggestion2': ' ¿Quiénes son los ponentes?',
        'chatbot.suggestion3': ' ¿Cómo me registro?',
        'chatbot.placeholder': 'Escribe tu pregunta...',
        'chatbot.tooltip': '¿DUDAS? HABLA CONMIGO'
    },
    en: {
        // Navigation
        'nav.about': 'About',
        'nav.speakers': 'Speakers',
        'nav.panels': 'Panels',
        'nav.courses': 'Courses',
        'nav.schedule': 'Schedule',
        'nav.register': 'Register',

        // Hero
        'hero.badge': 'January 20-22, 2025 • Virtual & In-Person',
        'hero.title1': 'Congress of',
        'hero.title2': 'Innovation & Technology',
        'hero.title3': '2025',
        'hero.subtitle': 'Explore the future of technology with leading industry experts. Talks, panels, workshops, and networking in one place.',
        'hero.cta1': 'Get Access',
        'hero.cta2': 'View Program',
        'hero.stat1': 'Speakers',
        'hero.stat2': 'Panels',
        'hero.stat3': 'Workshops',
        'hero.stat4': 'Attendees',
        'hero.scroll': 'Scroll to explore',

        // About
        'about.tag': 'About the Congress',
        'about.title': 'The most important tech event of the year',
        'about.card1.title': 'Keynote Talks',
        'about.card1.desc': 'Learn from the best experts in technology, innovation, and software development.',
        'about.card2.title': 'Discussion Panels',
        'about.card2.desc': 'Participate in debates about the most relevant topics in the tech industry.',
        'about.card3.title': 'Hands-on Workshops',
        'about.card3.desc': 'Practical courses with cutting-edge tools and technologies.',
        'about.card4.title': 'Networking',
        'about.card4.desc': 'Connect with professionals and leading companies from all over Latin America.',

        // Speakers
        'speakers.tag': 'Meet the Experts',
        'speakers.title': 'Featured Speakers',
        'speakers.confirmed': 'Confirmed',
        'speakers.talkLabel': 'Talk:',
        'speakers.duration': '45 min',
        'speakers.joinLink': 'Join session →',
        'speakers.s1.role': 'AI Researcher • Google DeepMind',
        'speakers.s1.talk': '"Machine Learning in the Education of the Future"',
        'speakers.s2.role': 'Innovation Director • TechMX',
        'speakers.s2.talk': '"The Future of Technology in LATAM"',
        'speakers.s3.role': 'Security Lead • Microsoft',
        'speakers.s3.talk': '"Cybersecurity: Protecting the Digital Future"',
        'speakers.s4.role': 'CTO • StartupTech',
        'speakers.s4.talk': '"Cloud Computing and Modern Architecture"',

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
        'schedule.tag': 'Plan Your Experience',
        'schedule.title': 'Full Schedule',
        'schedule.day1': 'Day 1 - January 20',
        'schedule.day2': 'Day 2 - January 21',
        'schedule.day3': 'Day 3 - January 22',
        'schedule.join': 'Join',
        'schedule.opening': 'Opening',
        'schedule.keynote': 'Keynote',
        'schedule.talk': 'Talk',
        'schedule.panel': 'Panel',
        'schedule.workshop': 'Workshop',
        'schedule.closing': 'Closing',
        'schedule.d1.e1.title': 'Opening Ceremony',
        'schedule.d1.e1.desc': 'Welcome and presentation of the congress program.',
        'schedule.d1.e2.title': 'Machine Learning in Education',
        'schedule.d1.e3.title': 'The Future of Technology in LATAM',
        'schedule.d1.e4.title': 'AI and Ethics: The Debate',
        'schedule.d1.e4.desc': 'Panel with 4 experts',
        'schedule.d2.e1.title': 'Cybersecurity: Protecting the Future',
        'schedule.d2.e2.title': 'Technological Innovation in LATAM',
        'schedule.d2.e2.desc': 'Industry leaders',
        'schedule.d2.e3.title': 'Python for Data Science',
        'schedule.d2.e4.title': 'Cloud Computing and Modern Architecture',
        'schedule.d3.e1.title': 'Modern Web Development',
        'schedule.d3.e2.title': 'The Future of Remote Work',
        'schedule.d3.e2.desc': 'Productivity experts',
        'schedule.d3.e3.title': 'Cloud Architecture with AWS',
        'schedule.d3.e4.title': 'Closing Ceremony and Networking',
        'schedule.d3.e4.desc': 'Farewell and connections',

        // FAQ
        'faq.tag': 'Have Questions?',
        'faq.title': 'Frequently Asked Questions',
        'faq.q1': 'How can I register for the congress?',
        'faq.a1': 'You can register by clicking the "Register" button at the top of the page. Registration is free for students and costs $50 USD for professionals.',
        'faq.q2': 'Is the congress in-person or virtual?',
        'faq.a2': 'The congress is hybrid. You can attend in person at the Convention Center or participate virtually through the video conferencing platforms indicated in each session.',
        'faq.q3': 'Will I receive a participation certificate?',
        'faq.a3': 'Yes, all registered participants will receive a digital certificate of participation at the end of the congress. Workshops grant additional certificates for each completed course.',
        'faq.q4': 'Can I access recordings after the event?',
        'faq.a4': 'Yes, all sessions will be recorded and available to registered participants for 30 days after the event.',

        // CTA
        'cta.title': 'Ready to be part of the future?',
        'cta.subtitle': 'Join hundreds of professionals and students at the most innovative tech congress of the year.',
        'cta.button': 'Register Now',

        // Footer
        'footer.privacy': 'Privacy Policy',
        'footer.terms': 'Terms and Conditions',
        'footer.contact': 'Contact',
        'footer.rights': 'All rights reserved.',

        // Chatbot
        'chatbot.title': 'Bender - Congress AI Assistant',
        'chatbot.status': 'Online',
        'chatbot.welcome': 'Hey, human! I\'m Bender, the glorious and metallic host of Tech Innovation Congress 2025. I\'m here because I\'m amazing... and maybe to help you. So, tell me, what can I do for you?',
        'chatbot.suggestion1': '📅 When is the congress?',
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
