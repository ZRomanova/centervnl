
var Cal = function(divId) {

  //Сохраняем идентификатор div
  this.divId = divId;

  // Дни недели с понедельника
  this.DaysOfWeek = [
    'пн',
    'вт',
    'ср',
    'чт',
    'пт',
    'сб',
    'вс'
  ];

  // Месяцы начиная с января
  this.Months =['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

  //Устанавливаем текущий месяц, год
  var d = new Date();

  this.currMonth = d.getMonth('9');
  this.currYear = d.getFullYear('22');
  this.currDay = d.getDate('3');
};

// Переход к следующему месяцу
Cal.prototype.nextMonth = function() {
  if ( this.currMonth == 11 ) {
    this.currMonth = 0;
    this.currYear = this.currYear + 1;
  }
  else {
    this.currMonth = this.currMonth + 1;
  }
  this.showcurr();
};

// Переход к предыдущему месяцу
Cal.prototype.previousMonth = function() {
  if ( this.currMonth == 0 ) {
    this.currMonth = 11;
    this.currYear = this.currYear - 1;
  }
  else {
    this.currMonth = this.currMonth - 1;
  }
  this.showcurr();
};

// Показать текущий месяц
Cal.prototype.showcurr = function() {
  this.showMonth(this.currYear, this.currMonth);
};



// Показать месяц (год, месяц)
Cal.prototype.showMonth = function(y, m) {

  var d = new Date()
  // Первый день недели в выбранном месяце 
  , firstDayOfMonth = new Date(y, m, 7).getDay()
  // Последний день выбранного месяца
  , lastDateOfMonth =  new Date(y, m+1, 0).getDate()
  // Последний день предыдущего месяца
  , lastDayOfLastMonth = m == 0 ? new Date(y-1, 11, 0).getDate() : new Date(y, m, 0).getDate();



  // Запись выбранного месяца и года

  getId('monthYear').innerText = this.Months[m] + ' ' + y

  // заголовок дней недели
  var html = `<div class="calendar-header">`;
  for(var i=0; i < this.DaysOfWeek.length;i++) {
    html += '<div class="calendar-header-item">' + this.DaysOfWeek[i] + '</div>';
  }
  html += '</div>';

  // Записываем дни
  var i=1;
  do {

    var dow = new Date(y, m, i).getDay();

    // Начать новую строку в понедельник
    if ( dow == 1 ) {
      // html += '<tr>';
    }
    
    // Если первый день недели не понедельник показать последние дни предидущего месяца
    else if ( i == 1 ) {
      // html += '<tr>';
      var k = lastDayOfLastMonth - firstDayOfMonth+1;
      for(var j=0; j < firstDayOfMonth; j++) {
        html += '<div class="calendar-item-inactive"><div class="calendar-child">' + k + '</div></div>';
        k++;
      }
    }

    // Записываем текущий день в цикл
    var chk = new Date();
    var chkY = chk.getFullYear();
    var chkM = chk.getMonth();
    if (chkY == this.currYear && chkM == this.currMonth && i == this.currDay) {
      html += `<div id="${chkY}-${chkM+1}-${i}" class="calendar-item calendar-item-today" onclick="getAnouncementsByDay('${chkY}-${chkM+1}-${i}')"><div class="calendar-child" id="${chkY}-${chkM+1}-${i}-child">` + i + '</div></div>';
    } else {
      html += `<div id="${this.currYear}-${this.currMonth+1}-${i}" class="calendar-item" onclick="getAnouncementsByDay('${this.currYear}-${this.currMonth+1}-${i}')"><div class="calendar-child" id="${this.currYear}-${this.currMonth+1}-${i}-child">` + i + '</div></div>';
    }
    // закрыть строку в воскресенье
    if ( dow == 0 ) {
      // html += '</tr>';
    }
    // Если последний день месяца не воскресенье, показать первые дни следующего месяца
    else if ( i == lastDateOfMonth ) {
      var k=1;
      for(dow; dow < 7; dow++) {
        html += '<div class="calendar-item-inactive"><div class="calendar-child">' + k + '</div></div>';
        k++;
      }
    }

    i++;
  }while(i <= lastDateOfMonth);

  // Конец таблицы
  html += '</div>';

  // Записываем HTML в div
  document.getElementById(this.divId).innerHTML = html;

  getAnouncementsByMonth(`${y}-${m+1}-1`)
};

// При загрузке окна
window.onload = function() {

  // Начать календарь
  var c = new Cal("divCal");			
  c.showcurr();

  // Привязываем кнопки «Следующий» и «Предыдущий»
  getId('btnNext').onclick = function() {
    c.nextMonth();
  };
  getId('btnPrev').onclick = function() {
    c.previousMonth();
  };

  let d = new Date();
  let today = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`

  getAnouncementsByDay(today)
}

// Получить элемент по id
function getId(id) {
  return document.getElementById(id);
}

function getAnouncementsByDay(day) {

  $.ajax({ 
    url: `/api/services/day/${day}`,  
    dataType: 'json',
    success: function(results) {
      let data = results.events ? results.events : []

      $('.calendar-item').removeClass("calendar-item-checked")
      $('#'+day).addClass('calendar-item-checked')

      let many = data.length > 2 ? 'col-lg-4' : ''
      let list = `<div class="title-500-32 mb-3">Расписание на ${results.date}</div>`
      if (!data.length)  {
        list += `<div class="title-700-20 mb-1">Мероприятий нет</div>`
      }
      let list_arr = []
      let element = ``
      for (let i = 0; i < data.length; i++) {
        let url = `https://centervnl.ru/services/${data[i].path}`
        element += `<div class="col-12 col-md-6 ${many} mt-3">`
        element += `<div class="program__subtitle">${data[i].name}</div>`
        element += data[i].image ? `<a href="${url}"><img class="event__image mt-3" src="${data[i].image}" alt="img" /></a>` : ''
        element += `<div class="mt-3">${data[i].description}</div>`
        
        data[i].dates.forEach(date => {
          list_arr.push({name: data[i].name, path: url, is_partner: data[i].is_partner, ...date})
          element += `<div class="title-700-20 mt-3">${results.date} ${date.timeStr}</div>`
        })
        
        element += `<a type="button" target="${data[i].is_partner ? '_blank' : '_self'}" class="button button_${data[i].is_partner ? 'blue' : 'orange'} mt-3 mb-3" href="${data[i].is_partner ? data[i].url : url}">Зарегистрироваться</a>`
        element += `</div>`

      }
      list_arr.sort((a, b) => a.num - b.num)
      list_arr.forEach(date => {
        if (date.is_partner) 
          list += `<a href="${date.path}"><div class="text-700-16-blue mb-1">Партнёрское мероприятие</div>`
        else 
          list += `<a href="${date.path}?date=${results.date} ${date.timeStr}">`
        list += `<div class="title-700-20 mb-1">${date.name}</div>`
        list += `<div class="title-700-16 mb-4">${date.timeStr}</div></a>`
      })

      $('#events_gallary')[0].innerHTML = element
      $('#events_list')[0].innerHTML = list
    }
  });
}

function getAnouncementsByMonth(date) {

  $.ajax({ 
    url: `/api/services/month/${date}`,  
    dataType: 'json',
    success: function(data) {
      for (let date of data) {
        $('#'+date+'-child').addClass('calendar-child-active')
      }
    }
  });
}



