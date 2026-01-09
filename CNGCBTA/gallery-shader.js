/**
 * Custom Refraction Shader for Gallery Background
 */
class GalleryShaderBackground {
    constructor(canvasId = 'gallery-bg-canvas') {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.init();
    }

    init() {
        this.vertexShader = `
            attribute vec3 position;
            void main() {
                gl_Position = vec4(position, 1.0);
            }
        `;

        this.fragmentShader = `
            precision highp float;
            uniform vec2 resolution;
            uniform float time;

            void main() {
                vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
                
                // Base dark background
                vec3 color = vec3(0.005, 0.005, 0.008);
                
                // Refraction lines - Golden White Core + Subtle Rainbow
                float zoom = 0.8;
                for(float i = 1.0; i <= 5.0; i++) {
                    float t = time * 0.4 * (1.0 + i * 0.05);
                    
                    float x = p.x * zoom + i * 5.0;
                    float y = p.y * zoom + sin(x + t) * 0.3;
                    
                    // Thicker, more intense lines
                    float line_thickness = 0.005;
                    
                    // Subtle RGB split for rainbow edge
                    float lr = line_thickness / abs(y + sin(x * 0.5 + t) * 0.08);
                    float lg = line_thickness / abs(y + 0.01 + sin(x * 0.52 + t) * 0.08);
                    float lb = line_thickness / abs(y + 0.02 + sin(x * 0.54 + t) * 0.08);
                    
                    // Warm white / Gold center color (High value)
                    vec3 whiteCore = vec3(1.0, 0.98, 0.9);
                    vec3 goldEdge = vec3(0.96, 0.85, 0.5);
                    
                    vec3 line_color = mix(whiteCore, goldEdge, sin(t) * 0.5 + 0.5);
                    
                    // Combine split with golden-white core
                    color.r += lr * line_color.r * 1.1;
                    color.g += lg * line_color.g;
                    color.b += lb * (line_color.b + 0.1);
                }

                // Center glow
                float glow = 0.4 / (length(p) + 0.7);
                color += vec3(0.2, 0.18, 0.12) * glow;

                gl_FragColor = vec4(color, 1.0);
            }
        `;

        this.initScene();
        this.animate();
    }

    initScene() {
        this.scene = new THREE.Scene();

        // Ensure transparent canvas background doesn't show through incorrectly
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: false
        });
        this.renderer.setClearColor(0x000000, 1);

        this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

        this.uniforms = {
            resolution: { value: [this.canvas.clientWidth, this.canvas.clientHeight] },
            time: { value: 0.0 }
        };

        // Use standard PlaneGeometry for a cleaner full-screen quad
        const geometry = new THREE.PlaneGeometry(2, 2);

        const material = new THREE.RawShaderMaterial({
            vertexShader: this.vertexShader,
            fragmentShader: this.fragmentShader,
            uniforms: this.uniforms,
            depthTest: false,
            depthWrite: false
        });

        this.scene.add(new THREE.Mesh(geometry, material));

        this.handleResize();
        window.addEventListener('resize', () => this.handleResize());
    }

    animate() {
        this.uniforms.time.value += 0.01;
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(() => this.animate());
    }

    handleResize() {
        const parent = this.canvas.parentElement;
        const width = parent.clientWidth;
        const height = parent.clientHeight;
        this.renderer.setSize(width, height, false);
        this.uniforms.resolution.value = [width, height];
    }
}
