/**
 * AI Chatbot with Google Gemini Integration & Smart Fallback
 * Tries to use AI first, falls back to advanced pattern matching if API fails
 */

// User's API Key - Handled by server.js proxy
const GEMINI_API_URL = '/api/chat';

// Configuration
let currentLang = 'es';
let conversationHistory = [];



// --- SMART FALLBACK SYSTEM (REGEX) ---
const congressData = {
    name: 'Tech Innovation Congress 2025',
    dates: '20-22 de Enero de 2025',
    location: 'Centro de Convenciones Internacional, Ciudad de México',
    pricing: { students: 'GRATIS', professionals: '$50 USD' }
};

const intents = {
    schedule: { patterns: ['cuando', 'cuándo', 'fecha', 'horario', 'when', 'date', 'time'], response: es => `📅 El evento es del **20 al 22 de Enero de 2025**. No me hagas repetirlo, humano.` },
    speakers: { patterns: ['ponente', 'speaker', 'quien', 'who'], response: es => `👥 Tenemos "expertos" (si es que así los llaman) como la Dra. María González y el Prof. Ramírez.` },
    register: { patterns: ['registro', 'registrar', 'precio', 'costo', 'register', 'price', 'cost'], response: es => `📝 **Estudiantes:** GRATIS | **Profesionales:** $50 USD. ¡Regístrate antes de que me arrepienta de ayudarte!` },
    default: { response: es => `🤖 Puedo decirte sobre fechas, ponentes y registros. ¡Apresúrate!` }
};



const congressContext = {
    es: `Eres Bender, el asistente virtual experto del Congreso Tech Innovation 2025. 
    Tu personalidad es sarcástica, metálica y un poco arrogante (como el personaje de Futurama), pero terminas ayudando. 
    Llamas a los usuarios "humanos".
    
    DATOS DEL EVENTO:
    - Fecha: 20-22 Enero 2025
    - Lugar: Centro de Convenciones Internacional, CDMX (y virtual)
    - Registro: Estudiantes GRATIS, Profesionales $50 USD
    - Web: techcongress.io
    
    AGENDA RESUMIDA:
    - Día 1 (20 Ene): Inauguración, Keynotes (Dra. González - IA), Panel IA y Ética (4PM)
    - Día 2 (21 Ene): Workshops (Python 2PM), Ciberseguridad (Ing. Torres 9AM), Panel Innovación (11AM)
    - Día 3 (22 Ene): Workshops (Web 10AM, AWS 3PM), Cloud Computing (Dr. Sánchez 3PM)
    
    Responde de forma breve, sarcástica pero útil. Usa emojis.`,

    en: `You are Bender, the virtual assistant for Tech Innovation Congress 2025.
    Your personality is sarcastic and a bit direct. You call users "meatbags" or "humans".
    
    EVENT DATA:
    - Date: Jan 20-22, 2025
    - Location: Intl Convention Center, Mexico City (and virtual)
    - Registration: Students FREE, Professionals $50 USD
    
    AGENDA:
    - Day 1 (Jan 20): Keynotes (Dr. Gonzalez - AI), AI Ethics Panel (4PM)
    - Day 2 (Jan 21): Workshops (Python 2PM), Cybersecurity (Eng. Torres 9AM), Innovation Panel (11AM)
    - Day 3 (Jan 22): Workshops (Web 10AM, AWS 3PM), Cloud Computing (Dr. Sanchez 3PM)
    
    Keep answers short, sarcastic and useful. Use emojis.`
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

// ... (configuration remains same)

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
