/* ===================== HEARTS BACKGROUND ===================== */
const heartEmojis = ['❤️','💖','💗','💓','💕','💝','🌸','💞','🫀','💘'];

function createHeart() {
  const c = document.getElementById('hearts-container');
  const h = document.createElement('div');
  h.className = 'heart-bg';
  h.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
  h.style.left = Math.random() * 100 + 'vw';
  h.style.fontSize = (0.9 + Math.random() * 1.4) + 'rem';
  const dur = 7 + Math.random() * 8;
  h.style.animationDuration = dur + 's';
  h.style.animationDelay = (Math.random() * 4) + 's';
  c.appendChild(h);
  setTimeout(() => h.remove(), (dur + 4) * 1000);
}

setInterval(createHeart, 700);
for (let i = 0; i < 12; i++) setTimeout(createHeart, i * 200);

/* ===================== CONFETTI ===================== */
const confColors = ['#e8637a','#f4a0b0','#ffd6de','#ff8fab','#c9184a','#ffb3c1','#ffc8dd','#ff85a1','#4caf8a','#fffacd'];

function launchConfetti() {
  const c = document.getElementById('confetti-container');
  for (let i = 0; i < 120; i++) {
    setTimeout(() => {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = Math.random() * 100 + 'vw';
      piece.style.background = confColors[Math.floor(Math.random() * confColors.length)];
      const size = 6 + Math.random() * 10;
      piece.style.width = size + 'px';
      piece.style.height = size + 'px';
      piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      const dur = 2.2 + Math.random() * 2.5;
      piece.style.animationDuration = dur + 's';
      piece.style.animationDelay = (Math.random() * 0.5) + 's';
      c.appendChild(piece);
      setTimeout(() => piece.remove(), (dur + 1) * 1000);
    }, i * 25);
  }
}

/* ===================== SCREEN TRANSITIONS ===================== */
function goToScreen(toId) {
  const current = document.querySelector('.screen.active');
  const next = document.getElementById(toId);
  if (!next || current === next) return;

  current.classList.add('fade-out');
  setTimeout(() => {
    current.classList.remove('active', 'fade-out');
    current.style.display = 'none';
    next.style.display = 'flex';
    // Force reflow
    void next.offsetWidth;
    next.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 420);
}

/* ===================== NO BUTTON LOGIC ===================== */
const noMessages = [
  '¿Segura? 😏',
  'Piénsalo otra vez ❤️',
  'Ese no no vale 😂',
  'Inténtalo de nuevo 😜',
  'Creo que querías decir sí 😎',
  '¡Que no se te escapa! 🏃‍♀️',
  'Mi corazón no lo acepta 💔',
  'Ese botón está prohibido 🚫',
  '¡Casi! Intenta el verde 🟢',
  'El "no" no existe aquí 😂',
];

let msgIndex = 0;
let noIsFloating = false;
const floatMsg = document.getElementById('float-msg');

function showFloatMessage(x, y) {
  const msg = noMessages[msgIndex % noMessages.length];
  msgIndex++;
  floatMsg.textContent = msg;
  floatMsg.classList.remove('show');

  // Position near where button was
  const msgWidth = 220;
  const msgHeight = 44;
  let fx = Math.min(Math.max(x - msgWidth / 2, 10), window.innerWidth - msgWidth - 10);
  let fy = Math.max(y - 60, 10);
  floatMsg.style.left = fx + 'px';
  floatMsg.style.top = fy + 'px';

  // Show
  requestAnimationFrame(() => {
    floatMsg.classList.add('show');
    setTimeout(() => floatMsg.classList.remove('show'), 1800);
  });
}

function getRandomPosition(btnW, btnH) {
  const margin = 20;
  const maxX = window.innerWidth  - btnW - margin;
  const maxY = window.innerHeight - btnH - margin;
  return {
    x: Math.max(margin, Math.floor(Math.random() * maxX)),
    y: Math.max(margin, Math.floor(Math.random() * maxY)),
  };
}

function makeNoFloat() {
  const btn = document.getElementById('btn-no');
  if (!noIsFloating) {
    noIsFloating = true;
    btn.classList.add('floating');
    btn.style.position = 'fixed';
  }
}

function moveNo(sourceEvent) {
  const btn = document.getElementById('btn-no');

  // Capture current center before moving (for message placement)
  let cx = window.innerWidth / 2;
  let cy = window.innerHeight / 2;
  if (!noIsFloating) {
    const rect = btn.getBoundingClientRect();
    cx = rect.left + rect.width / 2;
    cy = rect.top + rect.height / 2;
  } else {
    cx = parseInt(btn.style.left || '0') + btn.offsetWidth / 2;
    cy = parseInt(btn.style.top  || '0') + btn.offsetHeight / 2;
  }

  makeNoFloat();

  const pos = getRandomPosition(btn.offsetWidth || 140, btn.offsetHeight || 52);
  btn.style.left = pos.x + 'px';
  btn.style.top  = pos.y + 'px';

  showFloatMessage(cx, cy);
}

// Desktop: move on mouseenter
document.getElementById('btn-no').addEventListener('mouseenter', moveNo);

// Mobile: move on touchstart (prevent default to stop click)
document.getElementById('btn-no').addEventListener('touchstart', function(e) {
  e.preventDefault();
  moveNo(e);
}, { passive: false });

// Extra safety: intercept any click on "No"
document.getElementById('btn-no').addEventListener('click', function(e) {
  e.preventDefault();
  e.stopPropagation();
  moveNo(e);
});

/* ===================== YES HANDLER ===================== */
function handleYes() {
  const btn = document.getElementById('btn-yes');
  btn.textContent = '¡Siiiii! 🎉';
  btn.style.transform = 'scale(1.15)';

  launchConfetti();

  setTimeout(() => {
    goToScreen('screen-plans');
  }, 700);
}

/* ===================== PLAN SELECTION ===================== */
let selectedPlan = '';

function selectPlan(plan) {
  selectedPlan = plan;
  document.getElementById('selected-plan-badge').textContent = plan;

  // Highlight selected card
  document.querySelectorAll('.plan-card').forEach(c => c.style.outline = '');
  event.currentTarget
    ? event.currentTarget.style.outline = '3px solid #e8637a'
    : null;

  goToScreen('screen-date');
  updateSummary();
}

/* ===================== DATE & TIME ===================== */
// Populate hours
const hourSel = document.getElementById('hour-select');
for (let h = 1; h <= 12; h++) {
  const opt = document.createElement('option');
  opt.value = String(h).padStart(2, '0');
  opt.textContent = String(h).padStart(2, '0');
  hourSel.appendChild(opt);
}

// Set min date to today
const dateInput = document.getElementById('date-input');
const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, '0');
const dd = String(today.getDate()).padStart(2, '0');
dateInput.min = `${yyyy}-${mm}-${dd}`;

// Live summary update
['date-input','hour-select','min-select','ampm-select'].forEach(id => {
  document.getElementById(id).addEventListener('change', updateSummary);
});

function formatDateSpanish(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const months = ['enero','febrero','marzo','abril','mayo','junio',
                  'julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const days = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];
  const dt = new Date(y, m - 1, d);
  return `${days[dt.getDay()]} ${d} de ${months[m - 1]} de ${y}`;
}

function updateSummary() {
  const date = document.getElementById('date-input').value;
  const hour = document.getElementById('hour-select').value;
  const min  = document.getElementById('min-select').value;
  const ampm = document.getElementById('ampm-select').value;

  const summaryBox = document.getElementById('summary-box');
  const summaryTxt = document.getElementById('summary-text');

  if (date && hour && min) {
    const dateStr = formatDateSpanish(date);
    summaryTxt.innerHTML = `${selectedPlan || '❓ Plan por elegir'}<br>📅 ${dateStr}<br>🕐 ${hour}:${min} ${ampm}`;
    summaryBox.classList.remove('hidden');
  } else {
    summaryBox.classList.add('hidden');
  }
}

/* ===================== CONFIRM DATE ===================== */
function confirmDate() {
  const date = document.getElementById('date-input').value;
  const hour = document.getElementById('hour-select').value;
  const min  = document.getElementById('min-select').value;
  const ampm = document.getElementById('ampm-select').value;

  if (!date || !hour || !min) {
    // Shake the button
    const btn = document.querySelector('.btn-confirm');
    btn.style.animation = 'shake 0.4s ease';
    btn.textContent = '¡Elige fecha y hora primero! 📅';
    setTimeout(() => {
      btn.style.animation = '';
      btn.textContent = '¡Confirmar cita! 💕';
    }, 2000);
    return;
  }

  const dateStr = formatDateSpanish(date);
  const summary = `${selectedPlan}\n📅 ${dateStr}\n🕐 ${hour}:${min} ${ampm}`;
  document.getElementById('final-summary').innerHTML =
    `${selectedPlan}<br>📅 ${dateStr}<br>🕐 ${hour}:${min} ${ampm}`;

  launchConfetti();

  setTimeout(() => {
    goToScreen('screen-final');
  }, 500);
}

/* ===================== WHATSAPP ===================== */
function avisarWhatsApp() {
  const date   = document.getElementById('date-input').value;
  const hour   = document.getElementById('hour-select').value;
  const min    = document.getElementById('min-select').value;
  const ampm   = document.getElementById('ampm-select').value;
  const dateStr = formatDateSpanish(date);

  const mensaje =
    `💌 ¡Hola! Ana Raquel confirmó nuestra cita 🎉\n\n` +
    `📌 Plan: ${selectedPlan}\n` +
    `📅 Fecha: ${dateStr}\n` +
    `🕐 Hora: ${hour}:${min} ${ampm}\n\n` +
    `✨ Sabía que Dios me tenía en tus planes ❤️`;

  // Tu número de WhatsApp (con código de país, sin + ni espacios)
  const tuNumero = '50493245382';

  const url = `https://wa.me/${tuNumero}?text=${encodeURIComponent(mensaje)}`;
  window.open(url, '_blank');
}

// Shake keyframes via JS (fallback)
const styleTag = document.createElement('style');
styleTag.textContent = `
@keyframes shake {
  0%,100% { transform: translateX(0); }
  20%      { transform: translateX(-8px); }
  40%      { transform: translateX(8px); }
  60%      { transform: translateX(-5px); }
  80%      { transform: translateX(5px); }
}`;
document.head.appendChild(styleTag);
