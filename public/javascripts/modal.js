document.addEventListener('DOMContentLoaded', function () {
  const images = document.querySelectorAll('#gallery_container');
  const modal = document.querySelector('.modal-container');
  const modalImg = document.querySelector('.modal-content');
  const closeModalBtn = document.querySelector('.close-modal');

  images.forEach(function (image) {
    image.addEventListener('click', function () {
      modal.style.display = 'block';
      const src = this.getAttribute('.review__image');
      const alt = this.getAttribute('alt');
      modalImg.setAttribute('.review__image', src);
      modalImg.setAttribute('alt', alt);
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
 