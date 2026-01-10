/**
 * Immersive Audio System: Restored & Refined
 * - Ethereal Drone (Restored)
 * - Celestial Click
 * - Soft Wind Swipe (Simple & Gentle)
 */

window.AudioSystem = class AudioSystem {
    constructor() {
        this.ctx = null;
        this.isMuted = true;
        this.masterGain = null;
        this.buffers = {};
        this.droneSource = null;
        this.droneGain = null;
    }

    init() {
        if (this.ctx) return;
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();

        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.5;
        this.masterGain.connect(this.ctx.destination);

        // Pre-render sounds immediately
        this.generateCelestialClick();
        this.generateSoftWind(); // The gentle swoosh
        this.generateEtherealDrone(); // The background you liked
    }

    // --- SOUND GENERATION (Pre-rendered) ---

    // 1. CELESTIAL CLICK
    async generateCelestialClick() {
        const length = this.ctx.sampleRate * 2.0;
        const buffer = this.ctx.createBuffer(2, length, this.ctx.sampleRate);
        const L = buffer.getChannelData(0);
        const R = buffer.getChannelData(1);

        // Sharp transient
        for (let i = 0; i < 400; i++) {
            const vol = 1 - (i / 400);
            const sig = Math.random() * vol * 0.5;
            L[i] += sig;
            R[i] += sig;
        }

        // Echo Tail (Simulated delays)
        const delays = [2000, 4000, 6000, 8000, 12000, 16000];
        for (let d of delays) {
            for (let i = 0; i < length - d; i++) {
                if (i < 400) {
                    const val = (Math.random() * 0.1);
                    const decay = Math.exp(-(i + d) / 10000);
                    L[i + d] += val * decay;
                    R[i + d + 50] += val * decay;
                }
            }
        }

        // Sine Ping
        for (let i = 0; i < 4000; i++) {
            const freq = 2000;
            const t = i / this.ctx.sampleRate;
            const sine = Math.sin(t * freq * 2 * Math.PI) * Math.exp(-t * 20);
            L[i] += sine * 0.1;
            R[i] += sine * 0.1;
        }
        this.buffers.click = buffer;
    }

    // 2. SOFT WIND SWIPE (Gentle, fixed buffer)
    async generateSoftWind() {
        // 0.6 seconds of smooth air
        const length = this.ctx.sampleRate * 0.6;
        const buffer = this.ctx.createBuffer(1, length, this.ctx.sampleRate);
        const D = buffer.getChannelData(0);

        // Brown/Pink Noise hybrid for softness
        let lastOut = 0;
        for (let i = 0; i < length; i++) {
            const white = Math.random() * 2 - 1;
            lastOut = (lastOut + (0.05 * white)) / 1.05;
            D[i] = lastOut * 2.0;
        }

        // Smooth Bell Curve Envelope
        for (let i = 0; i < length; i++) {
            const t = i / length;
            let vol = 0;
            if (t < 0.3) {
                vol = Math.sin((t / 0.3) * (Math.PI / 2));
            } else {
                const fallT = (t - 0.3) / 0.7;
                vol = Math.cos(fallT * (Math.PI / 2));
            }
            D[i] *= vol * 0.1; // Low volume
        }
        this.buffers.wind = buffer;
    }

    // --- SECTIONAL AMBIENT SOUNDS (Celestial) ---
    generateSectionAmbients() {
        // Define chord variations for each major page section and modal
        const sections = {
            hero: [260, 390, 520, 650],
            about: [220, 330, 440, 550],
            "speakers-gallery": [180, 270, 360, 450],
            speakers: [200, 300, 400, 500],
            experience: [240, 360, 480, 600],
            faq: [210, 315, 420, 525],
            "cta-section": [250, 375, 500, 625],
            footer: [130, 195, 260, 325],
            badge: [300, 420, 540, 660] // credential/modal ambient
        };
        Object.keys(sections).forEach(name => {
            const freqs = sections[name];
            const length = this.ctx.sampleRate * 4; // 4 s loop
            const buffer = this.ctx.createBuffer(2, length, this.ctx.sampleRate);
            const L = buffer.getChannelData(0);
            const R = buffer.getChannelData(1);
            for (let i = 0; i < length; i++) {
                const t = i / this.ctx.sampleRate;
                let sample = 0;
                freqs.forEach(f => {
                    sample += Math.sin(t * f * 2 * Math.PI) * 0.03;
                    sample += Math.sin(t * (f * 1.01) * 2 * Math.PI) * 0.03;
                });
                const env = (i < 1000) ? i / 1000 : (i > length - 1000) ? (length - i) / 1000 : 1;
                L[i] = sample * env;
                R[i] = sample * env;
            }
            this.buffers[`ambient_${name}`] = buffer;
        });
    }

    playSectionAmbient(section) {
        if (this.isMuted || !this.ctx) return;
        const buffer = this.buffers[`ambient_${section}`];
        if (!buffer) return; // no ambient for this section

        // Create new source & gain
        const newSrc = this.ctx.createBufferSource();
        newSrc.buffer = buffer;
        newSrc.loop = true;
        const newGain = this.ctx.createGain();
        newGain.gain.setValueAtTime(0, this.ctx.currentTime); // start silent
        newSrc.connect(newGain);
        newGain.connect(this.masterGain);
        newSrc.start();

        // Fade‑in new ambient
        newGain.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + 2.0); // 2 s fade‑in

        // Fade‑out and stop previous ambient if exists
        if (this.ambientSource && this.ambientGain) {
            const oldGain = this.ambientGain;
            const oldSrc = this.ambientSource;
            // Fade out over 2 s
            oldGain.gain.cancelScheduledValues(this.ctx.currentTime);
            oldGain.gain.setValueAtTime(oldGain.gain.value, this.ctx.currentTime);
            oldGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 2.0);
            // Stop after fade‑out
            setTimeout(() => {
                oldSrc.stop();
                oldSrc.disconnect();
                oldGain.disconnect();
            }, 2100);
        }

        // Store references for next transition
        this.ambientSource = newSrc;
        this.ambientGain = newGain;
        this.currentSection = section;
    }

    // Detect current page section on scroll and switch ambient
    monitorSectionChanges() {
        const sections = document.querySelectorAll('section[id]');
        if (!sections.length) return;
        const check = () => {
            let best = null;
            let bestVisible = 0;
            const viewportHeight = window.innerHeight;
            sections.forEach(sec => {
                const rect = sec.getBoundingClientRect();
                const visible = Math.max(0, Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0));
                if (visible > bestVisible) {
                    bestVisible = visible;
                    best = sec.id;
                }
            });
            if (best && best !== this.currentSection) {
                this.playSectionAmbient(best);
            }
        };
        window.addEventListener('scroll', () => {
            clearTimeout(this.sectionTimeout);
            this.sectionTimeout = setTimeout(check, 200);
        }, { passive: true });
        // Initial check on load
        check();
    }

    init() {
        if (this.ctx) return;
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.ctx = new AudioContext();

        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.5;
        this.masterGain.connect(this.ctx.destination);

        // Generate all needed buffers
        this.generateCelestialClick();
        this.generateSoftWind();
        this.generateEtherealDrone();
        this.generateSectionAmbients();

        // Start ambient for the initial section (monitor will call playSectionAmbient)
        this.monitorSectionChanges();

        // Listen for badge modal open to switch to "badge" ambient
        const badgeBtn = document.getElementById('open-badge-modal');
        if (badgeBtn) {
            badgeBtn.addEventListener('click', () => {
                this.playSectionAmbient('badge');
            });
        }
    }

    // 3. ETHEREAL DRONE (Restored)
    async generateEtherealDrone() {
        const length = this.ctx.sampleRate * 4; // 4s loop
        const buffer = this.ctx.createBuffer(2, length, this.ctx.sampleRate);
        const L = buffer.getChannelData(0);
        const R = buffer.getChannelData(1);

        // Frequencies for a suspended chord
        const freqs = [220, 329.63, 440, 554.37];

        for (let i = 0; i < length; i++) {
            let sample = 0;
            const t = i / this.ctx.sampleRate;

            freqs.forEach(f => {
                // Additive synthesis
                sample += Math.sin(t * f * 2 * Math.PI) * 0.05;
                sample += Math.sin(t * (f * 1.01) * 2 * Math.PI) * 0.05;
            });

            // Smooth edges for looping
            const envelope = (i < 1000) ? i / 1000 : (i > length - 1000) ? (length - i) / 1000 : 1;

            L[i] = sample * envelope;
            R[i] = sample * envelope;
        }
        this.buffers.drone = buffer;
    }

    // --- PLAYBACK ---
    toggle() {
        if (!this.ctx) this.init();
        if (this.ctx.state === 'suspended') this.ctx.resume();
        this.isMuted = !this.isMuted;

        if (!this.isMuted) {
            this.startDrone();
            this.playClick();
            return true;
        } else {
            this.stopDrone();
            return false;
        }
    }

    playClick() {
        if (this.isMuted || !this.buffers.click) return;
        const src = this.ctx.createBufferSource();
        src.buffer = this.buffers.click;
        src.connect(this.masterGain);
        src.start();
    }

    // --- CONTINUOUS WIND FOR SCROLL ---
    startWindLoop() {
        if (this.isMuted || !this.buffers.wind) return;
        if (this.windPlaying) return; // already playing, do nothing
        this.windPlaying = true;

        this.windSource = this.ctx.createBufferSource();
        this.windSource.buffer = this.buffers.wind;
        this.windSource.loop = false; // play once, no repeat

        this.windGain = this.ctx.createGain();
        this.windGain.gain.setValueAtTime(0, this.ctx.currentTime);
        // Fade‑in (0.5 s) for a smooth onset
        this.windGain.gain.linearRampToValueAtTime(1.0, this.ctx.currentTime + 0.5);

        this.windSource.connect(this.windGain);
        this.windGain.connect(this.masterGain);
        this.windSource.start();
    }

    stopWindLoop() {
        if (!this.windPlaying) return;
        // Fade‑out (0.5 s) then stop
        const now = this.ctx.currentTime;
        this.windGain.gain.cancelScheduledValues(now);
        this.windGain.gain.setValueAtTime(this.windGain.gain.value, now);
        this.windGain.gain.linearRampToValueAtTime(0, now + 0.5);

        const src = this.windSource;
        const gain = this.windGain;
        // Cleanup after fade‑out
        setTimeout(() => {
            src.stop();
            src.disconnect();
            gain.disconnect();
        }, 600);
        this.windSource = null;
        this.windGain = null;
        this.windPlaying = false;
    }

    // Legacy support (unused now)
    playShutter() { this.startWindLoop(); setTimeout(() => this.stopWindLoop(), 200); }
    playDynamicWind(x) { this.startWindLoop(); }

    startDrone() {
        if (this.droneSource) return;
        if (!this.buffers.drone) return;

        this.droneSource = this.ctx.createBufferSource();
        this.droneSource.buffer = this.buffers.drone;
        this.droneSource.loop = true;

        this.droneGain = this.ctx.createGain();
        this.droneGain.gain.value = 0;

        this.droneSource.connect(this.droneGain);
        this.droneGain.connect(this.masterGain);
        this.droneSource.start();

        // Fade in
        this.droneGain.gain.linearRampToValueAtTime(0.3, this.ctx.currentTime + 3);
    }

    stopDrone() {
        if (this.droneSource) {
            this.droneGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 1);
            setTimeout(() => {
                if (this.droneSource) this.droneSource.stop();
                this.droneSource = null;
            }, 1000);
        }
    }
};

window.audioSys = new window.AudioSystem();

document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.getElementById('audio-toggle-btn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            // force init
            if (!window.audioSys.ctx) window.audioSys.init();

            const active = window.audioSys.toggle();
            const btnIcon = toggleBtn.querySelector('.btn-icon');
            const btnText = toggleBtn.querySelector('.btn-text');

            if (active) {
                toggleBtn.classList.add('active');
                if (btnIcon) btnIcon.textContent = '🔊';
                if (btnText) btnText.textContent = 'Sonido Activado';
            } else {
                toggleBtn.classList.remove('active');
                if (btnIcon) btnIcon.textContent = '🔇';
                if (btnText) btnText.textContent = 'Activar Sonido';
            }
        });
    }

    // Global Click Listener
    document.addEventListener('click', (e) => {
        if (e.target.closest('button') || e.target.closest('a') || e.target.closest('.card')) {
            window.audioSys.playClick();
        }
    });
});
