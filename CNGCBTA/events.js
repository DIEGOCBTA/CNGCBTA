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

    // Construct ICS file content
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
