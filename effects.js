(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const C = window.SITE_CONFIG || {};
  const hero = $('#beranda');
  const crest = $('.crest');

  document.documentElement.classList.add('fx');
  const bar = document.createElement('div');
  bar.className = 'fx-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.append(bar);

  let ticking = false;
  function onScroll() {
    ticking = false;
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
    if (hero && y < window.innerHeight * 1.3) {
      hero.style.setProperty('--hs', Math.round(y));
      hero.style.setProperty('--hp', Math.min(1, y / (window.innerHeight * 0.8)).toFixed(3));
    }
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  const h1 = $('.hero__name');
  if (h1 && h1.textContent.trim()) {
    const text = h1.textContent.trim();
    h1.setAttribute('aria-label', text);
    h1.textContent = '';
    let n = 0;
    const words = text.split(/\s+/);
    words.forEach((word, wi) => {
      const w = document.createElement('span');
      w.className = 'fx-word';
      w.setAttribute('aria-hidden', 'true');
      [...word].forEach((ch) => {
        const s = document.createElement('span');
        s.className = 'fx-ch';
        s.textContent = ch;
        s.style.setProperty('--i', n++);
        w.append(s);
      });
      h1.append(w);
      if (wi < words.length - 1) h1.append(' ');
    });
    h1.classList.add('is-split');
  }
  const bg = $('.hero__bg');
  const SHAPES = [
    ['ring', '<svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="30" fill="none" stroke="currentColor" stroke-width="6"/></svg>'],
    ['spark', '<svg viewBox="0 0 80 80"><path d="M40 4c3 20 16 33 36 36-20 3-33 16-36 36-3-20-16-33-36-36C24 37 37 24 40 4z" fill="currentColor"/></svg>'],
    ['squig', '<svg viewBox="0 0 120 40"><path d="M4 28c10-22 18-22 28 0s18 22 28 0 18-22 28 0 18 22 28 0" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round"/></svg>'],
    ['plus', '<svg viewBox="0 0 60 60"><path d="M30 8v44M8 30h44" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round"/></svg>'],
    ['dots', '<svg viewBox="0 0 48 48" fill="currentColor"><circle cx="8" cy="8" r="4"/><circle cx="24" cy="8" r="4"/><circle cx="40" cy="8" r="4"/><circle cx="8" cy="24" r="4"/><circle cx="24" cy="24" r="4"/><circle cx="40" cy="24" r="4"/><circle cx="8" cy="40" r="4"/><circle cx="24" cy="40" r="4"/><circle cx="40" cy="40" r="4"/></svg>'],
    ['tri', '<svg viewBox="0 0 80 80"><path d="M40 12L70 64H10z" fill="currentColor" stroke="currentColor" stroke-width="8" stroke-linejoin="round"/></svg>']
  ];
  let glow = null;
  if (bg) {
    SHAPES.forEach(([name, svg]) => {
      const s = document.createElement('span');
      s.className = `fx-shape fx-shape--${name}`;
      s.innerHTML = svg; 
      bg.append(s);
    });
    glow = document.createElement('div');
    glow.className = 'fx-glow';
    bg.append(glow);
  }
  if (hero && finePointer) {
    let raf = 0, ex = 0, ey = 0;
    const apply = () => {
      raf = 0;
      const r = hero.getBoundingClientRect();
      const x = (ex - r.left) / r.width;
      const y = (ey - r.top) / r.height;
      hero.style.setProperty('--px', (x - 0.5).toFixed(3));
      hero.style.setProperty('--py', (y - 0.5).toFixed(3));
      if (glow) {
        glow.style.setProperty('--gx', `${ex - r.left}px`);
        glow.style.setProperty('--gy', `${ey - r.top}px`);
      }
      if (crest) {
        crest.style.transform =
          `perspective(800px) rotateX(${((0.5 - y) * 12).toFixed(2)}deg) rotateY(${((x - 0.5) * 16).toFixed(2)}deg)`;
      }
    };
    hero.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      ex = e.clientX; ey = e.clientY;
      if (!raf) raf = requestAnimationFrame(apply);
    }, { passive: true });
    hero.addEventListener('pointerleave', () => {
      hero.style.setProperty('--px', 0);
      hero.style.setProperty('--py', 0);
      if (crest) crest.style.transform = '';
    });
  }
  const COLORS = ['#FFD54A', '#FF7A59', '#FFFFFF', '#2B3BE8', '#0E1138'];
  function burst(x, y) {
    for (let i = 0; i < 24; i++) {
      const p = document.createElement('i');
      p.className = 'fx-confetti';
      p.style.left = `${x}px`;
      p.style.top = `${y}px`;
      p.style.background = COLORS[i % COLORS.length];
      document.body.append(p);
      const a = Math.random() * Math.PI * 2;
      const d = 70 + Math.random() * 140;
      const dx = Math.cos(a) * d;
      const dy = Math.sin(a) * d - 50;
      p.animate([
        { transform: 'translate(-50%, -50%) rotate(0deg)', opacity: 1 },
        { transform: `translate(${dx}px, ${dy + 130}px) rotate(${Math.round(Math.random() * 720 - 360)}deg)`, opacity: 0 }
      ], { duration: 900 + Math.random() * 600, easing: 'cubic-bezier(.15,.7,.3,1)' })
        .onfinish = () => p.remove();
    }
  }
  if (crest) {
    crest.classList.add('fx-clickable');
    crest.addEventListener('click', (e) => burst(e.clientX, e.clientY));
  }
  const skillWords = [...new Set((C.skills || []).flatMap((g) => g.items || []))];
  if (hero && skillWords.length) {
    let list = [...skillWords];
    while (list.length < 14) list = list.concat(skillWords);

    const makeGroup = () => {
      const g = document.createElement('div');
      g.className = 'fx-ribbon__group';
      list.forEach((word) => {
        const s = document.createElement('span');
        s.textContent = word;
        g.append(s);
      });
      return g;
    };
    const wrap = document.createElement('div');
    wrap.className = 'fx-ribbon';
    wrap.setAttribute('aria-hidden', 'true');
    const band = document.createElement('div');
    band.className = 'fx-ribbon__band';
    const track = document.createElement('div');
    track.className = 'fx-ribbon__track';
    track.style.setProperty('--dur', `${Math.max(24, list.length * 2.6)}s`);
    track.append(makeGroup(), makeGroup());
    band.append(track);
    wrap.append(band);
    hero.after(wrap);
  }
  if ('IntersectionObserver' in window) {
    const seen = new WeakSet();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const node = en.target;
        io.unobserve(node);
        node.classList.add('is-in');
        // Setelah selesai, lepas kelas supaya efek hover bawaan kartu kembali normal
        setTimeout(() => {
          node.classList.remove('fx-reveal', 'is-in');
          node.style.removeProperty('--d');
        }, 1100 + (node._fxDelay || 0));
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    const prepare = (nodes) => {
      nodes.filter(Boolean).forEach((node, i) => {
        if (seen.has(node)) return;
        seen.add(node);
        const step = Math.min(i, 6);
        node._fxDelay = step * 75;
        node.style.setProperty('--d', step);
        node.classList.add('fx-reveal');
        io.observe(node);
      });
    };

    prepare($$('#aboutText p'));
    prepare([$('.about__aside')]);
    prepare($$('#timeline > li'));
    prepare($$('#skills > .frame'));
    prepare($$('#projects > .project'));
    prepare($$('#contactList > *'));
    prepare([$('#kontak .lead')]);
    const gallery = $('#gallery');
    if (gallery) {
      prepare($$('.plaque', gallery));
      new MutationObserver(() => prepare($$('.plaque', gallery))).observe(gallery, { childList: true });
    }
    const chapterIo = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        chapterIo.unobserve(en.target);
      });
    }, { threshold: 0.4 });
    $$('.chapter').forEach((c) => { c.classList.add('fx-chapter'); chapterIo.observe(c); });
  }
  if (finePointer) {
    const TILT = '.project, .plaque, .timeline li, .skills .frame';
    const MAX = 7;
    document.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse') return;
      const card = e.target.closest && e.target.closest(TILT);
      if (!card) return;
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      card.style.transform =
        `perspective(900px) rotateX(${((0.5 - py) * MAX).toFixed(2)}deg) rotateY(${((px - 0.5) * MAX).toFixed(2)}deg) translateY(-6px)`;
      card.style.setProperty('--mx', `${(px * 100).toFixed(1)}%`);
      card.style.setProperty('--my', `${(py * 100).toFixed(1)}%`);
      card.classList.add('is-tilting');
    }, { passive: true });

    document.addEventListener('pointerout', (e) => {
      const card = e.target.closest && e.target.closest(TILT);
      if (!card || card.contains(e.relatedTarget)) return;
      card.style.transform = '';
      card.classList.remove('is-tilting');
    });
    $$('.hero__actions .btn').forEach((b) => {
      b.addEventListener('pointermove', (e) => {
        if (e.pointerType !== 'mouse') return;
        const r = b.getBoundingClientRect();
        const x = (e.clientX - (r.left + r.width / 2)) * 0.25;
        const y = (e.clientY - (r.top + r.height / 2)) * 0.35;
        b.style.translate = `${x.toFixed(1)}px ${y.toFixed(1)}px`;
      });
      b.addEventListener('pointerleave', () => { b.style.translate = ''; });
    });
  }
  document.addEventListener('click', (e) => {
    const btn = e.target.closest && e.target.closest('.btn');
    if (!btn || btn.disabled || btn.hasAttribute('disabled')) return;
    const r = btn.getBoundingClientRect();
    const size = Math.max(r.width, r.height) * 2;
    const cx = e.detail === 0 ? r.width / 2 : e.clientX - r.left;
    const cy = e.detail === 0 ? r.height / 2 : e.clientY - r.top;
    const ripple = document.createElement('span');
    ripple.className = 'fx-ripple';
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${cx - size / 2}px;top:${cy - size / 2}px`;
    btn.append(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
})();