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
}

calculateExperience();

const glow = document.querySelector(".cursor-glow");
document.addEventListener("mousemove", (e) => {
  glow.style.left = e.clientX + "px";
  glow.style.top = e.clientY + "px";
});


//Recommendation: Consider adding a debounce function to optimize the mousemove event listener, as it can be triggered very frequently and may cause performance issues.

const BASE_URL = 'https://emergencymm-backend-production.up.railway.app';
let deleteTargetId = null;
 
// ── LOAD RECOMMENDATIONS ──────────────────────────────────────────────
async function loadRecommendations() {
    document.getElementById('recGrid').innerHTML =
        '<div class="rec-loader"><i class="fas fa-spinner fa-spin"></i> Loading...</div>';

    try {
        const res  = await fetch(`${BASE_URL}/api/users/getRecommendations`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ searchtxt: '', rating: '', company: '' })
        });
        const data = await res.json();
        renderCards(data.recommendationList || [], data.recommendationCount || 0);
    } catch {
        document.getElementById('recGrid').innerHTML =
            '<div class="rec-empty"><i class="fas fa-wifi"></i> Could not connect to server.</div>';
    }
}
 
// ── RENDER ────────────────────────────────────────────────────────
function renderCards(items, count) {
    document.getElementById('recCount').textContent =
        count ? `${count} recommendation${count > 1 ? 's' : ''}` : '';
 
    if (!items.length) {
        document.getElementById('recGrid').innerHTML =
            '<div class="rec-empty"><i class="fas fa-comment-slash"></i>No recommendations found.</div>';
        return;
    }
 
    document.getElementById('recGrid').innerHTML = items.map(r => {
        const initials = (r.recommenderName || '?')
            .split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
        const filled  = '★'.repeat(r.rating || 0);
        const empty   = '<span class="rec-stars-empty">' + '★'.repeat(5 - (r.rating || 0)) + '</span>';
        const meta    = [r.positionTitle, r.companyName].filter(Boolean).join(' · ');
 
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
    document.getElementById('recId').value       = r.recommendationId || '';
    document.getElementById('recName').value     = r.recommenderName  || '';
    document.getElementById('recPosition').value = r.positionTitle    || '';
    document.getElementById('recCompany2').value = r.companyName      || '';
    document.getElementById('recText').value     = r.recommendationText || '';
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
    const id   = document.getElementById('recId').value;
    const name = document.getElementById('recName').value.trim();
    const text = document.getElementById('recText').value.trim();
 
    if (!name) { showToast('Recommender name is required.', 'error'); return; }
    if (!text) { showToast('Recommendation text is required.', 'error'); return; }
 
    const isEdit  = !!id;
    const payload = {
        ...(isEdit && { recommendationId: parseInt(id) }),
        recommenderName:    name,
        positionTitle:      document.getElementById('recPosition').value.trim(),
        companyName:        document.getElementById('recCompany2').value.trim(),
        recommendationText: text,
        rating:             parseInt(document.getElementById('recRating').value)
    };
 
    const url    = isEdit
        ? `${BASE_URL}/api/users/updateRecommendation`
        : `${BASE_URL}/api/users/insertRecommendation`;
    const method = isEdit ? 'PUT' : 'POST';
 
    try {
        const res  = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(payload)
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
        const res  = await fetch(
            `${BASE_URL}/api/users/deleteRecommendation/${deleteTargetId}`,
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
    t.className   = `rec-toast ${type} show`;
    setTimeout(() => t.classList.remove('show'), 3000);
}
 
// ── UTILS ─────────────────────────────────────────────────────────
function esc(s) {
    return String(s ?? '')
        .replace(/&/g,'&amp;').replace(/</g,'&lt;')
        .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
 
// Search on Enter key
document.addEventListener('DOMContentLoaded', () => {
    loadRecommendations();
    setRating(5);
    ['recSearch','recCompany'].forEach(id => {
        document.getElementById(id).addEventListener('keydown', e => {
            if (e.key === 'Enter') loadRecommendations();
        });
    });
    document.getElementById('recRatingFilter').addEventListener('change', loadRecommendations);
});