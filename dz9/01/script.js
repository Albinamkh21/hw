const NONE_YEAR = 1500;
  var db = openDatabase('friends', '1.0', 'friends db', 2 * 1024 * 1024);  var db = openDatabase('friends', '1.0', 'friends db', 2 * 1024 * 1024);

new Promise(function(resolve) {
  if (document.readyState == 'complete') {
    resolve();
  } else {
    window.onload = resolve;
  }
}).then(function () {

   /*проверяем есть ли у нас сохраненные данные в базе, если нет загружаем их VK*/
    return new Promise(function(resolve) {
      db.transaction(function(tx) {
       tx.executeSql('CREATE TABLE IF NOT EXISTS friendsMain (id, name, url)', [], resolve);
       tx.executeSql('CREATE TABLE IF NOT EXISTS friendsSelected (id, name, url)', [], resolve);
      });
      resolve();
    });
    }).then(function() {
       return new Promise(function (resolve) {
         db.transaction(function (tx) {
           tx.executeSql('SELECT * FROM friendsMain', [], function (tx, res) {
            resolve(res);
           });
         });
       });
  }).then(function(res) {
      return new Promise(function (resolve, reject) {
        if(res.rows.length > 0) {
            showDataFromTable('friendsListTemplate', 'friendsMain');
            showDataFromTable('friendsSelectedListTemplate', 'friendsSelected');
        }
        else
          showDataFromVK();

        resolve();
      });

  }).then(function () { /*перенос из одного списка в другой по нажатию на кнопки*/
    var containerMainList = document.getElementById('containerMainList');
    containerMainList.addEventListener('click', function (e) {
        if(e.target.id != 'glyphicon') return ;
        moveElementFromTo(e.target, 'friendsSelectedList');
    });
    var containerSelectedList = document.getElementById('containerSelectedList');
    containerSelectedList.addEventListener('click', function (e) {
        if(e.target.id != 'glyphicon') return ;
        moveElementFromTo(e.target, 'friendsList');

    });
});

var btnSave = document.getElementById('btnSave');
btnSave.addEventListener('click', function (e) {

    new Promise(function(resolve) {
        db.transaction(function(tx) {

           tx.executeSql('delete from friendsMain');
           tx.executeSql('delete from friendsSelected');
            resolve();

        });


    }).then(function() {
        var friendsList = document.getElementById('friendsList');
        var mainList = friendsList.querySelectorAll('li');
        for (var row of mainList) {
            saveToDBTable(friendsList.dataset.table, row.id, row.dataset.name, row.dataset.url);
        }

        var friendsSelectedList = document.getElementById('friendsSelectedList');
        var selectedList = friendsSelectedList.querySelectorAll('li');
        for (var row of selectedList) {
            saveToDBTable(friendsSelectedList.dataset.table, row.id, row.dataset.name, row.dataset.url);
        }
        alert('Данные сохранены!');
    });
});

var btnDelete = document.getElementById('btnDelete');
btnDelete.addEventListener('click', function (e) {

    new Promise(function(resolve) {
        db.transaction(function(tx) {

            tx.executeSql('delete from friendsMain');
            tx.executeSql('delete from friendsSelected');

        });
        resolve();

    }).then(function() {
         alert('Данные удалены!');
    });
});


function moveElementFromTo(target, ulId){


    var currentItem = target.closest('li');
    currentItem.parentNode.removeChild(currentItem);
    var ul = document.getElementById(ulId);
    ul.style.display = 'none';
    ul.appendChild(currentItem);
    
    console.log(ul);
    var arr = ul.querySelectorAll('li');
    var friendsArr = [],
        friends = {};

    for (var item of arr ){
        friends = {};
        friends.id = item.id;
        friends.name = item.dataset.name;
        friends.value = item;
        friends.url = item.dataset.url;
        friendsArr.push(friends);
    }
    friendsArr.sort(function (a, b) {
        if (a.name > b.name) {
            return 1;
        }
        if (a.name < b.name) {
            return -1;
        }
        return 0;
    });
   ul.parentNode.removeChild(ul);
   addToHTML(friendsArr, ul.id + 'Template');

};

function showDataFromVK (){
  new Promise(function(resolve, reject) {
    VK.init({
      apiId: 5755375
    });

    VK.Auth.login(function (response) {
      if (response.session) {
        resolve(response);
        console.log('авторизовались');
      } else {
        reject(new Error('Не удалось авторизоваться'));
      }
    }, 2);

  }).then(function(){
      VK.api('friends.get', {'fields': 'photo_50,bdate,nickname'}, function(response) { //,'count':'10'
          if (response.error) {
              console.lo(new Error(response.error.error_msg));
          } else {
              console.log('Получили друзей из вк ', response.response);
             var friendsArr = [];
              for (var item of response.response) {
                  var friends = {};
                  friends.id = item['uid'];
                  friends.name = item['first_name'] + ' ' + item['last_name'];
                  friends.url = item['photo_50'];
                  friendsArr.push(friends);

              }
              var arr = friendsArr.sort(function (a, b) {
                  if (a.name > b.name) {
                      return 1;
                  }
                  if (a.name < b.name) {
                      return -1;
                  }
                  return 0;
              });
              addToHTML(arr, 'friendsListTemplate');
              addToHTML([], 'friendsSelectedListTemplate');

          }

      });
  }).catch(function(e) {
  alert(`Ошибка: ${e.message}`);
});

};

function showDataFromTable(templateId, table) {
  console.log('Выводим друзей из бд', templateId);
  db.transaction(function(tx) {
    tx.executeSql(`SELECT * FROM ${table} order by name`, [], function (tx, res) {
         addToHTML(res.rows, templateId);

    });
  });
};

function addToHTML(rows, templateId ) {


  let source = document.getElementById(templateId).innerHTML;
  let templateFn = Handlebars.compile(source);
  let template = templateFn({list: rows});

   if(templateId == 'friendsSelectedListTemplate')
     selectedList.innerHTML = template;
  else
     results.innerHTML = template;
};

function saveToDBTable(table, id, name, url) {
    console.log(`INSERT INTO ${table} VALUES (?, ?,?)`, [id, name, url]);
    db.transaction(function(tx) {
        tx.executeSql(`INSERT INTO ${table} VALUES (?, ?,?)`, [id, name, url]);
    });

};

/*drag&drop*/
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    var target = ev.target.tagName != 'li' ? ev.target.closest('li') : ev.target;
    ev.dataTransfer.setData("text", target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    var li = document.getElementById(data);
    var target = ev.target.tagName != 'ul' ? ev.target.closest('ul') : ev.target;

    moveElementFromTo(li, target.id);

}
/*seach*/
var searchfriendsList = document.getElementById('searchfriendsList');
searchfriendsList.addEventListener('keyup', function(e){
    filterList('friendsList',e);
});

var searchfriendsSelectedList = document.getElementById('searchfriendsSelectedList');
searchfriendsSelectedList.addEventListener('keyup', function(e){
    filterList('friendsSelectedList',e);
});

function filterList(ulId, e) {
    var target = e.target;
    var ul = document.getElementById(ulId); console.log(ul);
    var arr = ul.querySelectorAll('li');
    var friendsArr = [],
        friends = {};
    for (var item of arr ){
        friends = {};
        friends.id = item.id;
        friends.name = item.dataset.name;
        friends.value = item;
        friends.url = item.dataset.url;
        item.style.display = 'none';
        friendsArr.push(friends);
    }
    if(!target.value) filtered = friendsArr;
    else {
        var filtered = friendsArr.filter(function (item) {
            if (item.name.toLowerCase().indexOf(target.value.toLowerCase()) != -1) return true;
        });
    }
    var resultArr = filtered.map(function(item) {
        item.value.style.display = 'block';
        console.log(item.value);
    })
}




