/* ==========================================================================
   YE WINT AUNG — PORTFOLIO  ·  Script
   ========================================================================== */

// ── Experience Calculator ────────────────────────────────────────────
function calculateExperience() {
    const start = new Date("2023-07-01");
    const today = new Date();

    let years = today.getFullYear() - start.getFullYear();
    let months = today.getMonth() - start.getMonth();

    if (today.getDate() < start.getDate()) {
        months--;
    }

    if (months < 0) {
        years--;
        months += 12;
    }

    let yearStr = "";
    if (years > 0) {
        yearStr = `${years} year${years !== 1 ? "s" : ""}`;
    }

    let monthStr = "";
    if (months > 0) {
        monthStr = `${months} month${months !== 1 ? "s" : ""}`;
    }

    const displayStr = [yearStr, monthStr].filter(Boolean).join(" ");
    document.getElementById("workingDays").innerText = displayStr || "0 months";
    const aboutEl = document.getElementById("aboutExperience");
    if (aboutEl) aboutEl.innerText = displayStr || "0 months";
}

calculateExperience();

// ── Cursor Glow ──────────────────────────────────────────────────────
const glow = document.querySelector(".cursor-glow");
let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;

document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateGlow() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    glow.style.left = glowX + "px";
    glow.style.top = glowY + "px";
    requestAnimationFrame(animateGlow);
}
animateGlow();

// ── Particle Background ─────────────────────────────────────────────
(function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let microStars = [];
    let spaceDust = [];
    const PARTICLE_COUNT = 200;
    const MICRO_STAR_COUNT = 200;
    const SPACE_DUST_COUNT = 40;
    const CONNECTION_DIST = 120;
    let frame = 0;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initMicroStars();
    }
    resize();
    window.addEventListener('resize', resize);

    // ── Connected Particles (existing) ──
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.radius = Math.random() * 2 + 0.8;
            this.opacity = Math.random() * 0.4 + 0.3;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(124, 58, 237, ${this.opacity})`;
            ctx.fill();
            // Soft glow around each particle
            const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 3);
            grad.addColorStop(0, `rgba(124, 58, 237, ${this.opacity * 0.3})`);
            grad.addColorStop(1, `rgba(124, 58, 237, 0)`);
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();
        }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }

    // ── Micro Stars (static twinkling dots) ──
    function initMicroStars() {
        microStars = [];
        const colors = [
            [255, 255, 255],
            [200, 215, 255],
            [180, 190, 255],
            [6, 182, 212],
            [168, 85, 247],
            [255, 220, 190],
        ];
        for (let i = 0; i < MICRO_STAR_COUNT; i++) {
            microStars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 1.2 + 0.2,
                baseAlpha: Math.random() * 0.5 + 0.15,
                speed: Math.random() * 0.02 + 0.004,
                offset: Math.random() * Math.PI * 2,
                color: colors[Math.floor(Math.random() * colors.length)],
            });
        }
    }
    initMicroStars();

    // ── Space Dust (tiny slow-drifting motes) ──
    for (let i = 0; i < SPACE_DUST_COUNT; i++) {
        spaceDust.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.15,
            vy: (Math.random() - 0.5) * 0.15,
            r: Math.random() * 0.8 + 0.2,
            alpha: Math.random() * 0.2 + 0.05,
            isCyan: Math.random() > 0.5,
        });
    }

    function animate() {
        frame++;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Layer 1: Micro Stars (twinkling)
        microStars.forEach(s => {
            const flicker = Math.sin(frame * s.speed + s.offset);
            const alpha = s.baseAlpha + flicker * 0.2;
            if (alpha <= 0) return;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${s.color[0]}, ${s.color[1]}, ${s.color[2]}, ${alpha})`;
            ctx.fill();
        });

        // Layer 2: Space Dust (drifting motes)
        spaceDust.forEach(d => {
            d.x += d.vx;
            d.y += d.vy;
            if (d.x < -5) d.x = canvas.width + 5;
            if (d.x > canvas.width + 5) d.x = -5;
            if (d.y < -5) d.y = canvas.height + 5;
            if (d.y > canvas.height + 5) d.y = -5;
            ctx.beginPath();
            ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
            ctx.fillStyle = d.isCyan
                ? `rgba(6, 182, 212, ${d.alpha})`
                : `rgba(168, 85, 247, ${d.alpha})`;
            ctx.fill();
        });

        // Layer 3: Connected Particles
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CONNECTION_DIST) {
                    const opacity = (1 - dist / CONNECTION_DIST) * 0.18;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(6, 182, 212, ${opacity})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animate);
    }
    animate();
})();

// ── Typing Effect ────────────────────────────────────────────────────
(function initTyping() {
    const el = document.getElementById('typingText');
    if (!el) return;

    const phrases = [
        'Flutter Developer',
        'Full-Stack Web Developer',
        'Angular & Spring Boot',
        'Mobile App Developer'
    ];
    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    const TYPE_SPEED = 80;
    const DELETE_SPEED = 40;
    const PAUSE = 2000;

    function type() {
        const current = phrases[phraseIdx];
        if (!isDeleting) {
            el.textContent = current.substring(0, charIdx + 1);
            charIdx++;
            if (charIdx === current.length) {
                isDeleting = true;
                setTimeout(type, PAUSE);
                return;
            }
            setTimeout(type, TYPE_SPEED);
        } else {
            el.textContent = current.substring(0, charIdx - 1);
            charIdx--;
            if (charIdx === 0) {
                isDeleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
                setTimeout(type, 400);
                return;
            }
            setTimeout(type, DELETE_SPEED);
        }
    }
    type();
})();

// ── Scroll Reveal (IntersectionObserver) ──────────────────────────────
(function initScrollReveal() {
    const sections = document.querySelectorAll('[data-animate]');
    const children = document.querySelectorAll('[data-animate-child]');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                sectionObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    sections.forEach(s => sectionObserver.observe(s));

    const childObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // Stagger the children animations
                const delay = Array.from(entry.target.parentElement.children)
                    .indexOf(entry.target) * 80;
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                childObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05, rootMargin: '0px 0px -30px 0px' });

    children.forEach(c => childObserver.observe(c));
})();

// ── Navbar Scroll Effects ────────────────────────────────────────────
(function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Scrolled state
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link highlighting
        let current = '';
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 150 && rect.bottom > 150) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
})();

// ── Scroll to Top ────────────────────────────────────────────────────
(function initScrollTop() {
    const btn = document.getElementById('scrollTopBtn');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
})();

// ══════════════════════════════════════════════════════════════════════
//  RECOMMENDATIONS (SERVER-AWARE)
// ══════════════════════════════════════════════════════════════════════

const BASE_URL = 'https://emergencymm-backend-production.up.railway.app';
let deleteTargetId = null;

// ── LOAD RECOMMENDATIONS ──────────────────────────────────────────────
async function loadRecommendations() {
    const section = document.getElementById('recommendations');
    const recNavLink = document.getElementById('recNavLink');

    document.getElementById('recGrid').innerHTML =
        '<div class="rec-loader"><i class="fas fa-spinner fa-spin"></i> Loading...</div>';

    try {
        const res = await fetch(`${BASE_URL}/api/users/getRecommendations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ searchtxt: '', rating: '', company: '' })
        });
        const data = await res.json();
        renderCards(data.recommendationList || [], data.recommendationCount || 0);

        // Show the section on successful load
        if (section) section.classList.remove('hidden-section');
        if (recNavLink) recNavLink.parentElement.style.display = '';
    } catch {
        // Hide the entire Recommendations section if server is unreachable
        if (section) section.classList.add('hidden-section');
        if (recNavLink) recNavLink.parentElement.style.display = 'none';
    }
}

// ── RENDER ────────────────────────────────────────────────────────
function renderCards(items, count) {
    document.getElementById('recCount').textContent =
        count ? `${count} recommendation${count > 1 ? 's' : ''}` : '';

    if (!items.length) {
        document.getElementById('recGrid').innerHTML =
            '<div class="rec-empty"><i class="fas fa-comment-slash"></i>No recommendations yet. Be the first!</div>';
        return;
    }

    document.getElementById('recGrid').innerHTML = items.map(r => {
        const initials = (r.recommenderName || '?')
            .split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
        const filled = '★'.repeat(r.rating || 0);
        const empty = '<span class="rec-stars-empty">' + '★'.repeat(5 - (r.rating || 0)) + '</span>';
        const meta = [r.positionTitle, r.companyName].filter(Boolean).join(' · ');

        return `
        <div class="rec-card">
            <div class="rec-card-top">
                <div class="rec-avatar">${esc(initials)}</div>
                <div class="rec-card-info">
                    <p class="rec-card-name">${esc(r.recommenderName)}</p>
                    <p class="rec-card-meta">${esc(meta || '—')}</p>
                </div>
            </div>
            <p class="rec-card-text">${esc(r.recommendationText)}</p>
            <div class="rec-card-bottom">
                <span class="rec-stars-display">${filled}${empty}</span>
                <div class="rec-card-actions">
                    <button class="rec-icon-btn" title="Edit"
                        onclick='openModal("edit", ${JSON.stringify(r)})'>
                        <i class="fas fa-pen"></i>
                    </button>
                    <button class="rec-icon-btn del" title="Delete"
                        onclick="openDeleteModal(${r.recommendationId}, '${esc(r.recommenderName)}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>`;
    }).join('');
}

// ── MODAL ─────────────────────────────────────────────────────────
function openModal(mode, r = {}) {
    document.getElementById('modalTitle').textContent =
        mode === 'add' ? 'Add Recommendation' : 'Edit Recommendation';
    document.getElementById('saveBtnText').textContent =
        mode === 'add' ? 'Save' : 'Update';
    document.getElementById('recId').value = r.recommendationId || '';
    document.getElementById('recName').value = r.recommenderName || '';
    document.getElementById('recPosition').value = r.positionTitle || '';
    document.getElementById('recCompany2').value = r.companyName || '';
    document.getElementById('recText').value = r.recommendationText || '';
    setRating(r.rating || 5);
    document.getElementById('recModal').classList.add('open');
}

function closeModal() {
    document.getElementById('recModal').classList.remove('open');
}

function handleOverlayClick(e) {
    if (e.target === document.getElementById('recModal')) closeModal();
}

// ── STAR PICKER ───────────────────────────────────────────────────
function setRating(val) {
    document.getElementById('recRating').value = val;
    document.querySelectorAll('.rec-star').forEach(s => {
        s.classList.toggle('active', parseInt(s.dataset.val) <= val);
    });
}

// ── SAVE ──────────────────────────────────────────────────────────
async function saveRecommendation() {
    const id = document.getElementById('recId').value;
    const name = document.getElementById('recName').value.trim();
    const text = document.getElementById('recText').value.trim();

    if (!name) { showToast('Recommender name is required.', 'error'); return; }
    if (!text) { showToast('Recommendation text is required.', 'error'); return; }

    const isEdit = !!id;
    const payload = {
        ...(isEdit && { recommendationId: parseInt(id) }),
        recommenderName: name,
        positionTitle: document.getElementById('recPosition').value.trim(),
        companyName: document.getElementById('recCompany2').value.trim(),
        recommendationText: text,
        rating: parseInt(document.getElementById('recRating').value)
    };

    const url = isEdit
        ? `${BASE_URL}/api/users/updateRecommendation`
        : `${BASE_URL}/api/users/insertRecommendation`;
    const method = isEdit ? 'PUT' : 'POST';

    try {
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.status === 'success') {
            showToast(isEdit ? 'Recommendation updated!' : 'Recommendation added!', 'success');
            closeModal();
            loadRecommendations();
        } else {
            showToast(data.message || 'Something went wrong.', 'error');
        }
    } catch {
        showToast('Failed to save. Check connection.', 'error');
    }
}

// ── DELETE ────────────────────────────────────────────────────────
function openDeleteModal(id, name) {
    deleteTargetId = id;
    document.getElementById('deleteRecName').textContent = name;
    document.getElementById('recDeleteModal').classList.add('open');
}

function closeDeleteModal() {
    document.getElementById('recDeleteModal').classList.remove('open');
    deleteTargetId = null;
}

function handleDeleteOverlayClick(e) {
    if (e.target === document.getElementById('recDeleteModal')) closeDeleteModal();
}

async function confirmDelete() {
    if (!deleteTargetId) return;
    try {
        const res = await fetch(
            `${BASE_URL}/api/users/deleteRecommendation/recommendationId=${deleteTargetId}`,
            { method: 'DELETE' }
        );
        const data = await res.json();
        if (data.status === 'success') {
            showToast('Recommendation deleted.', 'success');
            closeDeleteModal();
            loadRecommendations();
        } else {
            showToast(data.message || 'Delete failed.', 'error');
        }
    } catch {
        showToast('Failed to delete. Check connection.', 'error');
    }
}

// ── TOAST ─────────────────────────────────────────────────────────
function showToast(msg, type = 'success') {
    const t = document.getElementById('recToast');
    t.textContent = msg;
    t.className = `rec-toast ${type} show`;
    setTimeout(() => t.classList.remove('show'), 3000);
}

// ── UTILS ─────────────────────────────────────────────────────────
function esc(s) {
    return String(s ?? '')
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ── INIT ──────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    loadRecommendations();
    setRating(5);
});