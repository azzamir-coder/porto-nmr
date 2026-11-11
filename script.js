window.SITE_CONFIG = {
  name: 'Az Zamir Humaid A.M',
  monogram: 'AZ',
  role: 'Mahasiswa IMT-FSD, Universitas Ciputra',
  goal: 'Sapere aude – Beranilah untuk berpikir sendiri/bijaksana.',
  tagline: 'Belajar memasarkan ide, membangun usaha, dan memimpin tim.',
  photo: 'foto.jpg',
  about: [
    'Saya Az Zamir Humaid A.M, mahasiswa program studi IMT-FSD di Universitas Ciputra yang ingin berkarier sebagai Marketing Manager di BUMN.',
    'Saya menjunjung nilai entrepreneurship: berani mencoba, belajar dari hasilnya, dan terus memperbaiki. Karena itu saya juga ingin membangun bisnis sendiri.',
    'Di luar kuliah, saya membuat website sebagai latihan menggabungkan pemasaran dengan teknologi.'
  ],
  pursuits: [
    'Karier sebagai Marketing Manager di BUMN',
    'Bisnis sendiri dengan target omzet yang jelas',
    'Memimpin tim dengan baik',
    'Sertifikasi profesional'
  ],

  roadmap: [
    { phase: 'Sekarang', title: 'Kuliah dan membangun dasar', text: 'Mendalami ilmu pemasaran dan bisnis di Universitas Ciputra sambil membuat proyek nyata.' },
    { phase: 'Berikutnya', title: 'Magang dan sertifikasi', text: 'Mencari pengalaman kerja lewat magang dan menambah sertifikasi profesional di bidang pemasaran.' },
    { phase: 'Tujuan', title: 'Marketing Manager di BUMN', text: 'Memimpin tim pemasaran dan merancang strategi yang berdampak, sambil mengembangkan bisnis sendiri.' }
  ],

  skills: [
    { group: 'Pemasaran', items: ['Strategi pemasaran', 'Pemasaran digital', 'Branding', 'Riset pasar'] },
    { group: 'Bisnis', items: ['Entrepreneurship', 'Kepemimpinan', 'Kerja tim', 'Komunikasi'] },
    { group: 'Teknologi', items: ['HTML', 'CSS', 'JavaScript', 'Desain web'] }
  ],

  projects: [
    { title: 'Nusantara Market', text: 'Website marketplace bertema Nusantara dengan sistem login, dibuat sebagai latihan pemasaran online.', tags: ['HTML', 'CSS', 'JavaScript'], link: '' },
    { title: 'SIAP Kelas', text: 'Website perangkat kelas berisi absensi, jadwal pelajaran, struktur kepengurusan, jadwal piket, dan asisten AI.', tags: ['HTML', 'CSS', 'JavaScript'], link: '' },
    { title: 'Portofolio pribadi', text: 'Website yang sedang Anda lihat ini: profil, arah karier, keahlian, karya, dan pencapaian.', tags: ['HTML', 'CSS', 'JavaScript'], link: '' }
  ],

  categories: ['Lomba', 'Sertifikat', 'Organisasi', 'Akademik', 'Lainnya'],

  contact: { email: 'azzamir334@gmail.com', whatsapp: '62881036059698', instagram: 'zmierr', linkedin: 'https://www.linkedin.com/in/azzamir-humaid-al-muhammad-438b8843a' },

  admin: { password: 'Azzamir1' },   // GANTI sebelum dipakai
  cloud: { url: '' }                          // kosong = data tersimpan di browser ini saja
};

(() => {
  'use strict';

  const C = window.SITE_CONFIG || {};
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  /* ---------------------------------------------------------
     1. ALAT BANTU
     --------------------------------------------------------- */

  // Membuat elemen dengan aman (memakai textContent, bukan innerHTML)
  function el(tag, props = {}, ...children) {
    const node = document.createElement(tag);
    for (const [key, val] of Object.entries(props)) {
      if (val == null || val === false) continue;
      if (key === 'class') node.className = val;
      else if (key === 'text') node.textContent = val;
      else if (key.startsWith('on') && typeof val === 'function') node.addEventListener(key.slice(2), val);
      else node.setAttribute(key, val === true ? '' : val);
    }
    for (const child of children.flat()) {
      if (child == null) continue;
      node.append(child.nodeType ? child : document.createTextNode(child));
    }
    return node;
  }

  const safeUrl = (u) => {
    if (!u) return '';
    try {
      const x = new URL(u, location.href);
      return ['http:', 'https:'].includes(x.protocol) ? x.href : '';
    } catch { return ''; }
  };
  const safeImage = (s) => (typeof s === 'string' && /^data:image\/(jpeg|png|webp|gif);base64,/.test(s) ? s : '');
  const newId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

  function formatDate(ym) {
    const m = /^(\d{4})-(\d{2})$/.exec(ym || '');
    if (!m) return '';
    return new Date(+m[1], +m[2] - 1, 1).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  }

  let toastTimer;
  function toast(message) {
    const t = $('#toast');
    t.textContent = message;
    t.classList.add('is-show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('is-show'), 3800);
  }

  // Memperkecil foto agar ringan disimpan dan dimuat
  function compressImage(file, maxSide = 1100, quality = 0.74) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Foto tidak bisa dibaca. Coba format JPG, PNG, atau WebP.'));
      };
      img.src = url;
    });
  }

  /* ---------------------------------------------------------
     2. ISI SITUS DARI config.js
     --------------------------------------------------------- */
  function renderSite() {
    document.title = `${C.name || 'Portofolio'} — Portofolio`;

    $$('[data-bind]').forEach((node) => {
      const value = C[node.dataset.bind];
      if (value) node.textContent = value;
    });

    // Foto profil (opsional)
    const photo = $('#heroPhoto');
    if (C.photo && safeUrl(C.photo)) {
      photo.src = C.photo;
      photo.alt = `Foto ${C.name || ''}`.trim();
      photo.hidden = false;
      const mono = $('.crest__mono');
      if (mono) mono.hidden = true;
    }

    $('#aboutText').replaceChildren(...(C.about || []).map((t) => el('p', { text: t })));
    $('#pursuits').replaceChildren(...(C.pursuits || []).map((t) => el('li', { text: t })));

    $('#timeline').replaceChildren(...(C.roadmap || []).map((step) =>
      el('li', {},
        el('p', { class: 'timeline__phase', text: step.phase }),
        el('h3', { text: step.title }),
        el('p', { text: step.text })
      )));

    $('#skills').replaceChildren(...(C.skills || []).map((group) =>
      el('div', { class: 'frame' },
        el('h3', { text: group.group }),
        el('ul', { class: 'diamond-list' }, ...(group.items || []).map((i) => el('li', { text: i })))
      )));

    $('#projects').replaceChildren(...(C.projects || []).map((p) => {
      const href = safeUrl(p.link);
      return el('article', { class: 'frame project' },
        el('h3', { text: p.title }),
        el('p', { text: p.text }),
        (p.tags && p.tags.length) ? el('p', { class: 'project__tags', text: p.tags.join(', ') }) : null,
        href ? el('a', { class: 'btn btn--small btn--outline', href, target: '_blank', rel: 'noopener noreferrer', text: 'Kunjungi proyek' }) : null
      );
    }));

    renderContact();
    $('#year').textContent = new Date().getFullYear();
  }

  function renderContact() {
    const c = C.contact || {};
    const list = $('#contactList');
    const links = [];
    if (c.email) links.push({ label: 'Email', value: c.email, href: `mailto:${c.email}` });
    if (c.whatsapp) links.push({ label: 'WhatsApp', value: `+${String(c.whatsapp).replace(/\D/g, '')}`, href: `https://wa.me/${String(c.whatsapp).replace(/\D/g, '')}` });
    if (c.instagram) links.push({ label: 'Instagram', value: `@${String(c.instagram).replace(/^@/, '')}`, href: `https://instagram.com/${String(c.instagram).replace(/^@/, '')}` });
    if (c.linkedin && safeUrl(c.linkedin)) links.push({ label: 'LinkedIn', value: 'Profil profesional', href: safeUrl(c.linkedin) });

    if (!links.length) {
      list.replaceChildren(el('li', { class: 'contact-note', text: 'Informasi kontak segera tersedia.' }));
      return;
    }
    list.replaceChildren(...links.map((l) =>
      el('li', {}, el('a', { href: l.href, target: l.href.startsWith('mailto:') ? null : '_blank', rel: 'noopener noreferrer' },
        el('small', { text: l.label }), l.value))));
  }
  const LS_KEY = 'portofolio.pencapaian.v1';
  const SESSION_KEY = 'portofolio.pengelola';
  const cloudBase = ((C.cloud && C.cloud.url) || '').trim().replace(/\/+$/, '');
  const hasCloud = Boolean(cloudBase);
  const itemUrl = (id) => `${cloudBase}/achievements/${encodeURIComponent(id)}.json`;
  const listUrl = `${cloudBase}/achievements.json`;

  const state = { items: [], filter: 'Semua', admin: false, editingId: null, pendingImage: null };

  const SYNC_TEXT = {
    local: 'Mode lokal: data hanya tersimpan di perangkat ini. Aktifkan cloud di config.js untuk sinkron antar-perangkat.',
    loading: 'Memuat dari cloud...',
    saving: 'Menyimpan ke cloud...',
    cloud: 'Tersinkron dengan cloud. Perubahan terlihat di semua perangkat.',
    offline: 'Cloud tidak terjangkau. Menampilkan salinan di perangkat ini.',
    error: 'Gagal menyimpan ke cloud. Periksa koneksi dan aturan database, lalu coba lagi.'
  };
  function setSync(status) {
    $$('[data-sync]').forEach((n) => { n.textContent = SYNC_TEXT[status]; n.dataset.state = status; });
  }

  function normalize(raw) {
    if (!raw || typeof raw !== 'object') return null;
    const title = String(raw.title || '').trim().slice(0, 120);
    if (!title) return null;
    return {
      id: String(raw.id || newId()),
      title,
      category: String(raw.category || 'Lainnya').slice(0, 40),
      date: /^\d{4}-\d{2}$/.test(raw.date || '') ? raw.date : '',
      issuer: String(raw.issuer || '').slice(0, 120),
      description: String(raw.description || '').slice(0, 600),
      image: safeImage(raw.image),
      link: safeUrl(raw.link),
      createdAt: Number(raw.createdAt) || Date.now()
    };
  }

  function readLocal() {
    try {
      const data = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
      return (Array.isArray(data) ? data : []).map(normalize).filter(Boolean);
    } catch { return []; }
  }
  function writeLocal(items) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(items)); return true; }
    catch { return false; }
  }

  async function loadItems() {
    if (hasCloud) {
      try {
        setSync('loading');
        const res = await fetch(listUrl, { cache: 'no-store' });
        if (!res.ok) throw new Error(String(res.status));
        const data = await res.json();
        state.items = Object.values(data || {}).map(normalize).filter(Boolean);
        writeLocal(state.items);
        setSync('cloud');
        return;
      } catch {
        setSync('offline');
      }
    } else {
      setSync('local');
    }
    state.items = readLocal();
  }

  async function cloudSend(method, id, item) {
    const res = await fetch(itemUrl(id), {
      method,
      headers: item ? { 'Content-Type': 'application/json' } : undefined,
      body: item ? JSON.stringify(item) : undefined
    });
    if (!res.ok) throw new Error(String(res.status));
  }

  // Menyimpan satu pencapaian (tambah atau ubah)
  async function saveItem(item) {
    const idx = state.items.findIndex((i) => i.id === item.id);
    if (idx >= 0) state.items[idx] = item; else state.items.push(item);
    const localOk = writeLocal(state.items);

    if (hasCloud) {
      try {
        setSync('saving');
        await cloudSend('PUT', item.id, item);
        setSync('cloud');
      } catch {
        setSync('error');
        toast('Tersimpan di perangkat ini, tetapi gagal dikirim ke cloud.');
        return false;
      }
    } else if (!localOk) {
      toast('Penyimpanan browser penuh. Hapus beberapa foto atau aktifkan cloud.');
      return false;
    }
    return true;
  }

  async function removeItem(id) {
    state.items = state.items.filter((i) => i.id !== id);
    writeLocal(state.items);
    if (hasCloud) {
      try {
        setSync('saving');
        await cloudSend('DELETE', id);
        setSync('cloud');
      } catch {
        setSync('error');
        toast('Terhapus di perangkat ini, tetapi gagal dihapus dari cloud.');
        return false;
      }
    }
    return true;
  }

  const sortedItems = () => [...state.items].sort((a, b) =>
    (b.date || '').localeCompare(a.date || '') || b.createdAt - a.createdAt);

  /* ---------------------------------------------------------
     4. GALERI PENCAPAIAN
     --------------------------------------------------------- */
  const PLACEHOLDER_SVG = () => {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 64 64');
    svg.setAttribute('width', '48'); svg.setAttribute('height', '48');
    svg.setAttribute('fill', 'none'); svg.setAttribute('stroke', 'currentColor'); svg.setAttribute('stroke-width', '1.6');
    svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML = '<path d="M32 8l6 14 15 1-11 10 4 15-14-8-14 8 4-15L11 23l15-1z"/>';
    return svg;
  };

  function plaque(item) {
    const meta = [item.issuer, formatDate(item.date)].filter(Boolean).join(', ');
    return el('button', { class: 'plaque', type: 'button', 'aria-label': `Lihat detail: ${item.title}`, onclick: () => openDetail(item) },
      el('div', { class: 'plaque__img' },
        item.image ? el('img', { src: item.image, alt: '', loading: 'lazy' }) : PLACEHOLDER_SVG()),
      el('div', { class: 'plaque__body' },
        el('p', { class: 'plaque__cat', text: item.category }),
        el('h3', { class: 'plaque__title', text: item.title }),
        meta ? el('p', { class: 'plaque__meta', text: meta }) : null));
  }

  function renderGallery() {
    const grid = $('#gallery');
    const filters = $('#filters');
    const empty = $('#galleryEmpty');
    const items = sortedItems();

    grid.replaceChildren();
    filters.replaceChildren();
    empty.hidden = items.length > 0;
    filters.hidden = items.length === 0;
    $('#emptyAdd').hidden = !state.admin;
    if (!items.length) return;

    const cats = ['Semua', ...new Set(items.map((i) => i.category))];
    if (!cats.includes(state.filter)) state.filter = 'Semua';

    cats.forEach((cat) => {
      const count = cat === 'Semua' ? items.length : items.filter((i) => i.category === cat).length;
      const active = cat === state.filter;
      filters.append(el('button', {
        class: 'chip' + (active ? ' is-active' : ''), type: 'button', 'aria-pressed': String(active),
        text: `${cat} (${count})`,
        onclick: () => { state.filter = cat; renderGallery(); }
      }));
    });

    items.filter((i) => state.filter === 'Semua' || i.category === state.filter)
      .forEach((i) => grid.append(plaque(i)));
  }

  function openDetail(item) {
    const media = $('#detailMedia');
    media.replaceChildren(item.image ? el('img', { src: item.image, alt: `Foto pencapaian: ${item.title}` }) : PLACEHOLDER_SVG());
    $('#detailMeta').textContent = [item.category, item.issuer, formatDate(item.date)].filter(Boolean).join(', ');
    $('#detailTitle').textContent = item.title;
    $('#detailDesc').textContent = item.description || '';
    const link = $('#detailLink');
    if (item.link) { link.href = item.link; link.hidden = false; } else { link.hidden = true; }
    $('#detailDialog').showModal();
  }

  /* ---------------------------------------------------------
     5. PANEL PENGELOLA
     --------------------------------------------------------- */
  const adminDialog = () => $('#adminDialog');

  function updateAdminUI() {
    $('#ownerBar').hidden = !state.admin;
    $('#emptyAdd').hidden = !state.admin;
  }

  function showAdminView() {
    $('#adminLogin').hidden = state.admin;
    $('#adminManage').hidden = !state.admin;
    if (state.admin) { resetForm(); renderAdminList(); }
  }

  async function openAdmin() {
    state.admin = sessionStorage.getItem(SESSION_KEY) === '1';
    showAdminView();
    if (!adminDialog().open) adminDialog().showModal();
    if (state.admin && hasCloud) { await loadItems(); renderGallery(); renderAdminList(); }
    const first = state.admin ? $('#achForm [name="title"]') : $('#loginForm [name="password"]');
    if (first) first.focus();
  }

  function login(e) {
    e.preventDefault();
    const pass = new FormData(e.currentTarget).get('password');
    const expected = (C.admin && C.admin.password) || '';
    if (expected && pass === expected) {
      sessionStorage.setItem(SESSION_KEY, '1');
      state.admin = true;
      $('#loginError').hidden = true;
      e.currentTarget.reset();
      updateAdminUI();
      renderGallery();
      showAdminView();
      if (expected === 'GantiPasswordIni') toast('Password masih bawaan. Ganti di config.js agar lebih aman.');
    } else {
      $('#loginError').hidden = false;
    }
  }

  function logout() {
    sessionStorage.removeItem(SESSION_KEY);
    state.admin = false;
    updateAdminUI();
    renderGallery();
    if (adminDialog().open) adminDialog().close();
    toast('Anda sudah keluar dari mode pengelola.');
  }

  function fillCategories() {
    const select = $('#categorySelect');
    const cats = (C.categories && C.categories.length) ? C.categories : ['Lainnya'];
    select.replaceChildren(...cats.map((c) => el('option', { value: c, text: c })));
  }

  function resetForm() {
    const form = $('#achForm');
    form.reset();
    state.editingId = null;
    state.pendingImage = null;
    const now = new Date();
    form.elements.date.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    $('#preview').hidden = true;
    $('#removeImageWrap').hidden = true;
    $('#saveBtn').textContent = 'Tambahkan pencapaian';
    $('#cancelEdit').hidden = true;
  }

  function editItem(item) {
    const form = $('#achForm');
    resetForm();
    state.editingId = item.id;
    form.elements.title.value = item.title;
    // Pastikan kategori lama tetap tersedia walau sudah dihapus dari config
    const select = form.elements.category;
    if (![...select.options].some((o) => o.value === item.category)) select.append(el('option', { value: item.category, text: item.category }));
    select.value = item.category;
    form.elements.date.value = item.date;
    form.elements.issuer.value = item.issuer;
    form.elements.description.value = item.description;
    form.elements.link.value = item.link;
    if (item.image) {
      $('#previewImg').src = item.image;
      $('#preview').hidden = false;
      $('#removeImageWrap').hidden = false;
      $('#removeImage').checked = false;
    }
    $('#saveBtn').textContent = 'Simpan perubahan';
    $('#cancelEdit').hidden = false;
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    form.elements.title.focus();
  }

  async function onImageChosen(e) {
    const file = e.target.files[0];
    if (!file) { state.pendingImage = null; return; }
    try {
      state.pendingImage = await compressImage(file);
      $('#previewImg').src = state.pendingImage;
      $('#preview').hidden = false;
      $('#removeImageWrap').hidden = true;
    } catch (err) {
      state.pendingImage = null;
      e.target.value = '';
      toast(err.message);
    }
  }
  async function submitForm(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const title = String(fd.get('title') || '').trim();
    if (!title) { toast('Isi judul pencapaian terlebih dulu.'); return; }
    const existing = state.items.find((i) => i.id === state.editingId);
    let image = existing ? existing.image : '';
    if (state.pendingImage) image = state.pendingImage;
    else if (existing && $('#removeImage').checked) image = '';
    const item = normalize({
      id: existing ? existing.id : newId(),
      title,
      category: fd.get('category'),
      date: fd.get('date'),
      issuer: fd.get('issuer'),
      description: fd.get('description'),
      link: fd.get('link'),
      image,
      createdAt: existing ? existing.createdAt : Date.now()
    });

    const btn = $('#saveBtn');
    btn.disabled = true;
    const wasEditing = Boolean(existing);
    const ok = await saveItem(item);
    btn.disabled = false;

    renderGallery();
    renderAdminList();
    resetForm();
    if (ok) toast(wasEditing ? 'Perubahan tersimpan.' : 'Pencapaian ditambahkan.');
  }
  function renderAdminList() {
    const list = $('#adminList');
    const items = sortedItems();
    $('#adminCount').textContent = `(${items.length})`;
    if (!items.length) {
      list.replaceChildren(el('li', { class: 'muted', text: 'Belum ada pencapaian. Tambahkan yang pertama lewat formulir di atas.' }));
      return;
    }
    list.replaceChildren(...items.map((item) =>
      el('li', {},
        el('div', { class: 'admin-list__thumb' }, item.image ? el('img', { src: item.image, alt: '' }) : null),
        el('div', { class: 'admin-list__info' },
          el('strong', { text: item.title }),
          el('small', { text: [item.category, formatDate(item.date)].filter(Boolean).join(', ') })),
        el('div', { class: 'admin-list__actions' },
          el('button', { class: 'btn btn--small btn--outline', type: 'button', text: 'Ubah', onclick: () => editItem(item) }),
          el('button', {
            class: 'btn btn--small btn--outline', type: 'button', text: 'Hapus',
            onclick: async () => {
              if (!confirm(`Hapus "${item.title}"? Tindakan ini tidak bisa dibatalkan.`)) return;
              const ok = await removeItem(item.id);
              renderGallery(); renderAdminList();
              if (ok) toast('Pencapaian dihapus.');
            }
          })))));
  }
  function exportBackup() {
    const blob = new Blob([JSON.stringify(sortedItems(), null, 2)], { type: 'application/json' });
    const a = el('a', { href: URL.createObjectURL(blob), download: `pencapaian-${new Date().toISOString().slice(0, 10)}.json` });
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    toast('Cadangan diunduh.');
  }
  async function importBackup(file) {
    try {
      const raw = JSON.parse(await file.text());
      const incoming = (Array.isArray(raw) ? raw : Object.values(raw || {})).map(normalize).filter(Boolean);
      if (!incoming.length) { toast('Berkas tidak berisi pencapaian yang valid.'); return; }
      let failed = 0;
      for (const item of incoming) {
        if (!(await saveItem(item))) failed++;
        if (failed > 0 && hasCloud) break;   // hentikan jika cloud bermasalah
      }
      renderGallery(); renderAdminList();
      toast(failed ? 'Sebagian data belum terkirim ke cloud.' : `${incoming.length} pencapaian berhasil diimpor.`);
    } catch {
      toast('Berkas cadangan tidak bisa dibaca. Pastikan itu berkas .json hasil ekspor.');
    }
  }
  function bindNav() {
    const nav = $('#nav');
    const toggle = $('#navToggle');
    const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
    });
    $$('#menu a').forEach((a) => a.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Buka menu');
    }));
    if ('IntersectionObserver' in window) {
      const links = new Map($$('#menu a').map((a) => [a.getAttribute('href').slice(1), a]));
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((a) => a.removeAttribute('aria-current'));
          const link = links.get(entry.target.id);
          if (link) link.setAttribute('aria-current', 'true');
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      links.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
    }
  }
  function bindDialogs() {
    $$('dialog').forEach((dlg) => {
      $$('[data-close]', dlg).forEach((b) => b.addEventListener('click', () => dlg.close()));
      dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
    });
  }
  function bindAdmin() {
    $('#openAdmin').addEventListener('click', openAdmin);
    $('#ownerAdd').addEventListener('click', openAdmin);
    $('#emptyAdd').addEventListener('click', openAdmin);
    $('#ownerLogout').addEventListener('click', logout);
    $('#adminLogout').addEventListener('click', logout);
    $('#loginForm').addEventListener('submit', login);
    $('#achForm').addEventListener('submit', submitForm);
    $('#imageInput').addEventListener('change', onImageChosen);
    $('#cancelEdit').addEventListener('click', resetForm);
    $('#exportBtn').addEventListener('click', exportBackup);
    $('#importBtn').addEventListener('click', () => $('#importInput').click());
    $('#importInput').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) importBackup(file);
      e.target.value = '';
    });
    $('#syncBtn').addEventListener('click', async () => {
      if (!hasCloud) { toast('Cloud belum diaktifkan. Lihat petunjuk di config.js.'); return; }
      await loadItems(); renderGallery(); renderAdminList();
      toast('Data dimuat ulang dari cloud.');
    });
  }
  async function init() {
    renderSite();
    fillCategories();
    bindNav();
    bindDialogs();
    bindAdmin();
    state.admin = sessionStorage.getItem(SESSION_KEY) === '1';
    setSync(hasCloud ? 'loading' : 'local');
    state.items = readLocal();
    renderGallery();
    updateAdminUI();

    await loadItems();
    renderGallery();

    if (location.hash === '#admin') openAdmin();
  }

  init();
})();