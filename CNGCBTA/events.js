/**
 * Event Reminder and Agenda Management
 */

const EVENT_DATE = "20260123";
const SUPPORT_EMAIL = "CORREOCBTAEJEMPLO@GMAIL.COM";

const AGENDA_ITEMS = [
    {
        id: 'opening',
        title: 'Bienvenida y Honores a la bandera',
        speaker: 'Director General y Directora Académica',
        time: '08:00 AM',
        start: '080000',
        end: '083000',
        type: 'Protocolo',
        category: 'opening'
    },
    {
        id: 'keynote1',
        title: 'Minecraft Education en el Aula',
        speaker: 'Patricia Escabias Prieto (España)',
        time: '09:30 AM',
        start: '093000',
        end: '103000',
        type: 'Conferencia',
        category: 'keynote'
    },
    {
        id: 'workshop1',
        title: 'Investigación potenciada con IA',
        speaker: 'William Castillo Toloza (Colombia)',
        time: '10:30 AM',
        start: '103000',
        end: '123000',
        type: 'Taller',
        category: 'workshop',
        location: 'Sala 1'
    },
    {
        id: 'workshop2',
        title: 'Simulador Phet y STEAM',
        speaker: 'Dora González STEAM (México)',
        time: '10:30 AM',
        start: '103000',
        end: '123000',
        type: 'Taller',
        category: 'workshop',
        location: 'Sala 2'
    },
    {
        id: 'workshop3',
        title: 'Diseño 3D e Innovación',
        speaker: 'Jesús Gabriel Félix (México)',
        time: '10:30 AM',
        start: '103000',
        end: '123000',
        type: 'Taller',
        category: 'workshop',
        location: 'Sala 3'
    },
    {
        id: 'keynote2',
        title: 'Artes en la Ciencia: El Pensamiento Artístico',
        speaker: 'Deylin Hernández (Panamá)',
        time: '12:30 PM',
        start: '123000',
        end: '133000',
        type: 'Conferencia',
        category: 'keynote'
    },
    {
        id: 'keynote3',
        title: 'Cultura Científica: Toma de decisiones',
        speaker: 'Roxana de León (México)',
        time: '01:30 PM',
        start: '133000',
        end: '143000',
        type: 'Conferencia',
        category: 'keynote'
    },
    {
        id: 'closing',
        title: 'Cierre y Clausura Oficial',
        speaker: 'Director General',
        time: '02:30 PM',
        start: '143000',
        end: '150000',
        type: 'Clausura',
        category: 'closing'
    }
];

/**
 * Downloads an .ics file for a specific event
 */
function addEventReminder(itemId) {
    const item = AGENDA_ITEMS.find(i => i.id === itemId);
    if (!item) return;

    const description = `Ponente: ${item.speaker}\\n\\nSoporte: ${SUPPORT_EMAIL}\\n\\nVII Congreso Académico Internacional CBTa 197`;

    const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'PRODID:-//CBTa 197//NONSGML Event Calendar//EN',
        'BEGIN:VEVENT',
        `UID:${item.id}_2026@cbta197.edu.mx`,
        `DTSTAMP:${EVENT_DATE}T000000Z`,
        `DTSTART:${EVENT_DATE}T${item.start}`,
        `DTEND:${EVENT_DATE}T${item.end}`,
        `SUMMARY:${item.title}`,
        `DESCRIPTION:${description}`,
        `LOCATION:${item.location || 'En Línea (Google Meet / YouTube)'}`,
        'BEGIN:VALARM',
        'TRIGGER:-PT15M',
        'ACTION:DISPLAY',
        'DESCRIPTION:Reminder',
        'END:VALARM',
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${item.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Attach to window for HTML access
window.addEventReminder = addEventReminder;

/**
 * GESTIÓN DE LA INTERFAZ Y EL PORTAL
 */
document.addEventListener('DOMContentLoaded', () => {
    const portal = document.getElementById('welcome-portal');
    const introOverlay = document.getElementById('intro-overlay');
    const onboardingStep = document.getElementById('onboarding-step');
    const loadingStep = document.getElementById('loading-step');
    const onboardingForm = document.getElementById('onboarding-form');
    const soundToggle = document.getElementById('sound-toggle');

    // --- ESCUDO ANTI-REINICIO MAESTRO ---
    // Usamos localStorage para que persista aunque cierren el navegador
    if (localStorage.getItem('form_completado') === 'true') {
        if (portal) portal.remove();
        if (introOverlay) introOverlay.remove();
        document.body.style.overflow = 'auto';
        document.documentElement.style.overflow = 'auto';
        console.log("Acceso previo detectado. Intro eliminada.");
        return; // Detenemos la ejecución de todo lo demás
    }

    let isSoundEnabled = false;

    // Manejo del Toggle de Sonido
    if (soundToggle) {
        soundToggle.addEventListener('click', () => {
            isSoundEnabled = !isSoundEnabled;
            soundToggle.classList.toggle('active');
        });
    }

    // Envío del Formulario
    if (onboardingForm) {
        onboardingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const userData = {
                school: document.getElementById('user-school').value,
                name: document.getElementById('user-name').value,
                lastname: document.getElementById('user-lastname').value,
                lang: document.getElementById('user-lang').value,
                sound: isSoundEnabled
            };
            console.log("Usuario registrado:", userData);

            // Transición visual
            onboardingStep.classList.add('hidden');
            loadingStep.classList.remove('hidden');

            let progress = 0;
            const progressBar = document.querySelector('.loading-bar-progress');

            const interval = setInterval(() => {
                progress += Math.random() * 20;
                if (progress > 100) progress = 100;
                if (progressBar) progressBar.style.width = `${progress}%`;

                if (progress === 100) {
                    clearInterval(interval);

                    // GUARDAR QUE YA ENTRÓ
                    localStorage.setItem('form_completado', 'true');

                    // Desvanecer el portal
                    portal.style.opacity = '0';

                    setTimeout(() => {
                        // ELIMINAR LOS BLOQUEOS
                        portal.remove();
                        if (document.getElementById('intro-overlay')) {
                            document.getElementById('intro-overlay').remove();
                        }

                        // HABILITAR SCROLL DEL INDEX
                        document.body.style.overflow = 'auto';
                        window.scrollTo(0, 0); // Regresa al inicio de la página principal
                    }, 6000);
                }
            }, 150);
        });
    }
});