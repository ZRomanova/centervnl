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
  $('.donate-box').removeClass('active')
  var elParent = $(element).parent().addClass('active')
  var index = elParent.index()
  $('.donate-content').removeClass('d-block')
  $('.donate-content').addClass('d-none')
  $($('.donate-content')[index]).addClass('d-block')
  $($('.donate-content')[index]).removeClass('d-none')
}

$('#sumText').on("input", function (e) {
  if (this.value > 0) {
    $('.sumCheckButton').prop('checked', false);
  }
  if (this.value == 0) {
    $($('.sumCheckButton')[0]).prop('checked', true);
  }
})

$('.sumCheckButton').click(function (e) {
  $('#sumText').prop('value', "");
})

$('.submit').click(function (e) {
  var formData = new FormData(form);
  if (formData.get('regularity') == "false") {
    singlePay(formData)
  } else {
    recurringPay(formData)
  }
})


function singlePay(formData) {

  const checkout = new cp.Checkout({
    publicId: 'pk_af1616eb150356d4911c1f2a80aaa',
    container: document.getElementById('form')
  });



  checkout.createPaymentCryptogram()
    .then((cryptogram) => {

      let data = {
        "Amount": Number(formData.get('sum')),
        "Currency": "RUB",
        "IpAddress": formData.get('ip'),
        "Description": "Благотворительное пожертвование в АНО РЦ Вера. Надежда. Любовь",
        "AccountId": formData.get('email'),
        "Email": formData.get('email'),
        "Name": formData.get('cardholder'),
        "CardCryptogramPacket": cryptogram,
        "Payer": {
          "FirstName": formData.get('name'),
          "LastName": formData.get('lastname'),
          // "MiddleName":formData.get('email'),
          "Phone": formData.get('tel')
        }
      }
      $.ajax({
        type: "POST",
        dataType: 'json',
        url: '/help/donate/',
        data,
        success: function (data) {
          if (data.next == "3D") {
            const form = `
            <form name="downloadForm" action="${data["AcsUrl"]}" method="POST">
              <input hidden name="PaReq" value="${data["PaReq"]}">
              <input hidden name="MD" value="${data["MD"]}">
              <input hidden name="TermUrl" value="https://centervnl.ru/help/donate/finish/"> 
            </form>
            `
            $(document.body).append($(form));
            document.forms['downloadForm'].submit()

          } else if (data.next == "finish") {
            location.href = "/help/donate/finish/"
          } else {
            $('#error-text')[0].innerText = data["message"]
          }
        }
      })

    }).catch((errors) => {
      let message = ''
      if (errors['cardNumber'] === 'CardNumber_Invalid') message = "Некорректный номер карты"
      else if (errors['expDateMonthYear'] === 'ExpDateMonthYear_Invalid') message = "Некорректная дата"
      else if (errors['ccv'] === 'Cvv_Invalid') message = "Некорректный CVV"
      $('#error-text')[0].innerText = message
    });
}

function recurringPay(formData) {
  const checkout = new cp.Checkout({
    publicId: 'pk_af1616eb150356d4911c1f2a80aaa',
    container: document.getElementById("#form")
  });



  checkout.createPaymentCryptogram()
    .then((cryptogram) => {

      let data = {
        "Amount": Number(formData.get('sum')),
        "Currency": "RUB",
        "IpAddress": formData.get('ip'),
        "Description": "Подписка на ежемесячное пожертвование в АНО РЦ Вера. Надежда. Любовь",
        "AccountId": formData.get('email'),
        "Email": formData.get('email'),
        "Name": formData.get('cardholder'),
        "CardCryptogramPacket": cryptogram,
        "Payer": {
          "FirstName": formData.get('name'),
          "LastName": formData.get('lastname'),
          "Phone": formData.get('tel')
        }
      }
      $.ajax({
        type: "POST",
        dataType: 'json',
        url: '/help/donate/',
        data,
        success: function (data) {
          if (data.next == "3D") {
            const form = `
            <form name="downloadForm" action="${data["AcsUrl"]}" method="POST">
              <input hidden name="PaReq" value="${data["PaReq"]}">
              <input hidden name="MD" value="${data["MD"]}">
              <input hidden name="TermUrl" value="https://centervnl.ru/help/donate/subscribe/"> 
            </form>
            `
            $(document.body).append($(form));
            document.forms['downloadForm'].submit()
          } else if (data.next == "finish") {
            location.href = "/help/donate/subscribe/"
          } else {
            $('#error-text')[0].innerText = data["message"]
          }
        }
      })

    }).catch((errors) => {
      console.log(errors)
    });
}

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