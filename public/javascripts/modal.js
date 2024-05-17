
document.addEventListener('DOMContentLoaded', function () {
  const images = document.querySelectorAll('#gallery_container');
  const modal = document.querySelector('.modal-container');
  const modalImg = document.querySelector('.modal-content');
  const closeModalBtn = document.querySelector('.close-modal');

  document.addEventListener('click', function ({target}) {
    if (target === modal || target === closeModalBtn) {
        modal.style.display = 'none';
    } else if (target.tagName === 'IMG' && ! target.closest('.modal-container')) {
        modal.style.display = 'block';
        modalImg.src = target.src;
        modalImg.alt = target.alt;
     }
})

  closeModalBtn.addEventListener('click', function () {
    modal.style.display = 'none';
  });

  window.addEventListener('click', function (event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
});
