ymaps.ready(function () {
  var myMap = new ymaps.Map('map', {
          center: [55.631904484206316,37.76230804482211],
          zoom: 13
      }, {
          searchControlProvider: 'yandex#search'
      }),

      myPlacemark = new ymaps.Placemark([55.631904484206316,37.76230804482211], {
          hintContent: 'Мы находимся здесь'
      }, {
          // Опции.
          // Необходимо указать данный тип макета.
          iconLayout: 'default#image',
          // Своё изображение иконки метки.
          iconImageHref: '/images/map.svg',
          // Размеры метки.
          iconImageSize: [50, 50],
          // Смещение левого верхнего угла иконки относительно
          // её "ножки" (точки привязки).
          iconImageOffset: [-22, -50]
      })

  myMap.geoObjects
      .add(myPlacemark)
});

