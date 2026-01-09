/**
 * Circular Gallery 3D
 * Ported from 21st.dev (Ravikatiyar) to Vanilla JS
 */
class CircularGallery {
    constructor(containerId, items, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;

        this.items = items;
        this.radius = options.radius || 600;
        this.autoRotateSpeed = options.autoRotateSpeed || 0.05;
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
        window.addEventListener('scroll', () => {
            this.isScrolling = true;
            if (this.scrollTimeout) clearTimeout(this.scrollTimeout);

            const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollProgress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;

            // Map scroll to 3D rotation (2 full turns over total page scroll)
            this.rotation = scrollProgress * 720;

            this.scrollTimeout = setTimeout(() => {
                this.isScrolling = false;
            }, 150);
        }, { passive: true });
    }

    animate() {
        if (!this.isScrolling) {
            this.rotation += this.autoRotateSpeed;
        }

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
