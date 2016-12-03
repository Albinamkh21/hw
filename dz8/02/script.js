const NONE_YEAR = 1500;

new Promise(function(resolve) {
  if (document.readyState == 'complete') {
    resolve();
  } else {
    window.onload = resolve;
  }
}).then(function() {
  return new Promise(function(resolve, reject) {
    VK.init({
      apiId: 5755375
    });

    VK.Auth.login(function(response) {
      if (response.session) {
        resolve(response);
      } else {
        reject(new Error('Не удалось авторизоваться'));
      }
    }, 2);
  });
}).then(function() {
  return new Promise(function(resolve, reject) {
    VK.api('users.get', {'name_case': 'gen'}, function(response) {
      if (response.error) {
        reject(new Error(response.error.error_msg));
      } else {
        let userData = response.response[0];
        
        headerInfo.textContent = `Друзья ${userData.first_name} ${userData.last_name}`;

        resolve();
      }
    });
  });
}).then(function(resolve, reject){
  return new Promise(function(resolve, reject) {/*'count':'10'*/
    VK.api('friends.get', {'fields': 'photo_50,bdate,nickname' }, function(response) {
      if (response.error) {
        reject(new Error(response.error.error_msg));
      } else {
        console.log(response.response);
        var now  = new Date();
        var friends = {},
            friendsArr = [];

        for(var item of response.response){
         // console.log(item);
          var friends = {};
          var now = new Date();
          friends.name  = item['first_name'] + ' ' + item['last_name'] ;
          friends.url  = item['photo_50'];
          if(item.bdate) {
            var arr = item.bdate.split('.');
            var year = arr[2] || NONE_YEAR;
            var day = arr[0].length == 1? '0' + arr[0] : arr[0];
            var mm  = arr[1].length == 1? '0' + arr[1] : arr[1];
            friends.dtSort  = arr[1]*1 < now.getMonth()*1 + 1  ? ((mm * 1 + 12) * 100 + day * 1) : mm * 100 + day * 1
            friends.bdate = dateFormat(new Date(`${year}-${mm}-${day}`));
            friends.age = year != NONE_YEAR ? now.getFullYear() - year : 'не указан';

          } else {
            friends.dtSort = 100000;
            item.bdate = new Date('1900-12-31');
            friends.age = 'не указано';
          }
          friendsArr.push(friends);
        }
        friendsArr.sort(function (friendA, friendB) {
          return friendA.dtSort - friendB.dtSort;
        });

       let source = document.getElementById('friendstemTemplate').innerHTML;
       let templateFn = Handlebars.compile(source);
       let template = templateFn({list: friendsArr});

        results.innerHTML = template;

        resolve();
      }
    });
  });

}).catch(function(e) {
  alert(`Ошибка: ${e.message}`);
});


//helpers
var monthNames = [
  "Января", "Февраля", "Марта",
  "Апреля", "Мая", "Июня", "Июля",
  "Августа", "Сентября", "Октября",
  "Ноября", "Декабря"
];

function dateFormat(date){
  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();
  if (year == NONE_YEAR)
    return day + ' ' + monthNames[monthIndex];
  else
    return day + ' ' + monthNames[monthIndex] + ' ' + year;

}

