ymaps.ready(init);
var ymap,
    placemark;

function init(){
    /*Инициализация карты*/
        ymap = new ymaps.Map("map", {
        //center: [55.76, 37.64],
        center: [43.23,  76.89],
        zoom: 15
    },{
        balloonMaxWidth: 400,
        balloonMaxHeight : 600,
       // searchControlProvider: 'yandex#search'
    });
    var customItemContentLayout = ymaps.templateLayoutFactory.createClass(
        // Флаг "raw" означает, что данные вставляют "как есть" без экранирования html.
        '<h5 class=ballon_header>{{ properties.balloonContentHeader|raw }}</h5>' +
        '<div class=ballon_body>{{ properties.balloonContentBody|raw }}</div>' +
        '<div class=ballon_footer>{{ properties.balloonContentFooter|raw }}</div>'
    );

    var clusterer = new ymaps.Clusterer({
        clusterDisableClickZoom: true,
        clusterOpenBalloonOnClick: true,
        // Устанавливаем стандартный макет балуна кластера "Карусель".
        clusterBalloonContentLayout: 'cluster#balloonCarousel',
        // Устанавливаем собственный макет.
        clusterBalloonItemContentLayout: customItemContentLayout,
        // Устанавливаем режим открытия балуна.
        // В данном примере балун никогда не будет открываться в режиме панели.
        clusterBalloonPanelMaxMapArea: 0,
        // Устанавливаем размеры макета контента балуна (в пикселях).
        clusterBalloonContentLayoutWidth: 300,
        clusterBalloonContentLayoutHeight: 130,
        clusterBalloonPagerSize: 5

    });
    LoadPlacemrksFromServer(clusterer);
    ymap.events.add('click', function (e) {
        e.stopPropagation();
        var coords = e.get('coords');
        console.log( coords[0].toPrecision(6),  coords[1].toPrecision(6));

        getAdressByCoords(coords[0].toPrecision(6),  coords[1].toPrecision(6))
            .then(function (res) {
                var adress = '';
                res.geoObjects.each(function (item) {
                    adress = item.properties.get('text');
                });
                console.log(adress);
                var data = {};
                ymap.balloon.open(coords, {
                    contentHeader:  `<div class = "balloonHeader" >${   adress} </div>`,
                    contentBody: renderView("review", { list: data, x:coords[0].toPrecision(6), y : coords[1].toPrecision(6)}),
                    contentFooter:''
                });

                //Сохраняем метку в базу
                SendXHR(coords[0].toPrecision(6),coords[1].toPrecision(6), adress);
                //создаем метку на карте
                var placemark = addPlacemark(clusterer, coords[0].toPrecision(6),coords[1].toPrecision(6),  '',  adress);

             });
    });
   ymap.geoObjects.events.add('click', function (e) {
        console.log('кликнули на метку 22');
        var thisPlacemark = e.get('target');
        coords = thisPlacemark.geometry.getCoordinates();
        var reviews = LoadReviewsFromServer(coords[0],  coords[1])
           .then(function (reviews) {
                console.log(reviews);
                var balloonContent =  renderView("review", { list: reviews, x:coords[0], y : coords[1]});
                    // .then(function (balloonContent) {
                        
                         thisPlacemark.properties.set('balloonContentHeader', thisPlacemark.properties.get('hintContent'));
                         thisPlacemark.properties.set('balloonContentBody', balloonContent);


                    // })


            });

    });

    ymap.events.add('contextmenu', function (e) {
        ymap.hint.open(e.get('coords'), 'Кто-то щелкнул правой кнопкой');
    });

    ymap.events.add('balloonopen', function (e) {
        ymap.hint.close();
    });

}
function addPlacemark(clusterer, x, y, iconCont, hintCont) {

    var placemark = new ymaps.Placemark([x, y], {
        iconContent: iconCont,
        hintContent: hintCont,

    });
    clusterer.add(placemark);
    ymap.geoObjects.add(clusterer);

    return placemark;

}
function getAdressByCoords(x,y) {

    return ymaps.geocode([x,y], {
        /**
         * Опции запроса
         * @see https://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/geocode.xml
         */
        // Ищем только станции метро.
        kind: 'house',
        // Запрашиваем не более 20 результатов.
        results: 1
    });

}
function SendXHR(x,y, adress) {
    var xhr = new XMLHttpRequest();
    var data = {};

    data.x = x;
    data.y = y;
    data.adress = adress;

    xhr.open('POST', '/save/');
    xhr.send(JSON.stringify(data));

    console.log(data);
}
/*загружаем все метки из БД*/
function LoadPlacemrksFromServer(clusterer) {


    function loadList() {
        return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();

            xhr.open('POST', '/list/');
            xhr.responseType = 'json';
            xhr.send();
            xhr.addEventListener('load', function() {
                resolve(xhr.response);
            });
            xhr.addEventListener('error', function() {
                reject();
            });
        });
    };
    loadList()
        .then(function(placemarks) {
            placemarks.forEach(function(item) {
               // var placemarkList = renderView("review", { data: placemarks, x: item.x, y :item.y });
                var placemark = addPlacemark(clusterer, item.x, item.y,  '',  item.adress);
                var balloonContentHeader = `<div style="font-size: 15px"><a href="/" id=reviewId data-x = ${item.x} data-y = ${item.y} >${item.adress}</a> </div>`;
              
                    placemark.properties.set('balloonContentHeader', balloonContentHeader); 
                    placemark.properties.set('balloonContent', ''); 
              

            });

        });
}

/*загружаем отзывы по данной метке*/
function LoadReviewsFromServer(x, y) {

    return new Promise(function(resolve, reject) {
        var xhr = new XMLHttpRequest();
        console.log(JSON.stringify( {x : x, y : y} ) );
        xhr.open('POST', '/reviewList/');
        xhr.responseType = 'json';
        xhr.send(JSON.stringify( {x : x, y : y} ) );
        xhr.addEventListener('load', function() {
            resolve(xhr.response);
        });
        xhr.addEventListener('error', function() {
            reject();
        });
    });

}

/*Рендерим сождержимое балуна*/
 function renderView(templateName, data) {
    // return new Promise(function (resolve, reject) {
         templateName = templateName + 'Template';
         console.log(data);

         var templateElement = document.getElementById(templateName),
             templateSource = templateElement.innerHTML,
             renderFn = Handlebars.compile(templateSource);
         return (renderFn(data));
    // })

 }

 /*Добавляем отзыв*/
 var btnSaveReview  =  document.getElementById('btnSaveReview');
 document.addEventListener('click', function(e) {
    e.preventDefault();
    if(e.target.id != 'btnSaveReview') return; 
    console.log('Сохраняем отзыв');

    var xhr = new XMLHttpRequest();
    var data = {};


    data.x = document.getElementById('x').value;
    data.y = document.getElementById('y').value;
    data.userName = document.getElementById('userName').value;
    data.placeName = document.getElementById('placeName').value;
    data.text = document.getElementById('reviewText').value;
    data.date = getFormatData(new Date());

     if(!data.userName || !data.placeName || !data.text){
         alert('Заполните, пожалуйста, все поля');
         return;
     }
   
    xhr.open('POST', '/saveReview/');
    xhr.send(JSON.stringify(data));
    xhr.addEventListener('load', function() {
        alert('Отзыв сохранен!');
    });

    console.log(data);
 });



document.addEventListener('click', function(e) {
    e.preventDefault();
    var target = e.target;
    if(target.id != 'reviewId') return;

    var reviews = LoadReviewsFromServer(target.dataset.x, target.dataset.y)
        .then(function (reviews) {
            console.log(reviews);
            console.log('открываем окно отзывов', target.value, target.innerText, target.innerHTML);
            var balloonContent =  renderView("review", { list: reviews, x:target.dataset.x, y : target.dataset.y});
            var contentHeader  = `<div class = "balloonHeader" >${ target.innerText} </div>`;
            ymap.balloon.open([target.dataset.x, target.dataset.y], {contentBody :balloonContent, contentHeader : contentHeader});

        });

});

function getFormatData(dt) {

    var day = dt.getDate() < 10 ? "0" + dt.getDate() : dt.getDate();
    var month = (dt.getMonth()+1) < 10 ? "0" + (dt.getMonth()+1) : dt.getMonth();

    return  `${day}.${month}.${dt.getFullYear()}`;
}




