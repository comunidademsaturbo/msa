(() => {
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  $('#year').textContent = new Date().getFullYear();
  const links = window.MSA_LINKS || {};
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
        if (typeof window.fbq === 'function') window.fbq('trackCustom', 'CheckoutClick', {
          plan: link.dataset.checkout === 'oneYear' ? '1_ano' : '2_anos',
          value: link.dataset.checkout === 'oneYear' ? 497 : 597,
          currency: 'BRL'
        });
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
  const toggle = $('.module-toggle');
  const moduleWrap = $('#module-carousel');
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(expanded));
    moduleWrap.classList.toggle('is-open', expanded);
    toggle.textContent = expanded ? 'Recolher os módulos ↑' : 'Conhecer os módulos disponíveis ↓';
  });
  const video = $('#main-video');
  const audioButton = $('.audio-start');
  audioButton.addEventListener('click', async () => {
    video.muted = false;
    video.volume = 1;
    try {
      await video.play();
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
