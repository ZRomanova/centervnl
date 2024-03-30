function sendQuestion(message) {
  $.ajax({
    type: "POST",
    dataType: 'json',
    url: '/api/question',
    data: { message },
    success: function (data) {
      if (!data.length) {
        addAnswer(`К сожалению, я не нашёл информации по вашему вопросу.<br>Вы можете попробовать сформулировать вопрос по-другому или напишите нам <a href="https://centervnl.ru/contacts/#form">здесь</a>.`)
      } else if (data.length == 1) {
        addAnswer(`<b>${data[0].question}</b><br>${data[0].answer}`)
      } else {
        addAnswer(`<b>${data[0].question}</b><br>${data[0].answer}`)
        addAnswer(`Также я нашёл другие вопросы, которые могли бы быть интересны вам:`)
        for (let i = 1; i < data.length; i++) {
          addButton(`${data[i].question}`)
        }
      }
    },
  });
}

$('.chatbot__btn').click(function () {
  $('.chatbot').removeClass('d-none')
  $('.chatbot').addClass('d-block')
})

$('.chatbot__close').click(function () {
  $('.chatbot').addClass('d-none')
  $('.chatbot').removeClass('d-block')
})

$('.chatbot__input').on('input', function () {
  if (this.value && this.value.length > 6) {
    $('.chatbot__submit').prop('disabled', false);
  } else {
    $('.chatbot__submit').prop('disabled', true);
  }
})

$('.chatbot__submit').click(function () {
  let message = $('.chatbot__input').val()
  addQuesion(message)
})

function addQuesion(message) {
  let element = `
  <div class="chatbot__item chatbot__item_human">
  <div class="chatbot__content chatbot__content_human-disabled">${message}</div>
  </div>`
  $('.chatbot__items').append(element)
  sendQuestion(message)
  $('.chatbot__input').val('')
}

function addAnswer(message) {
  let element = `
  <div class="chatbot__item chatbot__item_bot">
  <div class="chatbot__content chatbot__content_bot">${message}</div>
  </div>`
  $('.chatbot__items').append(element)
}

function addButton(message) {
  let element = `
  <div class="chatbot__item chatbot__item_bot chatbot__item_bot_button">
  <div class="chatbot__content chatbot__content_bot chatbot__content_bot_button">${message}</div>
  </div>`
  $('.chatbot__items').append(element)
}

$('.chatbot__items').on('click', '.chatbot__item_bot_button', clickButton);

function clickButton() {
  addQuesion(this.innerText)
}

$('.chatbot__reset').click(function () {
  $('.chatbot__items').children().slice(1).remove();
})
