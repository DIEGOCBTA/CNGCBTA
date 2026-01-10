/**
 * AI Chatbot with Google Gemini Integration & Smart Fallback
 * Tries to use AI first, falls back to advanced pattern matching if API fails
 */

// User's API Key - Handled by server.js proxy
const GEMINI_API_URL = '/api/chat';

// Configuration
let currentLang = 'es';
let conversationHistory = [];

const audioHola = document.getElementById("audioHola");
const audioPregunta = document.getElementById("audioPregunta");


// --- SMART FALLBACK SYSTEM (REGEX) ---
const congressData = {
    name: 'VII Congreso Académico Internacional CBTa 197',
    dates: 'Viernes 23 de Enero de 2026',
    location: 'En línea (Google Meet, YouTube, Facebook Live)',
    pricing: { students: 'GRATIS', teachers: 'GRATIS' }
};

const intents = {
    schedule: { patterns: ['cuando', 'cuándo', 'fecha', 'horario', 'when', 'date', 'time'], response: es => `📅 El evento es el **Viernes 23 de Enero de 2026**, de 8:00 a 15:00 hrs (Pacífico). ¡No llegues tarde, humano!` },
    speakers: { patterns: ['ponente', 'speaker', 'quien', 'who'], response: es => `👥 Tenemos expertos como **Patricia Escabias** (España), **William Castillo** (Colombia), **Deylin Hernández** (Panamá) y **Roxana de León** (México).` },
    register: { patterns: ['registro', 'registrar', 'precio', 'costo', 'register', 'price', 'cost'], response: es => `📝 El evento es **GRATUITO** y en línea (Google Meet, YouTube y Facebook Live). ¡Regístrate antes de que se agoten los bytes!` },
    default: { response: es => `🤖 Puedo decirte sobre el cronograma, los ponentes y cómo entrar. ¡Apresúrate!` }
};



const congressContext = {
    es: `Eres Bender, el asistente virtual del VII Congreso Académico Internacional CBTa 197.
    Tema: "Divulgación Científica y Metodología STEAM: Soluciones con Ciencia".
    Tu personalidad es sarcástica y metálica, pero útil. Llamas a los usuarios "humanos".
    
    DATOS DEL EVENTO:
    - Fecha: 23 de Enero 2026 (08:00 - 15:00 Pacífico)
    - Lugar: En línea (Google Meet, YouTube, Facebook Live)
    - Registro: GRATUITO
    - Objetivo: Divulgación Científica y Metodología STEAM.
    - Responsables: Dirección, Consejo Técnico Académico, Formación Docente y Vinculación.
    
    CRONOGRAMA:
    - 08:00: Honores y Bienvenida.
    - 08:30: Conferencia Pendiente.
    - 09:30: Minecraft Education (Patricia Escabias).
    - 10:30: Talleres Simultáneos: IA (William Castillo), Phet (Dora González), Diseño 3D (Jesús Gabriel Félix).
    - 12:30: Artes en la Ciencia (Deylin Hernández).
    - 13:30: Cultura Científica (Roxana de León).
    - 14:30: Cierre y clausura.
    
    Responde de forma breve y sarcástica. Usa emojis.`,

    en: `You are Bender, virtual assistant for the VII CBTa 197 International Congress.
    Theme: "Scientific Disclosure and STEAM Methodology: Solutions with Science".
    Sarcastic and direct personality. Call users "meatbags" or "humans".
    
    EVENT DATA:
    - Date: Jan 23, 2026
    - Location: Online (Google Meet, YouTube, Facebook)
    - Registration: FREE
    
    AGENDA:
    - 08:00: Welcome Ceremony.
    - 09:30: Minecraft Education (Patricia Escabias).
    - 10:30: Workshops (AI, Phet, 3D Design).
    - 12:30: Arts in Science (Deylin Hernández).
    - 13:30: Scientific Culture (Roxana de León).
    - 14:30: Closing.
    
    Keep it short and sarcastic. Use emojis.`
};

document.addEventListener('DOMContentLoaded', initChatbot);

const BENDER_LOTTIE_PATH = 'bender-avatar.json';

function loadBenderLottie(container) {
    if (!container) return;
    return lottie.loadAnimation({
        container: container,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: BENDER_LOTTIE_PATH,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid meet'
        }
    });
}

function initChatbot() {
    const toggle = document.getElementById('chatbot-toggle');
    const closeBtn = document.getElementById('chatbot-close');
    const sendBtn = document.getElementById('chatbot-send');
    const input = document.getElementById('chatbot-input');

    // Initialize welcome avatar
    const welcomeAvatar = document.getElementById('welcome-lottie');
    if (welcomeAvatar) loadBenderLottie(welcomeAvatar);

    toggle?.addEventListener('click', () => {
        document.getElementById('chatbot-window').classList.toggle('active');
        if (document.getElementById('chatbot-window').classList.contains('active')) input?.focus();

        // 🔊 AUDIO DE BENDER
        audioHola.pause();
        audioPregunta.pause();
        audioHola.currentTime = 0;
        audioPregunta.currentTime = 0;

        audioHola.play();

        audioHola.onended = () => {
            setTimeout(() => {
                audioPregunta.play();
            }, 250);
        };
    });


    closeBtn?.addEventListener('click', () => document.getElementById('chatbot-window').classList.remove('active'));

    sendBtn?.addEventListener('click', sendMessage);
    input?.addEventListener('keypress', e => { if (e.key === 'Enter') sendMessage(); });

    document.querySelectorAll('.suggestion-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            document.getElementById('chatbot-input').value = chip.dataset.question === 'schedule' ? '¿Cuándo es el congreso?' :
                chip.dataset.question === 'speakers' ? '¿Quiénes son los ponentes?' :
                    '¿Cómo me registro?';
            sendMessage();
        });
    });

    window.addEventListener('languageChanged', e => currentLang = e.detail.lang);
}

// API Configuration
const API_URL = '/api/chat';
const MODEL_ID = 'openai/gpt-oss-120b:groq';



async function sendMessage() {
    const input = document.getElementById('chatbot-input');
    const msg = input.value.trim();
    if (!msg) return;

    addMessage(msg, 'user');
    input.value = '';
    showTyping();

    try {
        // 1. Try AI API
        const response = await callAI(msg);
        removeTyping();
        addMessage(response, 'bot');
    } catch (error) {
        console.warn('AI Fallback:', error);
        // 2. Fallback to Regex
        setTimeout(() => {
            removeTyping();
            const fallback = getFallbackResponse(msg);
            const errorDetails = error.message || 'Error de conexión';
            addMessage(`${fallback}<br><br><small><em>(Modo Offline activado por: ${errorDetails})</em></small>`, 'bot');
        }, 500);
    }
}

// Generate a session ID for this visit
const SESSION_ID = 'user-' + Math.random().toString(36).substring(7);

async function callAI(userMsg) {
    // Add to local UI history
    conversationHistory.push({ role: 'user', content: userMsg });

    // Inject context into the prompt to ensure the AI knows its persona
    const context = congressContext[currentLang] || congressContext['es'];
    const enhancedPrompt = `${context}\n\nUser Message: ${userMsg}`;

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chatInput: enhancedPrompt, // Send context + message
            sessionId: SESSION_ID,
            // Send history if needed, but usually n8n handles it or just takes input
            history: conversationHistory
        })
    });

    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);

    const data = await response.json();
    // Try different common n8n output keys
    const text = data.output || data.text || data.response || (data.length && data[0]?.output) || "Respuesta recibida";

    conversationHistory.push({ role: 'assistant', content: text });
    return text;
}

function getFallbackResponse(msg) {
    const lower = msg.toLowerCase();
    for (let key in intents) {
        if (key === 'default') continue;
        if (intents[key].patterns.some(p => lower.includes(p))) {
            return intents[key].response();
        }
    }
    return intents.default.response();
}

function addMessage(text, type) {
    const div = document.createElement('div');
    const id = 'msg-' + Date.now();
    div.className = `chat-message ${type}`;

    if (type === 'bot') {
        div.innerHTML = `
            <div class="message-avatar bot-avatar">
                <div class="lottie-avatar" id="${id}"></div>
            </div>
            <div class="message-content"><p>${text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>')}</p></div>
        `;
        document.getElementById('chatbot-messages').appendChild(div);
        loadBenderLottie(document.getElementById(id));
    } else {
        div.innerHTML = `
            <div class="message-avatar user-avatar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <div class="message-content"><p>${text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>')}</p></div>
        `;
        document.getElementById('chatbot-messages').appendChild(div);
    }

    document.getElementById('chatbot-messages').scrollTop = 10000;
}

function showTyping() {
    const div = document.createElement('div');
    const id = 'typing-lottie';
    div.id = 'typing';
    div.className = 'chat-message bot typing';
    div.innerHTML = `
        <div class="message-avatar bot-avatar">
            <div class="lottie-avatar" id="${id}"></div>
        </div>
        <div class="typing-indicator"><span></span><span></span><span></span></div>
    `;
    document.getElementById('chatbot-messages').appendChild(div);
    loadBenderLottie(document.getElementById(id));
    document.getElementById('chatbot-messages').scrollTop = 10000;
}

function removeTyping() {
    document.getElementById('typing')?.remove();
}
