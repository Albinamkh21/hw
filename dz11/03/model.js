var db = openDatabase('friends', '1.0', 'friends db', 2 * 1024 * 1024);  var db = openDatabase('photos', '1.0', 'photos db', 2 * 1024 * 1024);

var Model = {
    login: function(appId, perms) {
        return new Promise(function(resolve, reject) {
            VK.init({
                apiId: appId
            });

            VK.Auth.login(function(response) {
                if (response.session) {
                    resolve(response);
                } else {
                    reject(new Error('Не удалось авторизоваться'));
                }
            }, perms);
        });
    },
    callApi: function(method, params) {
        return new Promise(function(resolve, reject) {
            VK.api(method, params, function(response) {
                if (response.error) {
                    reject(new Error(response.error.error_msg));
                } else {
                    resolve(response.response);
                }
            });
        });
    },
    getUser: function() {
        return this.callApi('users.get', {});
    },
    getMusic: function() {
        return this.callApi('audio.get', {});
    },
    getFriends: function() {
        return this.callApi('friends.get', { fields: 'photo_100' });
    },
    getNews: function() {
        return this.callApi('newsfeed.get', { filters: 'post', count: 20 });
    },
    getGroups: function() {
        return this.callApi('groups.get', {  fields: 'photo_50, name' , count: 20 , extended : 1});
    },
    getPhotos: function() {
        unitDB(db).then(function () {  console.log('unitDB was done');});
        //albumsIds = [212992529, 185168883];
       return this.callApi('photos.getAlbums', {})
        .then(function (albums) {
            var albumsIds = [];
            for (var item of albums) {
                albumsIds.push(item.aid);
            };
           // albumsIds = [212992529, 185168883];
           return GetDataByAlbum(albumsIds, 0);
        });

    },
    getComments: function (pid) {
      pid = parseInt(pid);
      return new Promise(function(resolve, reject) {
            db.transaction(function (tx) {
                tx.executeSql('SELECT * FROM comments c inner join users u  on c.from_id= u.uid inner join photos p on p.pid = c.pid where c.pid = ? order by  c.dt ', [pid], function (tx, res) {
                   resolve(res.rows);

                });
            });
      });

    }
    
    
};
function unitDB(db) {

    return new Promise(function (resolve) {
        db.transaction(function (tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS photos (pid,aid, src, text, commentsCount,likesCount, repostsCount)');
            tx.executeSql('CREATE TABLE IF NOT EXISTS comments (id, pid,dt, commentText, from_id, date)');
            tx.executeSql('CREATE TABLE IF NOT EXISTS users (uid,name, url);');

            tx.executeSql('delete from  photos');
            tx.executeSql('delete from  comments');
            tx.executeSql('delete from  users');
            resolve();
        });
    });
}

function SaveData(sql, params) {
    return new Promise(function (resolve) {
        db.transaction(function (tx) {
            for (var i = 0; i < params.length; i++) {
               tx.executeSql(sql, params[i], function () {});
            }
            resolve();
        });
    });

}

function GetDataFromTable(table, field) {
    return new Promise(function (resolve) {

        db.transaction(function (tx) {
            tx.executeSql(`SELECT  distinct ${field} FROM ${table}`, [], function (tx, res) {
                resolve(res.rows);
            });


        });
    });
};
function GetCommentsFromVK(aid) {
    return Model.callApi('photos.getAllComments', {album_id:aid, count: 100})
        .then(function (comments) {
            console.log('Получили каменты');
            //console.log(comments);
            var commentsToDB = [];
            for (var item of comments) {
                var dt = new Date(item.date * 1000);
                var month = (dt.getMonth() + 1) < 10 ? '0' + (dt.getMonth() + 1) : (dt.getMonth() + 1);
                var cdate = `${dt.getDate()}-${month}-${dt.getFullYear()} `;
                commentsToDB.push([item.cid, item.pid, item.date, item.message, item.from_id, cdate]);
            }
            // console.log('Сохранили каменты в табличку');
            return SaveData('INSERT INTO comments (id, pid,dt, commentText, from_id, date) VALUES (?, ?, ?, ?,?,?)', commentsToDB);

        }).then(function () {
            console.log('Сохранили каменты в табличку');
            return GetDataFromTable('comments', 'from_id');
        }).then(function (result) {
            var users = [];
            for (var item of result) {
                users.push(item.from_id)
            }
             return Model.callApi('users.get', {user_ids: users.join(','), fields: 'photo_50'});
        }).then(function (users) {

            console.log('Получили список пользователей');
            var usersToDB = [];
            for (var item of users) {
                usersToDB.push([item.uid, item.first_name + ' ' + item.last_name, item.photo_50]);
            }
            return SaveData('INSERT INTO users (uid,name, url) VALUES (?, ?, ?)', usersToDB);
        });
}

function GetDataByAlbum(albums, i) {
       var curAid = albums[i];
       if(i >= albums.length ) {
            console.log('все альбомы прошли');
           return 1;


        }
       Model.callApi('photos.get', { album_id : curAid,   extended : 1})
    .then(function (photos) {
        console.log('Получили Фото по альбому ' + curAid);
        var photoToDB = [];
        for (var item of photos) {

            photoToDB.push([item.pid, item.aid, item.src, item.text, item.comments.count, item.likes.count, item.reposts.count]);

        };
        return SaveData('INSERT INTO photos(pid,aid, src, text, commentsCount,likesCount, repostsCount) VALUES (?, ?, ?, ?, ?, ?, ?)', photoToDB);

    }).then(function (photos) {
        console.log('Сохранили фоты в табличку');
        return GetCommentsFromVK(curAid);
    }).then(function () {
            console.log('Сохранили все - фоты, каменты, юзеров по альбому ' + curAid);
             setTimeout(GetDataByAlbum(albums, i+1), 1000);
         /*  return new Promise(function(resolve, reject) {
                 setTimeout(GetDataByAlbum(albums, i+1));
                 db.transaction(function (tx) {
                     tx.executeSql('SELECT pid, src, text, commentsCount,likesCount, repostsCount FROM photos where aid = ? ', [curAid], function (tx, res) {
                       // return res.rows;
                         resolve(res.rows);
                     });
                 });

             });
             */

    });
};