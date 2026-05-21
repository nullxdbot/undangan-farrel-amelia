/* =============================================
   UNDANGAN PERNIKAHAN - Farrel & Amelia
   script.js
   ============================================= */

// ===== NAMA TAMU DARI URL =====
// Contoh: index.html?to=Nama+Tamu
const urlParams = new URLSearchParams(window.location.search);
const guest = urlParams.get('to');
if (guest) {
  const el = document.getElementById('guestName');
  if (el) el.innerText = decodeURIComponent(guest);
}

// ===== BUKA UNDANGAN =====
function openInvitation(scrollTarget) {
  document.body.classList.add('cover-open');

  const main = document.getElementById('main-content');
  main.classList.add('show');

  document.getElementById('bottom-nav').classList.add('show');
  document.getElementById('musicBtn').classList.add('show');

  // Auto play musik
  setTimeout(() => {
    music.play().then(() => {
      isPlaying = true;
      musicBtn.classList.add('playing');
      musicBtn.querySelector('.music-icon').innerText = '🎶';
    }).catch(e => console.log('Autoplay blocked:', e));
  }, 1000);

  // Scroll ke section target atau ke atas
  setTimeout(() => {
    initScrollObserver();
    if (scrollTarget) {
      const el = document.getElementById(scrollTarget);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, 1000);
}

// ===== AUTO-OPEN JIKA ADA HASH DI URL =====
window.addEventListener('DOMContentLoaded', () => {
  const hash = window.location.hash.replace('#', '');
  const validSections = ['sec-home', 'sec-acara', 'sec-rsvp'];
  if (hash && validSections.includes(hash)) {
    // Matikan transisi cover supaya langsung hilang tanpa animasi
    const cover = document.getElementById('cover');
    cover.style.transition = 'none';

    document.body.classList.add('cover-open');

    const main = document.getElementById('main-content');
    main.classList.add('show');
    document.getElementById('bottom-nav').classList.add('show');
    document.getElementById('musicBtn').classList.add('show');

    // Tunggu DOM render konten dulu, baru scroll
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        initScrollObserver();
        const el = document.getElementById(hash);
        if (el) el.scrollIntoView({ behavior: 'instant' });
      });
    });
  }
});

// ===== SCROLL ANIMATION =====
function initScrollObserver() {
  const cards = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.08 });

  cards.forEach((card, i) => {
    card.style.transitionDelay = (i * 0.08) + 's';
    observer.observe(card);
  });
}

// ===== COUNTDOWN =====
const weddingDate = new Date('2029-09-29T09:00:00').getTime();

function updateCountdown() {
  const gap = weddingDate - Date.now();

  if (gap <= 0) {
    ['cd-d', 'cd-h', 'cd-m', 'cd-s'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerText = '0';
    });
    return;
  }

  const d = Math.floor(gap / 86400000);
  const h = Math.floor((gap % 86400000) / 3600000);
  const m = Math.floor((gap % 3600000) / 60000);
  const s = Math.floor((gap % 60000) / 1000);

  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.innerText = String(val).padStart(2, '0');
  };

  setVal('cd-d', d);
  setVal('cd-h', h);
  setVal('cd-m', m);
  setVal('cd-s', s);
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ===== COPY NOMOR REKENING =====
function copyText(id, btn) {
  const el = document.getElementById(id);
  if (!el) return;
  const text = el.innerText.trim();

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showCopied(btn);
    }).catch(() => fallbackCopy(text, btn));
  } else {
    fallbackCopy(text, btn);
  }
}

function fallbackCopy(text, btn) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;top:-999px;opacity:0';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); showCopied(btn); } catch(e) {}
  document.body.removeChild(ta);
}

function showCopied(btn) {
  const orig = btn.innerText;
  btn.innerText = '✅ Tersalin!';
  btn.classList.add('copied');
  setTimeout(() => {
    btn.innerText = orig;
    btn.classList.remove('copied');
  }, 2500);
}

// ===== RSVP KIRIM VIA WHATSAPP =====
function submitRSVP() {
  const nama   = document.getElementById('nama')?.value.trim();
  const hadir  = document.getElementById('hadir')?.value;
  const ucapan = document.getElementById('ucapan')?.value.trim();

  if (!nama || !ucapan) {
    alert('Harap isi nama dan ucapan terlebih dahulu.');
    return;
  }

  const hadirText = hadir === 'hadir' ? 'Insyaa Allah hadir' :
                    hadir === 'tidak' ? 'Tidak bisa hadir' : 'Belum pasti';

  // Ganti nomor WA berikut dengan nomor mempelai
  const waNumber = '6285855004380';
  const msg = encodeURIComponent(
    `Assalamu'alaikum,\n\nSaya *${nama}* menyampaikan:\n\nKehadiran: ${hadirText}\n\nUcapan/Doa:\n${ucapan}\n\nSemoga pernikahan Farrel & Amelia sakinah, mawaddah, warahmah. Aamiin 🌸`
  );

  window.open(`https://wa.me/${waNumber}?text=${msg}`, '_blank');

  document.getElementById('rsvp-success').style.display = 'block';
  document.getElementById('ucapan').value = '';

  setTimeout(() => {
    document.getElementById('rsvp-success').style.display = 'none';
  }, 4000);
}

// ===== MUSIK LATAR =====
const music    = document.getElementById('bgMusic');
const musicBtn = document.getElementById('musicBtn');
let isPlaying  = false;

function toggleMusic() {
  const icon = musicBtn.querySelector('.music-icon') || musicBtn;
  if (isPlaying) {
    music.pause();
    musicBtn.classList.remove('playing');
    icon.innerText = '🎵';
  } else {
    music.play().catch(e => console.log('Autoplay blocked:', e));
    musicBtn.classList.add('playing');
    icon.innerText = '🎶';
  }
  isPlaying = !isPlaying;
}

// ===== NAVIGASI TANPA HASH =====
function navScroll(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// ===== BOTTOM NAV ACTIVE =====
window.addEventListener('scroll', () => {
  const sections = [
    { id: 'sec-home',  key: 'home'  },
    { id: 'sec-acara', key: 'acara' },
    { id: 'sec-rsvp',  key: 'rsvp'  },
  ];
  const navItems = document.querySelectorAll('.nav-item');
  let current = 'home';

  sections.forEach(({ id, key }) => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 200) {
      current = key;
    }
  });

  navItems.forEach(item => {
    item.classList.toggle('active', item.dataset.section === current);
  });
}, { passive: true });
