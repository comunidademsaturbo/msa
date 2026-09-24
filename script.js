(() => {
  document.getElementById('year').textContent = new Date().getFullYear();
  const links = window.MSA_LINKS || {};
  const toast = document.getElementById('toast');
  let toastTimer;
  const notify = () => {
    toast.textContent = 'Link de inscrição em atualização. Volte em breve.';
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3500);
  };
  document.querySelectorAll('[data-checkout]').forEach(button => {
    const url = links[button.dataset.checkout];
    if (url && /^https:\/\//i.test(url)) {
      button.href = url;
      button.target = '_blank';
    } else button.addEventListener('click', event => { event.preventDefault(); notify(); });
  });
  document.querySelectorAll('[data-whatsapp]').forEach(button => {
    if (links.whatsapp && /^https:\/\//i.test(links.whatsapp)) {
      button.href = links.whatsapp;
      button.target = '_blank';
      button.rel = 'noopener noreferrer';
    } else button.addEventListener('click', event => { event.preventDefault(); notify(); });
  });
  const modal = document.getElementById('lightbox');
  const modalImage = modal.querySelector('img');
  document.querySelectorAll('[data-image]').forEach(button => button.addEventListener('click', () => {
    modalImage.src = button.dataset.image;
    modalImage.alt = button.dataset.alt || 'Imagem ampliada';
    modal.showModal();
  }));
  modal.querySelector('.lightbox-close').addEventListener('click', () => modal.close());
  modal.addEventListener('click', event => { if (event.target === modal) modal.close(); });
  modal.addEventListener('close', () => { modalImage.src = ''; });
})();
