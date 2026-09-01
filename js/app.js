document.addEventListener('DOMContentLoaded', () => {

  /* ============ AÑO FOOTER ============ */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ============ HEADER SCROLL STATE ============ */
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    if (window.scrollY > 30) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ============ MOBILE NAV ============ */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  navToggle.addEventListener('click', () => {
    mainNav.classList.toggle('open');
    navToggle.classList.toggle('active');
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
  });
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.classList.remove('active');
    });
  });

  /* ============ SCROLL REVEAL ============ */
  const revealEls = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ============ ACORDEÓN DE PROYECTOS ============ */
  const accItems = document.querySelectorAll('.acc-item');
  const isTouch = window.matchMedia('(hover: none)').matches;

  accItems.forEach(item => {
    const url = item.dataset.url;

    item.addEventListener('click', () => {
      if (isTouch && !item.classList.contains('acc-active')) {
        // primer toque en móvil: solo expandir, no navegar aún
        accItems.forEach(i => i.classList.remove('acc-active'));
        item.classList.add('acc-active');
        return;
      }
      if (url) window.open(url, '_blank');
    });
  });

     /* ============ ERP LIGHTBOX ============ */
  const erpShots = document.querySelectorAll('.erp-shot img');
  const erpLightbox = document.getElementById('erpLightbox');
  const erpLightboxImg = document.getElementById('erpLightboxImg');
  if (erpLightbox && erpLightboxImg) {
    erpShots.forEach(img => {
      img.addEventListener('click', () => {
        erpLightboxImg.src = img.src;
        erpLightboxImg.alt = img.alt;
        erpLightbox.classList.add('open');
        history.pushState({ erpLightbox: true }, '');
      });
    });
    erpLightbox.addEventListener('click', () => {
      if (erpLightbox.classList.contains('open')) history.back();
    });
    window.addEventListener('popstate', () => {
      erpLightbox.classList.remove('open');
    });
  }

    /* ============ BOTON VOLVER ARRIBA ============ */
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 600) scrollTopBtn.classList.add('visible');
      else scrollTopBtn.classList.remove('visible');
    }, { passive: true });
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ============ MODAL POLITICA DE DATOS ============ */
  const privacyLink = document.getElementById('privacyLink');
  const privacyModal = document.getElementById('privacyModal');
  const privacyModalClose = document.getElementById('privacyModalClose');
  if (privacyLink && privacyModal) {
    privacyLink.addEventListener('click', (e) => {
      e.preventDefault();
      privacyModal.classList.add('open');
      history.pushState({ privacyModal: true }, '');
    });
    const closePrivacy = () => { if (privacyModal.classList.contains('open')) history.back(); };
    privacyModalClose.addEventListener('click', closePrivacy);
    privacyModal.addEventListener('click', (e) => { if (e.target === privacyModal) closePrivacy(); });
    window.addEventListener('popstate', () => {
      privacyModal.classList.remove('open');
    });
  }

  /* ============ FORMULARIO -> WHATSAPP ============ */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('cf-name').value.trim();
      const service = document.getElementById('cf-service').value;
      const message = document.getElementById('cf-message').value.trim();

      const text = `Hola CAAP NEXUS, soy ${name}.%0AMe interesa: ${service}.%0A%0A${message}`;
      const phone = '573224178831';
      window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
    });
  }
  /* ============ FUNCION REUTILIZABLE: RED DE NODOS ============ */
  function initNetworkCanvas(canvas) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height, nodes;
    const container = canvas.parentElement;

    const COLORS = { blue: '30,95,255', cyan: '62,209,255' };

    function resize() {
      width = canvas.width = container.offsetWidth * devicePixelRatio;
      height = canvas.height = container.offsetHeight * devicePixelRatio;
      canvas.style.width = container.offsetWidth + 'px';
      canvas.style.height = container.offsetHeight + 'px';
      const count = Math.min(70, Math.floor((container.offsetWidth * container.offsetHeight) / 18000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35 * devicePixelRatio,
        vy: (Math.random() - 0.5) * 0.35 * devicePixelRatio,
        r: (Math.random() * 1.6 + 0.8) * devicePixelRatio
      }));
    }

    const mouse = { x: null, y: null };
    container.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left) * devicePixelRatio;
      mouse.y = (e.clientY - rect.top) * devicePixelRatio;
    });
    container.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

    const maxDist = 150 * devicePixelRatio;
    const maxDistSq = maxDist * maxDist;
    let packets = [];

    function currentEdges() {
      const edges = [];
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < maxDistSq) edges.push([i, j]);
        }
      }
      return edges;
    }

    function maybeSpawnPacket(edges) {
      if (!edges.length) return;
      if (packets.length >= 14) return;
      if (Math.random() > 0.09) return;
      const [i, j] = edges[Math.floor(Math.random() * edges.length)];
      const reversed = Math.random() > 0.5;
      packets.push({ a: reversed ? j : i, b: reversed ? i : j, t: 0, speed: 0.007 + Math.random() * 0.01 });
    }

    function drawPackets() {
      for (const p of packets) {
        const a = nodes[p.a], b = nodes[p.b];
        if (!a || !b) continue;
        const x = a.x + (b.x - a.x) * p.t;
        const y = a.y + (b.y - a.y) * p.t;
        const fade = Math.sin(p.t * Math.PI);
        ctx.save();
        ctx.shadowBlur = 16 * devicePixelRatio;
        ctx.shadowColor = `rgba(${COLORS.cyan}, ${fade})`;
        ctx.beginPath();
        ctx.arc(x, y, 2.8 * devicePixelRatio, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${fade})`;
        ctx.fill();
        ctx.restore();
      }
      packets = packets.filter(p => p.t < 1);
      for (const p of packets) p.t += p.speed;
    }

    function tick() {
      ctx.clearRect(0, 0, width, height);
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
      }
      const edges = currentEdges();
      for (const [i, j] of edges) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const distSq = dx * dx + dy * dy;
        const opacity = 1 - distSq / maxDistSq;
        ctx.strokeStyle = `rgba(${COLORS.cyan}, ${opacity * 0.35})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
      if (mouse.x !== null) {
        for (const n of nodes) {
          const dx = n.x - mouse.x, dy = n.y - mouse.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < maxDistSq * 2.2) {
            const opacity = 1 - distSq / (maxDistSq * 2.2);
            ctx.strokeStyle = `rgba(${COLORS.blue}, ${opacity * 0.6})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${COLORS.cyan}, 0.85)`;
        ctx.fill();
      }
            maybeSpawnPacket(edges);
      drawPackets();
    }

    resize();
    window.addEventListener('resize', resize);

    let rafId = null, running = false;
    function loop(){ tick(); rafId = requestAnimationFrame(loop); }
    function start(){ if (!running) { running = true; loop(); } }
    function stop(){ running = false; if (rafId) cancelAnimationFrame(rafId); }

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => { entry.isIntersecting ? start() : stop(); });
    }, { threshold: 0 });
    io.observe(container);
  }

  /* ============ FUNCION NUEVA: TUNEL DE LINEAS CONVERGENTES ============ */
  function initTunnelCanvas(canvas) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height, cx, cy, spokes, dots, maxR;
    const container = canvas.parentElement;
    const COLOR = '62,209,255';

    function resize() {
      width = canvas.width = container.offsetWidth * devicePixelRatio;
      height = canvas.height = container.offsetHeight * devicePixelRatio;
      canvas.style.width = container.offsetWidth + 'px';
      canvas.style.height = container.offsetHeight + 'px';
      cx = width / 2;
      cy = height / 2;
      maxR = Math.hypot(width, height) / 2;
      const spokeCount = 48;
      spokes = Array.from({ length: spokeCount }, (_, i) => (i / spokeCount) * Math.PI * 2);
      dots = spokes.map(angle => ({
        angle,
        r: Math.random() * maxR,
        speed: (0.55 + Math.random() * 0.85) * devicePixelRatio
      }));
    }

    function tick() {
      ctx.clearRect(0, 0, width, height);

      // lineas radiales tenues (la "rejilla")
      for (const angle of spokes) {
        const x2 = cx + Math.cos(angle) * maxR * 1.5;
        const y2 = cy + Math.sin(angle) * maxR * 1.5;
        ctx.strokeStyle = `rgba(${COLOR}, 0.07)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      // puntos que viajan del centro hacia afuera
      for (const d of dots) {
        d.r += d.speed;
        if (d.r > maxR) d.r = 0;
        const x = cx + Math.cos(d.angle) * d.r;
        const y = cy + Math.sin(d.angle) * d.r;
        const fade = 1 - d.r / maxR;
        ctx.save();
        ctx.shadowBlur = 8 * devicePixelRatio;
        ctx.shadowColor = `rgba(${COLOR}, ${fade})`;
        ctx.beginPath();
        ctx.arc(x, y, 2 * devicePixelRatio, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${fade * 0.9})`;
                ctx.fill();
        ctx.restore();
      }
    }

    resize();
    window.addEventListener('resize', resize);

    let rafId = null, running = false;
    function loop(){ tick(); rafId = requestAnimationFrame(loop); }
    function start(){ if (!running) { running = true; loop(); } }
    function stop(){ running = false; if (rafId) cancelAnimationFrame(rafId); }

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => { entry.isIntersecting ? start() : stop(); });
    }, { threshold: 0 });
    io.observe(container);
  }

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    initTunnelCanvas(document.getElementById('nexusCanvas'));
    initNetworkCanvas(document.getElementById('footerCanvas'));
  }

});

