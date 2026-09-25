(() => {
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  $('#year').textContent = new Date().getFullYear();
  const links = window.MSA_LINKS || {};
  const firedEvents = new Set();
  function trackOnce(name) {
    if (firedEvents.has(name)) return;
    try {
      if (sessionStorage.getItem(`msaEvent:${name}`)) {
        firedEvents.add(name);
        return;
      }
    } catch (_) {}
    if (typeof window.fbq !== 'function') return;
    window.fbq('trackCustom', name);
    firedEvents.add(name);
    try { sessionStorage.setItem(`msaEvent:${name}`, '1'); } catch (_) {}
  }
  let activeSeconds = 0;
  setInterval(() => {
    if (document.hidden) return;
    activeSeconds++;
    if (activeSeconds >= 30) trackOnce('Time30s');
    if (activeSeconds >= 60) trackOnce('Time60s');
    if (activeSeconds >= 120) trackOnce('Time120s');
  }, 1000);
  let scrollScheduled = false;
  window.addEventListener('scroll', () => {
    if (scrollScheduled) return;
    scrollScheduled = true;
    requestAnimationFrame(() => {
      scrollScheduled = false;
      const scrollable = document.documentElement.scrollHeight - innerHeight;
      if (scrollable <= 0) return;
      const depth = scrollY / scrollable;
      if (depth >= .5) trackOnce('Scroll50');
      if (depth >= .9) trackOnce('Scroll90');
    });
  }, { passive: true });
  const toast = $('#toast');
  let toastTimer;
  function notify(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3800);
  }
  $$('[data-checkout]').forEach(link => {
    const url = links[link.dataset.checkout];
    if (url && /^https:\/\//i.test(url)) {
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.addEventListener('click', () => {
        if (typeof window.fbq !== 'function') return;
        const oneYear = link.dataset.checkout === 'oneYear';
        const plan = oneYear ? '1_ano' : '2_anos';
        const details = {
          content_name: oneYear ? 'MSA Turbo - acesso por 1 ano' : 'MSA Turbo - acesso por 2 anos',
          content_ids: [plan],
          content_type: 'product',
          plan,
          value: oneYear ? 497 : 597,
          currency: 'BRL'
        };
        window.fbq('track', 'InitiateCheckout', details);
        window.fbq('trackCustom', oneYear ? 'CliqueCheckout1Ano' : 'CliqueCheckout2Anos', details);
      });
    } else link.addEventListener('click', event => {
      event.preventDefault();
      notify('Link deste plano ainda não configurado.');
    });
  });
  $$('[data-whatsapp]').forEach(link => {
    if (links.whatsapp && /^https:\/\//i.test(links.whatsapp)) {
      link.href = links.whatsapp;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.addEventListener('click', () => {
        trackOnce('WhatsAppClick');
        if (typeof window.fbq === 'function') window.fbq('track', 'Contact', { content_name: 'WhatsApp MSA Turbo' });
      });
    } else link.addEventListener('click', event => {
      event.preventDefault();
      notify('WhatsApp ainda não configurado.');
    });
  });
  const lightbox = $('#lightbox');
  const lightboxImage = $('img', lightbox);
  const sliceExpanded = $('.slice-expanded', lightbox);
  $$('[data-image],[data-slice-source]').forEach(button => button.addEventListener('click', () => {
    if (button.dataset.sliceSource) {
      lightboxImage.hidden = true;
      sliceExpanded.hidden = false;
      sliceExpanded.style.setProperty('--slice', `url("${button.dataset.sliceSource}")`);
      sliceExpanded.style.setProperty('--slice-position', `${Number(button.dataset.sliceIndex) * 50}%`);
      sliceExpanded.setAttribute('aria-label', button.dataset.alt || 'Depoimento ampliado');
    } else {
      sliceExpanded.hidden = true;
      lightboxImage.hidden = false;
      lightboxImage.src = button.dataset.image;
      lightboxImage.alt = button.dataset.alt || 'Imagem ampliada';
    }
    lightbox.showModal();
  }));
  $('.lightbox-close', lightbox).addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('click', e => { if (e.target === lightbox) lightbox.close(); });
  lightbox.addEventListener('close', () => { lightboxImage.removeAttribute('src'); });
  $$('[data-slide]').forEach(button => button.addEventListener('click', () => {
    const track = document.getElementById(button.dataset.slide);
    const card = track?.firstElementChild;
    if (!card) return;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    track.scrollBy({ left: (card.getBoundingClientRect().width + gap) * Number(button.dataset.direction), behavior: 'smooth' });
  }));
  $$('.drag-scroll').forEach(track => {
    let active = false, moved = false, startX = 0, scrollStart = 0;
    track.addEventListener('pointerdown', event => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return;
      active = true; moved = false;
      startX = event.clientX; scrollStart = track.scrollLeft;
    });
    track.addEventListener('pointermove', event => {
      if (!active) return;
      const distance = event.clientX - startX;
      if (Math.abs(distance) > 7) {
        moved = true; track.classList.add('is-dragging');
        track.scrollLeft = scrollStart - distance;
      }
    });
    const finish = () => {
      if (!active) return;
      active = false; track.classList.remove('is-dragging');
      if (moved) setTimeout(() => { moved = false; }, 100);
    };
    track.addEventListener('pointerup', finish);
    track.addEventListener('pointerleave', finish);
    track.addEventListener('click', event => {
      if (!moved) return;
      event.preventDefault(); event.stopPropagation();
      moved = false;
    }, true);
  });
  // O movimento automático cede o controle a quem arrasta, desliza ou usa as setas.
  ['proof-carousel', 'module-track'].forEach(id => {
    const track = document.getElementById(id);
    if (!track) return;
    const eventName = id === 'proof-carousel' ? 'ResultsCarousel' : 'ModulesCarousel';
    let pointerStart = null;
    track.addEventListener('pointerdown', e => { pointerStart = { x: e.clientX, y: e.clientY }; });
    track.addEventListener('pointermove', e => {
      if (!pointerStart) return;
      if (Math.abs(e.clientX - pointerStart.x) >= 8 &&
          Math.abs(e.clientX - pointerStart.x) > Math.abs(e.clientY - pointerStart.y)) trackOnce(eventName);
    });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(type =>
      track.addEventListener(type, () => { pointerStart = null; }));
    track.addEventListener('wheel', e => {
      if (Math.abs(e.deltaX) > 3 || (e.shiftKey && Math.abs(e.deltaY) > 3)) trackOnce(eventName);
    }, { passive: true });
    track.addEventListener('keydown', e => {
      if (['ArrowLeft', 'ArrowRight'].includes(e.key)) trackOnce(eventName);
    });
    $$(`[data-slide="${id}"]`).forEach(button => button.addEventListener('click', () => trackOnce(eventName)));
    let resumeAt = 0;
    const pause = () => { resumeAt = performance.now() + 5500; };
    ['pointerdown', 'wheel', 'touchstart', 'keydown'].forEach(type =>
      track.addEventListener(type, pause, { passive: type !== 'keydown' })
    );
    $$(`[data-slide="${id}"]`).forEach(button => button.addEventListener('click', pause));
    setInterval(() => {
      if (document.hidden || performance.now() < resumeAt ||
          matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const card = track.firstElementChild;
      if (!card || track.scrollWidth <= track.clientWidth + 4) return;
      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      const step = card.getBoundingClientRect().width + gap;
      if (track.scrollLeft >= track.scrollWidth - track.clientWidth - step / 2) {
        track.scrollTo({ left: 0, behavior: 'instant' });
      } else {
        track.scrollBy({ left: step, behavior: 'smooth' });
      }
    }, 2700);
  });
  const heroVideo = $('#hero-video');
  const heroAudio = $('.hero-audio');
  function watchVideo(video) {
    if (!video) return () => {};
    let engaged = false;
    video.addEventListener('timeupdate', () => {
      if (engaged && Number.isFinite(video.duration) && video.duration > 0 &&
          video.currentTime >= video.duration / 2) trackOnce('Video50');
    });
    video.addEventListener('ended', () => { if (engaged) trackOnce('VideoComplete'); });
    return () => { engaged = true; trackOnce('VideoPlay'); };
  }
  const engageHeroVideo = watchVideo(heroVideo);
  if (heroVideo && heroAudio) {
    heroVideo.play().catch(() => {});
    heroAudio.addEventListener('click', async () => {
      heroVideo.muted = false;
      heroVideo.volume = 1;
      try {
        await heroVideo.play();
        if (heroVideo.currentTime > 0) heroVideo.currentTime = 0;
        engageHeroVideo();
        heroVideo.controls = true;
        heroAudio.hidden = true;
      } catch (_) {
        heroVideo.muted = true;
        heroAudio.querySelector('strong').textContent = 'Toque para reproduzir';
      }
    });
  }
  const video = $('#main-video');
  const engageCommunityVideo = watchVideo(video);
  const audioButton = $('.audio-start');
  audioButton.addEventListener('click', async () => {
    video.muted = false;
    video.volume = 1;
    try {
      await video.play();
      engageCommunityVideo();
      video.controls = true;
      audioButton.hidden = true;
    } catch (_) {
      $('small', audioButton).textContent = 'Toque novamente para reproduzir';
    }
  });
  const popup = $('#exit-popup');
  let shown = false;
  try { shown = sessionStorage.getItem('msaExitPopupShown') === '1'; } catch (_) {}
  function showPopup() {
    if (shown || popup.open || lightbox.open || !video.paused) return;
    shown = true;
    try { sessionStorage.setItem('msaExitPopupShown', '1'); } catch (_) {}
    popup.showModal();
  }
  $$('.popup-close,.popup-later,.popup-cta', popup).forEach(el => el.addEventListener('click', () => popup.close()));
  popup.addEventListener('click', e => { if (e.target === popup) popup.close(); });
  document.addEventListener('mouseout', e => {
    if (matchMedia('(max-width:740px)').matches) return;
    if (!e.relatedTarget && e.clientY <= 0) showPopup();
  });
  window.addEventListener('scroll', () => {
    if (!matchMedia('(max-width:740px)').matches) return;
    const scrollable = document.documentElement.scrollHeight - innerHeight;
    if (scrollable > 0 && scrollY / scrollable >= .45) showPopup();
  }, { passive: true });
})();
