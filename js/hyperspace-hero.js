/* ======================================================= */
/*   HYPERSPACE DIVE — ENGINE JS                           */
/*   Fichier : js/hyperspace-hero.js                       */
/*   Usage  : Page À Propos uniquement                     */
/*                                                         */
/*   IMPORTANT : Charger ce script APRÈS le DOM            */
/*   (defer ou en bas de page)                             */
/* ======================================================= */

(function () {
    'use strict';

    // Vérification : ne lancer que si le hero-runway existe
    const heroWrap = document.getElementById('hero-runway');
    if (!heroWrap) return;

    // ============================================
    //   UTILITAIRES
    // ============================================
    const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
    const easeInQuad = t => t * t;
    const easeInCubic = t => t * t * t;
    const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
    const easeInOutQuad = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    const easeInExpo = t => t === 0 ? 0 : Math.pow(2, 10 * t - 10);

    // Bruit sinusoïdal composé (pour le screen shake fluide)
    let nt = 0, ntY = 100;
    const smoothNoise = s => {
        nt += s;
        return Math.sin(nt * 1.7) * 0.5 + Math.sin(nt * 3.1 + 1.3) * 0.3 + Math.sin(nt * 5.3 + 2.7) * 0.2;
    };
    const smoothNoiseY = s => {
        ntY += s;
        return Math.sin(ntY * 2.3 + 0.5) * 0.5 + Math.sin(ntY * 4.1 + 1.8) * 0.3 + Math.sin(ntY * 6.7 + 3.2) * 0.2;
    };

    const isMobile = window.innerWidth < 768;


    // ============================================
    //   NEBULA CANVAS (profondeur atmosphérique)
    // ============================================
    const nebCvs = document.getElementById('nebula-canvas');
    if (!nebCvs) return;
    const nebCtx = nebCvs.getContext('2d');

    function resizeNeb() {
        nebCvs.width = Math.ceil(window.innerWidth * 0.4);
        nebCvs.height = Math.ceil(window.innerHeight * 0.4);
    }
    resizeNeb();

    function paintNebula() {
        const w = nebCvs.width, h = nebCvs.height;
        nebCtx.clearRect(0, 0, w, h);
        const blobs = [
            { x: w * 0.3, y: h * 0.4, r: w * 0.35, c: 'rgba(30,58,138,0.08)' },
            { x: w * 0.7, y: h * 0.3, r: w * 0.25, c: 'rgba(59,130,246,0.05)' },
            { x: w * 0.5, y: h * 0.65, r: w * 0.4, c: 'rgba(15,23,42,0.08)' },
            { x: w * 0.2, y: h * 0.7, r: w * 0.2, c: 'rgba(59,130,246,0.04)' },
            { x: w * 0.8, y: h * 0.6, r: w * 0.18, c: 'rgba(249,115,22,0.02)' },
        ];
        blobs.forEach(b => {
            const g = nebCtx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
            g.addColorStop(0, b.c);
            g.addColorStop(1, 'transparent');
            nebCtx.fillStyle = g;
            nebCtx.fillRect(0, 0, w, h);
        });
        // Grain subtil
        const img = nebCtx.getImageData(0, 0, w, h);
        for (let i = 0; i < img.data.length; i += 4) {
            const n = (Math.random() - 0.5) * 6;
            img.data[i] = clamp(img.data[i] + n, 0, 255);
            img.data[i + 1] = clamp(img.data[i + 1] + n, 0, 255);
            img.data[i + 2] = clamp(img.data[i + 2] + n, 0, 255);
        }
        nebCtx.putImageData(img, 0, 0);
    }
    paintNebula();


    // ============================================
    //   STARFIELD 3D (Canvas)
    // ============================================
    const canvas = document.getElementById('starfield');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, cx, cy;

    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
        cx = W / 2;
        cy = H / 2;
    }
    resize();
    window.addEventListener('resize', () => {
        resize();
        resizeNeb();
        paintNebula();
    });

    const STAR_COUNT = isMobile ? 450 : 800;
    const MAX_DEPTH = 1800;
    const stars = [];

    // Palette variée : blanc-bleuté, bleu vif, ambré, orange Clartem
    const starPalette = [
        ...Array(55).fill(0).map(() => { const b = 200 + Math.random() * 55; return `rgba(${b},${b},255,`; }),
        ...Array(25).fill(0).map(() => `rgba(${80 + Math.random() * 40},${140 + Math.random() * 60},${220 + Math.random() * 35},`),
        ...Array(12).fill(0).map(() => `rgba(${220 + Math.random() * 35},${160 + Math.random() * 60},${80 + Math.random() * 40},`),
        ...Array(8).fill(0).map(() => `rgba(249,${100 + Math.random() * 50},${20 + Math.random() * 30},`),
    ];

    for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
            x: (Math.random() - 0.5) * W * 3.5,
            y: (Math.random() - 0.5) * H * 3.5,
            z: Math.random() * MAX_DEPTH,
            speed: 0.15 + Math.random() * 0.6,
            size: 0.4 + Math.random() * 1.8,
            color: starPalette[Math.floor(Math.random() * starPalette.length)],
            twinklePhase: Math.random() * Math.PI * 2,
            twinkleSpeed: 0.5 + Math.random() * 2,
        });
    }

    let currentSpeed = 0, targetSpeed = 0, ft = 0;

    function drawStars(time) {
        ctx.clearRect(0, 0, W, H);
        ft = time * 0.001;
        currentSpeed += (targetSpeed - currentSpeed) * 0.06;
        const speed = currentSpeed;
        const isWarp = speed > 2;

        for (const s of stars) {
            s.z -= s.speed * (1 + speed * 28);
            if (s.z <= 0) {
                s.x = (Math.random() - 0.5) * W * 3.5;
                s.y = (Math.random() - 0.5) * H * 3.5;
                s.z = MAX_DEPTH;
            }

            const k = 650 / s.z;
            const sx = s.x * k + cx, sy = s.y * k + cy;
            if (sx < -80 || sx > W + 80 || sy < -80 || sy > H + 80) continue;

            const db = (MAX_DEPTH - s.z) / MAX_DEPTH;

            // Scintillement (seulement en idle)
            let tw = 1;
            if (speed < 1) tw = 0.6 + 0.4 * Math.sin(ft * s.twinkleSpeed + s.twinklePhase);

            const alpha = clamp(db * tw, 0.05, 1);
            const bs = s.size * k * 0.45;
            const size = Math.min(bs, isWarp ? 3.5 : 3);

            if (isWarp && speed > 1) {
                // Mode traînée
                const prevZ = s.z + s.speed * (1 + speed * 28);
                const pk = 650 / prevZ;
                ctx.beginPath();
                ctx.moveTo(s.x * pk + cx, s.y * pk + cy);
                ctx.lineTo(sx, sy);
                ctx.strokeStyle = s.color + (alpha * 0.85).toFixed(3) + ')';
                ctx.lineWidth = Math.max(0.4, size * 0.55);
                ctx.stroke();

                // Lueur de tête
                if (s.z < 400 && size > 1) {
                    ctx.beginPath();
                    ctx.arc(sx, sy, size * 1.5, 0, Math.PI * 2);
                    ctx.fillStyle = s.color + (alpha * 0.12).toFixed(3) + ')';
                    ctx.fill();
                }
            } else {
                // Mode point
                ctx.beginPath();
                ctx.arc(sx, sy, Math.max(0.3, size), 0, Math.PI * 2);
                ctx.fillStyle = s.color + alpha.toFixed(3) + ')';
                ctx.fill();

                // Lueur douce pour étoiles proches
                if (s.z < 300 && size > 1.2) {
                    ctx.beginPath();
                    ctx.arc(sx, sy, size * 2.5, 0, Math.PI * 2);
                    ctx.fillStyle = s.color + (alpha * 0.08).toFixed(3) + ')';
                    ctx.fill();
                }
            }
        }
        requestAnimationFrame(drawStars);
    }
    requestAnimationFrame(drawStars);


    // ============================================
    //   SYSTÈME DE PARTICULES (dissolution)
    // ============================================
    const pCvs = document.getElementById('hs-particles');
    if (!pCvs) return;
    const pCtx = pCvs.getContext('2d');
    pCvs.width = W;
    pCvs.height = H;
    window.addEventListener('resize', () => {
        pCvs.width = window.innerWidth;
        pCvs.height = window.innerHeight;
    });

    const PCOUNT = isMobile ? 70 : 150;
    const parts = [];
    let partsActive = false, partsTrig = false;

    function spawnParts() {
        parts.length = 0;
        const cX = window.innerWidth / 2;
        const cY = window.innerHeight / 2;
        for (let i = 0; i < PCOUNT; i++) {
            const a = Math.random() * Math.PI * 2;
            parts.push({
                x: cX + Math.cos(a) * Math.random() * 180,
                y: cY + Math.sin(a) * Math.random() * 120,
                vx: Math.cos(a) * (1 + Math.random() * 4),
                vy: Math.sin(a) * (1 + Math.random() * 3) - 1,
                size: 1 + Math.random() * 3,
                life: 1,
                decay: 0.005 + Math.random() * 0.015,
                color: Math.random() > 0.7 ? 'rgba(59,130,246,' : Math.random() > 0.85 ? 'rgba(249,115,22,' : 'rgba(255,255,255,',
            });
        }
        partsActive = true;
    }

    function drawParts() {
        pCtx.clearRect(0, 0, pCvs.width, pCvs.height);
        if (!partsActive) { requestAnimationFrame(drawParts); return; }
        let alive = 0;
        for (const p of parts) {
            if (p.life <= 0) continue;
            alive++;
            p.x += p.vx;
            p.y += p.vy;
            p.vx *= 0.99;
            p.vy *= 0.99;
            p.life -= p.decay;
            const a = clamp(p.life, 0, 1);
            pCtx.beginPath();
            pCtx.arc(p.x, p.y, p.size * a, 0, Math.PI * 2);
            pCtx.fillStyle = p.color + a.toFixed(2) + ')';
            pCtx.fill();
        }
        if (alive === 0) partsActive = false;
        requestAnimationFrame(drawParts);
    }
    requestAnimationFrame(drawParts);


    // ============================================
    //   SPEED LINES (radiales depuis le centre)
    // ============================================
    const slEl = document.getElementById('hs-speed-lines');
    if (!slEl) return;
    const LC = isMobile ? 35 : 65;
    const slines = [];

    for (let i = 0; i < LC; i++) {
        const el = document.createElement('div');
        el.className = 'hs-speed-line';
        const angle = (i / LC) * 360 + (Math.random() - 0.5) * 6;
        const dist = 60 + Math.random() * 500;
        const len = 50 + Math.random() * 250;
        const thick = 0.3 + Math.random() * 1.2;

        const isB = Math.random() > 0.3;
        const isO = !isB && Math.random() > 0.7;
        const color = isO
            ? 'linear-gradient(90deg, rgba(249,115,22,0.5) 0%, rgba(255,200,100,0.7) 40%, transparent 100%)'
            : isB
                ? 'linear-gradient(90deg, rgba(59,130,246,0.5) 0%, rgba(180,210,255,0.7) 40%, transparent 100%)'
                : 'linear-gradient(90deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.7) 40%, transparent 100%)';

        el.style.cssText = `width:${len}px;height:${thick}px;background:${color};transform:rotate(${angle}deg) translateX(${dist}px);opacity:${0.08 + Math.random() * 0.35}`;
        slEl.appendChild(el);
        slines.push({ el, angle, baseDist: dist });
    }


    // ============================================
    //   MOTEUR PARALLAX (piloté par le scroll)
    // ============================================
    const hero = document.getElementById('hero');
    const tunnel = document.getElementById('hs-tunnel');
    const rings = [
        document.getElementById('hs-wr1'),
        document.getElementById('hs-wr2'),
        document.getElementById('hs-wr3'),
        document.getElementById('hs-wr4'),
    ];
    const grad = document.getElementById('hs-grad');
    const vig = document.getElementById('hs-vig');
    const eng = document.getElementById('hs-eng');
    const chrR = document.getElementById('hs-chr');
    const chrC = document.getElementById('hs-chc');
    const hor = document.getElementById('hs-hor');
    const flash = document.getElementById('hs-flash');
    const cue = document.getElementById('hs-scroll-cue');
    const neb = document.getElementById('nebula-canvas');
    const revealOverlay = document.getElementById('hs-reveal-overlay');

    // Éléments du contenu — départ échelonné
    // xDrift < 0 = dérive gauche, > 0 = dérive droite
    const els = [
        { el: document.getElementById('hs-el-guillemet'), delay: 0, zSpeed: 1.5, xDrift: 0 },
        { el: document.getElementById('hs-el-title-1'), delay: 0.02, zSpeed: 1.3, xDrift: -0.2 },
        { el: document.getElementById('hs-el-title-2'), delay: 0.05, zSpeed: 1.1, xDrift: 0.2 },
        { el: document.getElementById('hs-el-sub'), delay: 0.09, zSpeed: 0.8, xDrift: 0 },
        { el: document.getElementById('hs-el-sig'), delay: 0.14, zSpeed: 0.6, xDrift: 0 },
    ].filter(item => item.el); // Sécurité si un élément manque

    // Désactiver les animations CSS une fois que le scroll prend le relais
    let animsDisabled = false;
    function disableAnims() {
        if (animsDisabled) return;
        animsDisabled = true;
        document.querySelectorAll('.hs-anim-rise').forEach(el => {
            el.style.animation = 'none';
            el.style.opacity = '1';
            el.style.transform = 'none';
            el.style.filter = 'none';
        });
    }

    let ticking = false;

    function onScroll() {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(update);
        }
    }

    function update() {
        ticking = false;

        const scrollY = window.scrollY;
        const runway = heroWrap.offsetHeight - window.innerHeight;
        const p = clamp(scrollY / runway, 0, 1);

        // Prendre le relais des animations CSS
        if (p > 0.01) disableAnims();


        // ===== VITESSE DU STARFIELD =====
        // Phase 1 (0→0.25): Accélération douce
        // Phase 2 (0.25→0.65): Plein warp
        // Phase 3 (0.65→1): Décélération (sortie)
        if (p < 0.25) {
            targetSpeed = easeInQuad(p / 0.25) * 2.5;
        } else if (p < 0.65) {
            targetSpeed = 2.5 + easeInCubic((p - 0.25) / 0.4) * 14;
        } else {
            targetSpeed = 16.5 * (1 - easeInQuad((p - 0.65) / 0.35));
        }


        // ===== NEBULA =====
        const ns = 1 + p * 1.5;
        const no = p < 0.5 ? 0.45 - easeInQuad(p * 2) * 0.3 : Math.max(0, 0.15 * (1 - (p - 0.5) * 2));
        neb.style.transform = `scale(${ns})`;
        neb.style.opacity = clamp(no, 0, 0.5);


        // ===== LIGHT TUNNEL =====
        tunnel.style.transform = `scale(${1 + p * 4})`;
        tunnel.style.opacity = (p < 0.6 ? easeInQuad(clamp(p / 0.4, 0, 1)) * 0.9 : 0.9 * (1 - easeInQuad((p - 0.6) / 0.4)));


        // ===== WARP RINGS =====
        const ringDelays = [0.1, 0.18, 0.25, 0.33];
        rings.forEach((ring, i) => {
            if (!ring) return;
            const rp = clamp((p - ringDelays[i]) / 0.45, 0, 1);
            ring.style.transform = `translate(-50%,-50%) scale(${easeOutCubic(rp) * (0.7 + i * 0.25)})`;
            ring.style.opacity = rp > 0 ? (1 - easeInQuad(rp)) * 0.6 : 0;
        });


        // ===== SPEED LINES =====
        slEl.style.opacity = p < 0.12 ? 0 : p < 0.65
            ? easeInQuad((p - 0.12) / 0.3) * 0.95
            : 0.95 * (1 - easeInQuad((p - 0.65) / 0.35));

        slines.forEach(l => {
            const stretch = 1 + easeInCubic(clamp(p / 0.5, 0, 1)) * 5;
            l.el.style.transform = `rotate(${l.angle}deg) translateX(${l.baseDist * (1 - p * 0.35)}px) scaleX(${stretch})`;
        });


        // ===== GRADIENT & VIGNETTE =====
        grad.style.opacity = 1 - p * 0.4;

        const vR = 70 - easeInQuad(clamp(p / 0.5, 0, 1)) * 40;
        const vO = 0.25 + easeInQuad(clamp(p / 0.6, 0, 1)) * 0.7;
        vig.style.background = `radial-gradient(ellipse ${vR}% ${vR * 0.8}% at 50% 50%, transparent 30%, rgba(15,23,42,${Math.min(vO, 0.95)}) 100%)`;
        vig.style.opacity = p > 0.85 ? 1 - (p - 0.85) / 0.15 : 1;


        // ===== ENGINE GLOW =====
        const egP = clamp((p - 0.15) / 0.4, 0, 1);
        const pulse = 0.5 + 0.5 * Math.sin(ft * 4);
        const egO = easeInQuad(egP) * 0.5 * pulse;
        eng.style.opacity = p > 0.7 ? egO * (1 - (p - 0.7) / 0.3) : egO;


        // ===== ABERRATION CHROMATIQUE =====
        const caP = clamp((p - 0.2) / 0.35, 0, 1);
        const caO = easeInQuad(caP) * 0.5;
        const caS = caP * 20;
        const caF = p > 0.75 ? 1 - (p - 0.75) / 0.25 : 1;
        chrR.style.opacity = caO * caF;
        chrC.style.opacity = caO * caF;
        chrR.style.background = `radial-gradient(ellipse 35% 25% at ${48 - caS * 0.15}% 49%, rgba(255,60,60,${0.12 + caP * 0.08}) 0%, transparent 100%)`;
        chrC.style.background = `radial-gradient(ellipse 35% 25% at ${52 + caS * 0.15}% 51%, rgba(60,200,255,${0.12 + caP * 0.08}) 0%, transparent 100%)`;
        chrR.style.transform = `translate(${-caS}px,${-caS * 0.4}px)`;
        chrC.style.transform = `translate(${caS}px,${caS * 0.4}px)`;


        // ===== LIGNE D'HORIZON =====
        if (p > 0.6 && p < 0.9) {
            const hp = (p - 0.6) / 0.3;
            hor.style.opacity = easeInOutQuad(hp) * 0.8;
            hor.style.transform = `scaleX(${easeOutCubic(hp)})`;
            hor.style.height = `${2 + hp * 4}px`;
        } else if (p >= 0.9) {
            const hp = (p - 0.9) / 0.1;
            hor.style.opacity = 0.8 * (1 - hp);
            hor.style.transform = `scaleX(${1 + hp * 0.5}) scaleY(${1 + hp * 30})`;
        } else {
            hor.style.opacity = 0;
        }


        // ===== FLASH CENTRAL =====
        if (p > 0.78) {
            const fp = easeInExpo((p - 0.78) / 0.22);
            flash.style.opacity = fp;
            flash.style.width = flash.style.height = fp * 350 + 'vmax';
        } else {
            flash.style.opacity = 0;
            flash.style.width = flash.style.height = '0';
        }


        // ===== PARTICULES DE DISSOLUTION =====
        if (p > 0.15 && p < 0.35 && !partsTrig) {
            partsTrig = true;
            spawnParts();
        }
        if (p < 0.08) partsTrig = false; // Reset si on remonte


        // ===== CONTENU — ZOOM ÉCHELONNÉ =====
        els.forEach(item => {
            const lp = clamp((p - item.delay) / 0.45, 0, 1);
            const ease = easeInCubic(lp);

            const scale = 1 + ease * 18;
            const z = ease * 800;
            const opacity = 1 - easeInQuad(clamp(lp / 0.6, 0, 1));
            const blur = easeInQuad(clamp(lp / 0.5, 0, 1)) * 24;
            const xShift = item.xDrift * ease * 120;

            item.el.style.transform = `translateZ(${z}px) translateX(${xShift}px) scale(${scale})`;
            item.el.style.opacity = opacity;
            item.el.style.filter = `blur(${blur}px)`;
        });


        // ===== INDICATEUR SCROLL =====
        if (cue) cue.style.opacity = clamp(1 - p * 15, 0, 1);


        // ===== REVEAL OVERLAY (transition flash → section suivante) =====
        // Overlay fixe plein écran (z-index 48, au-dessus de tout sauf nav)
        // Séquence : invisible → blanc (sync flash) → dissout → section révélée
        if (revealOverlay) {
            const runwayBottom = heroWrap.offsetTop + heroWrap.offsetHeight;
            const viewportBottom = scrollY + window.innerHeight;
            const scrollPastRunway = viewportBottom - runwayBottom;

            if (p < 0.75) {
                // Phase 1 : Avant le flash — invisible
                revealOverlay.style.opacity = 0;
                revealOverlay.style.background = '#0F172A';
            } else if (scrollPastRunway < 0) {
                // Phase 2 : Flash actif — monte en blanc
                const flashP = easeInExpo((p - 0.75) / 0.25);
                revealOverlay.style.opacity = flashP;
                revealOverlay.style.background = `rgba(255,255,255,${flashP})`;
            } else {
                // Phase 3 : Post-runway — le blanc se dissout en neutral-dark puis transparent
                const dissolveLen = window.innerHeight * 0.6; // 60vh pour dissoudre
                const dp = clamp(scrollPastRunway / dissolveLen, 0, 1);

                if (dp < 0.4) {
                    // D'abord : blanc → neutral-dark (rapid)
                    const colorP = dp / 0.4;
                    const r = Math.round(255 - (255 - 15) * colorP);
                    const g = Math.round(255 - (255 - 23) * colorP);
                    const b = Math.round(255 - (255 - 42) * colorP);
                    revealOverlay.style.background = `rgb(${r},${g},${b})`;
                    revealOverlay.style.opacity = 1;
                } else {
                    // Ensuite : neutral-dark → transparent
                    const fadeP = (dp - 0.4) / 0.6;
                    revealOverlay.style.background = '#0F172A';
                    revealOverlay.style.opacity = 1 - easeOutCubic(fadeP);
                }
            }
        }


        // ===== SCREEN SHAKE (fluide, sinusoïdal) =====
        if (p > 0.3 && p < 0.75) {
            const si = easeInQuad((p - 0.3) / 0.35) * 3.5;
            hero.style.transform = `translate(${smoothNoise(0.12) * si}px,${smoothNoiseY(0.12) * si}px)`;
        } else {
            hero.style.transform = 'none';
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    update(); // État initial
})();
