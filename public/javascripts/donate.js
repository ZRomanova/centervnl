$('.donate-circle, .donate-text').off('click').on('click', function (e) {
  const box = $(this).closest('.donate-box');
  const key = box.attr('data-vnl-modal');
  if (key) {
    e.preventDefault();
    if (typeof window.openModal === 'function') {
      window.openModal(key);
    } else {
      document.addEventListener('vnlModalReady', () => window.openModal(key), { once: true });
    }
    return;
  }
  clickDonate(this);
});

const clickDonate = function (element) {
  $('.donate-box').removeClass('active');
  var elParent = $(element).parent().addClass('active');
  var index = elParent.index();
  $('.donate-content').removeClass('d-block').addClass('d-none');
  $($('.donate-content')[index]).addClass('d-block').removeClass('d-none');
};

$('#sumText').on('input', function () {
  if (this.value > 0) {
    $('.sumCheckButton').prop('checked', false);
  }
  if (this.value == 0) {
    $($('.sumCheckButton')[0]).prop('checked', true);
  }
});

$('.sumCheckButton').click(function () {
  $('#sumText').prop('value', '');
});

$('.submit').off('click.cp').on('click.cp', function (e) {
  e.preventDefault();

  const formEl = document.getElementById('form');
  if (!formEl) return;

  if (!window.cp || !cp.CloudPayments) {
    $('#error-text').text('Не удалось загрузить платёжный виджет. Обновите страницу и попробуйте ещё раз.');
    return;
  }

  const fd = new FormData(formEl);

  const amountRaw = (fd.get('sum') || '').toString().replace(',', '.');
  const amount = Number(amountRaw);
  if (!amount || amount <= 0) {
    $('#error-text').text('Введите сумму пожертвования');
    return;
  }

  const isRecurring = fd.get('regularity') === 'true';

  const email = (fd.get('email') || '').toString().trim();
  const firstName = (fd.get('name') || '').toString().trim();
  const lastName = (fd.get('lastname') || '').toString().trim();
  const phone = (fd.get('tel') || '').toString().trim();

  if (!email) {
    $('#error-text').text('Укажите email');
    return;
  }

  const PUBLIC_ID = 'pk_af1616eb150356d4911c1f2a80aaa';

  const descriptionOnce = 'Благотворительное пожертвование в АНО РЦ «Вера. Надежда. Любовь»';
  const descriptionSub  = 'Подписка на ежемесячное пожертвование в АНО РЦ «Вера. Надежда. Любовь»';

  const options = {
    publicId: PUBLIC_ID,
    description: isRecurring ? descriptionSub : descriptionOnce,
    amount,
    currency: 'RUB',
    accountId: email, // обязателен для рекуррентов
    email,
    skin: 'modern',
    data: {
      CloudPayments: isRecurring
        ? { recurrent: { interval: 'Month', period: 1, amount } }
        : {}
    }
  };

  const widget = new cp.CloudPayments();

  widget.pay(
    'charge',                  // разовый платеж; для рекуррентов первый список тоже charge
    options,
    {
      onSuccess: function () {
        location.href = isRecurring ? '/help/donate/subscribe/' : '/help/donate/finish/';
      },
      onFail: function () {
        $('#error-text').text('Оплата не прошла. Попробуйте ещё раз или выберите другой способ.');
      },
      onComplete: function (paymentResult /*, opts */) {
        // логи (пока пустые)
      }
    }
  );
});

(() => {
  function initVnlModal() {
    const root = document.getElementById('vnlModal');

    if (!root) {
      window.openModal = function () { console.warn('[vnl-modal] #vnlModal не найден на странице'); };
      document.dispatchEvent(new Event('vnlModalReady'));
      return;
    }

    const contentEl = root.querySelector('.vnl-modal__content');
    const backdrop  = root.querySelector('.vnl-modal__backdrop');
    const closeBtn  = root.querySelector('[data-vnl-close]');
    const templates = {
      sbp:        document.getElementById('vnl-tpl-sbp'),
      sms:        document.getElementById('vnl-tpl-sms'),
      receipt:    document.getElementById('vnl-tpl-receipt'),
      requisites: document.getElementById('vnl-tpl-requisites'),
      bank:       document.getElementById('vnl-tpl-bank'),
      contracts:  document.getElementById('vnl-tpl-contracts'),
    };

    let lastActive = null;

    window.openModal = function (key) {
      const tpl = templates[key];
      if (!tpl) return;
      contentEl.innerHTML = '';
      const node = tpl.content ? tpl.content.cloneNode(true) : tpl.cloneNode(true);
      contentEl.appendChild(node);
      lastActive = document.activeElement;
      root.classList.add('is-open');
      document.body.classList.add('vnl-modal-open');
      root.setAttribute('aria-hidden', 'false');
      if (closeBtn) closeBtn.focus({ preventScroll: true });
    };

    function close() {
      root.classList.remove('is-open');
      document.body.classList.remove('vnl-modal-open');
      root.setAttribute('aria-hidden', 'true');
      contentEl.innerHTML = '';
      if (lastActive && lastActive.focus) lastActive.focus({ preventScroll: true });
    }

    backdrop && backdrop.addEventListener('click', close);
    closeBtn && closeBtn.addEventListener('click', close);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && root.classList.contains('is-open')) close();
    });

    document.dispatchEvent(new Event('vnlModalReady'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVnlModal);
  } else {
    initVnlModal();
  }
})();

$('.donate-grid')
  .off('click.donate')
  .on('click.donate', '.donate-box, .donate-box *', function (e) {
    const $box = $(this).closest('.donate-box');

    $('.donate-box').removeClass('active');
    $box.addClass('active');

    const key = $box.attr('data-vnl-modal');
    if (key) {
      e.preventDefault();
      if (typeof window.openModal === 'function') {
        window.openModal(key);
      } else {
        document.addEventListener('vnlModalReady', () => window.openModal(key), { once: true });
      }
      return;
    }

    const idx = $box.index();
    const $content = $('.donate-content');

    if ($content.length > 1) {
      $content.removeClass('d-block').addClass('d-none');
      $content.eq(idx).addClass('d-block').removeClass('d-none');
    } else {
      $content.addClass('d-block').removeClass('d-none');
    }
  });