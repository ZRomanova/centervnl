document.addEventListener('DOMContentLoaded', function () {
  const images = document.querySelectorAll('#gallery_container');
  const modal = document.querySelector('.modal-container');
  const modalImg = document.querySelector('.modal-content');
  const closeModalBtn = document.querySelector('.close-modal');

  images.forEach(function (image) {
    image.addEventListener('click', function () {
      modal.style.display = 'block';
      const src = this.querySelector('img').src;
      const alt = this.querySelector('img').alt;
      modalImg.src = src;
      modalImg.alt = alt;
    });
  });

  closeModalBtn.addEventListener('click', function () {
    modal.style.display = 'none';
  });

  window.addEventListener('click', function (event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
});