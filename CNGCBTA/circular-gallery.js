/**
 * Circular Gallery 3D
 * Ported from 21st.dev (Ravikatiyar) to Vanilla JS
 */
class CircularGallery {
    constructor(containerId, items, options = {}) {
        this.container = document.getElementById(containerId);
        if (!containerId) return;

        this.items = items;
        this.radius = options.radius || 400;
        this.autoRotateSpeed = options.autoRotateSpeed || 0.1;
        this.background = options.background || null; // Reference to GalleryShaderBackground
        this.rotation = 0;
        this.isScrolling = false;
        this.scrollTimeout = null;
        this.animationFrame = null;

        this.init();
    }

    init() {
        this.createDOM();
        this.setupEvents();
        this.animate();
    }

    createDOM() {
        this.container.classList.add('circular-gallery-stage');
        this.stage = document.createElement('div');
        this.stage.className = 'circular-gallery-inner';

        const anglePerItem = 360 / this.items.length;

        this.items.forEach((item, i) => {
            const itemAngle = i * anglePerItem;
            const card = document.createElement('div');
            card.className = 'circular-gallery-card';
            card.style.transform = `rotateY(${itemAngle}deg) translateZ(${this.radius}px)`;

            card.innerHTML = `
                <div class="gallery-card-content">
                    <div class="gallery-card-image-placeholder">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                        </svg>
                        <span>${item.name.split(' ')[0]}</span>
                    </div>
                    <div class="gallery-card-info">
                        <h3>${item.name}</h3>
                        <span class="gallery-card-role">${item.role}</span>
                        <p class="gallery-card-topic">"${item.topic}"</p>
                    </div>
                </div>
            `;
            this.stage.appendChild(card);
        });

        this.container.appendChild(this.stage);
    }

    setupEvents() {
        const wrapper = this.container.closest('.gallery-pin-wrapper');
        if (!wrapper) return;

        // Initialize target
        this.targetRotation = 0;

        window.addEventListener('scroll', () => {
            this.isScrolling = true;
            if (this.scrollTimeout) clearTimeout(this.scrollTimeout);

            const rect = wrapper.getBoundingClientRect();
            const wrapperTop = window.scrollY + rect.top;
            const wrapperHeight = wrapper.offsetHeight;
            const viewportHeight = window.innerHeight;

            // Progress within the wrapper's scroll space
            let progress = (window.scrollY - wrapperTop) / (wrapperHeight - viewportHeight);
            progress = Math.max(0, Math.min(1, progress));

            // SET TARGET instead of direct rotation
            // 720 degrees (2 spins) over the scroll distance
            this.targetRotation = progress * 720;

            // Sync with background shader
            if (this.background && typeof this.background.updateScroll === 'function') {
                this.background.updateScroll(progress);
            }

            // Start wind sound only when carousel is in view (progress between 0 and 1)
            if (progress > 0 && progress < 1) {
                if (window.audioSys && window.audioSys.startWindLoop) {
                    window.audioSys.startWindLoop();
                }
            } else {
                if (window.audioSys && window.audioSys.stopWindLoop) {
                    window.audioSys.stopWindLoop();
                }
            }

            this.scrollTimeout = setTimeout(() => {
                this.isScrolling = false;
                // Ensure wind stops when scrolling ends, regardless of position
                if (window.audioSys && window.audioSys.stopWindLoop) {
                    window.audioSys.stopWindLoop();
                }
            }, 150);
        }, { passive: true });
        // Trigger initial update to sync background shader immediately
        window.dispatchEvent(new Event('scroll'));
    }

    animate() {
        // --- PHYSICS & SMOOTHING ---
        if (!this.isScrolling) {
            // Auto-rotate keeps adding to target
            this.targetRotation += this.autoRotateSpeed;
        }

        // LERP: Move rotation towards targetRotation smoothly
        // 0.05 = Very smooth/heavy. 0.1 = Snappy.
        this.rotation += (this.targetRotation - this.rotation) * 0.05;

        // --- AUDIO TRIGGER (Removed per-sector) ---
        // Wind sound is now handled by scroll start/stop events for a single continuous loop.

        // Sync Audio Wind Effect (Removed delta, so this is removed)
        // if (window.audioSys && window.audioSys.setCarouselSpeed) {
        //     window.audioSys.setCarouselSpeed(delta);
        // }

        this.stage.style.transform = `rotateY(${this.rotation}deg)`;

        // Calculate visibility/opacity for each card
        const cards = this.stage.querySelectorAll('.circular-gallery-card');
        const anglePerItem = 360 / this.items.length;

        cards.forEach((card, i) => {
            const itemAngle = i * anglePerItem;
            // Angle relative to the front (0 deg)
            const relativeAngle = (itemAngle + (this.rotation % 360) + 360) % 360;
            const normalizedAngle = Math.abs(relativeAngle > 180 ? 360 - relativeAngle : relativeAngle);

            // Cards facing front are opaque, back are near transparent
            const opacity = Math.max(0.1, 1 - (normalizedAngle / 120));
            card.style.opacity = opacity;

            // Dynamic blur/scale for depth effect
            const scale = Math.max(0.7, 1 - (normalizedAngle / 360));
            card.style.transform = `rotateY(${itemAngle}deg) translateZ(${this.radius}px) scale(${scale})`;
        });

        this.animationFrame = requestAnimationFrame(() => this.animate());
    }
}
