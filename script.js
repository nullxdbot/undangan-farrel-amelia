/* =============================================
   UNDANGAN PERNIKAHAN - Farrel & Amelia
   script.js
   ============================================= */

// ===== COVER: Nama Tamu dari URL =====
// Contoh URL: index.html?to=Nama+Tamu
const urlParams = new URLSearchParams(window.location.search);
const guest = urlParams.get('to');
if (guest) {
  document.getElementById('guestName').innerText = guest;
}

// ===== ANIMASI KELOPAK BUNGA (Petal) =====
const petalColors = ['#a8d4f0', '#c8e8f8', '#f7c3cb', '#f8d9de', '#d4e8c0'];
const cover = document.getElementById('cover');

for (let i = 0; i < 20; i++) {
  const p = document.createElement('div');
  p.className = 'petal';
  p.style.cssText = `
    left: ${Math.random() * 100}%;
    background: ${petalColors[Math.floor(Math.random() * petalColors.length)]};
    width: ${8 + Math.random() * 10}px;
    height: ${12 + Math.random() * 14}px;
    animation-duration: ${4 + Math.random() * 6}s;
    animation-delay: ${Math.random() * 6}s;
    border-radius: ${Math.random() > 0.5 ? '50% 0 50% 0' : '0 50% 0 50%'};
  `;
  cover.appendChild(p);
}

// ===== BUKA UNDANGAN =====
function openInvitation() {
  document.body.classList.add('cover-open');
  document.getElementById('navbar').classList.add('show');
  document.getElementById('musicBtn').classList.add('show');
  // Mulai animasi scroll setelah cover selesai
  setTimeout(() => animateSections(), 800);
}

// ===== SCROLL ANIMATION (Intersection Observer) =====
function animateSections() {
  const cards = document.querySelectorAll('.section-card');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => observer.observe(card));
}

// ===== COUNTDOWN HITUNG MUNDUR =====
// Ganti tanggal sesuai hari H (format: 'YYYY-MM-DDTHH:MM:SS')
const weddingDate = new Date('2026-05-23T09:00:00').getTime();

function updateCountdown() {
  const now = Date.now();
  const gap = weddingDate - now;

  if (gap <= 0) {
    ['cd-d', 'cd-h', 'cd-m', 'cd-s'].forEach(id => {
      document.getElementById(id).innerText = '0';
    });
    return;
  }

  document.getElementById('cd-d').innerText = Math.floor(gap / 86400000);
  document.getElementById('cd-h').innerText = Math.floor((gap % 86400000) / 3600000);
  document.getElementById('cd-m').innerText = Math.floor((gap % 3600000) / 60000);
  document.getElementById('cd-s').innerText = Math.floor((gap % 60000) / 1000);
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ===== SALIN NOMOR REKENING =====
function copyText(id, btn) {
  const text = document.getElementById(id).innerText;
  navigator.clipboard.writeText(text).then(() => {
    const orig = btn.innerText;
    btn.innerText = '✅ Tersalin!';
    setTimeout(() => btn.innerText = orig, 2000);
  });
}

// ===== KIRIM RSVP =====
function submitRSVP() {
  const nama   = document.getElementById('nama').value.trim();
  const ucapan = document.getElementById('ucapan').value.trim();

  if (!nama || !ucapan) {
    alert('Harap isi nama dan ucapan.');
    return;
  }

  document.getElementById('rsvp-success').style.display = 'block';
  document.getElementById('ucapan').value = '';
}

// ===== MUSIK LATAR =====
const music    = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicBtn');
let isPlaying  = false;

function toggleMusic() {
  // Pastikan src sudah diisi di <audio> di HTML
  if (!music.src || music.src === window.location.href) {
    alert('Tambahkan URL musik pada tag <audio> di index.html');
    return;
  }

  if (isPlaying) {
    music.pause();
    musicBtn.classList.remove('playing');
  } else {
    music.play();
    musicBtn.classList.add('playing');
  }
  isPlaying = !isPlaying;
}

// ===== NAV ACTIVE STATE =====
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('[id^="section-"]');
  const navLinks = document.querySelectorAll('.nav-link');
  let current = '';

  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 200) {
      current = section.id.replace('section-', '');
    }
  });

  navLinks.forEach(link => {
    const isHome = current === '' && link.dataset.section === 'home';
    link.classList.toggle('active', link.dataset.section === current || isHome);
  });
});
