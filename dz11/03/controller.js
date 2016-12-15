var Controller = {
    musicRoute: function() {
        return Model.getMusic().then(function(music) {
            results.innerHTML = View.render('music', {list: music});
        });
    },
    friendsRoute: function() {
        return Model.getFriends().then(function(friends) {
            results.innerHTML = View.render('friends', {list: friends});
        });
    },
    newsRoute: function() {
        return Model.getNews().then(function(news) {
            results.innerHTML = View.render('news', {list: news.items});
        });
    },
    groupsRoute: function() {
        return Model.getGroups().then(function(groups) {
            results.innerHTML = View.render('groups', {list: groups});
        });
    },
    photosRoute: function() {

        Model.getPhotos();
        /* return Model.getPhotos().then(function(photos) {
            console.log('Прошли альбом');
            console.log(photos);
            results.innerHTML = View.render('photos', {list: photos[0]});

        })
*/
        /*.then(function () {


              var photosWithComment = document.querySelectorAll('div#divCommentsCount');
              for (var item of photosWithComment) {
                  if (item.dataset.comments > 0) {
                      var p = Model.getComments(item.dataset.pid)
                          .then(function (comments) {
                              var el = document.getElementById(comments[0].pid);
                              if (el) {
                                  var el2 = el.querySelector('div#commentsList');
                                  el2.innerHTML = View.render('comments', {list: comments});
                              }
                          });
                  }
                  else {
                      var el = document.getElementById(item.dataset.pid);
                      if (el) {
                          var el2 = el.querySelector('div#commentsList');
                          el2.innerHTML = "Нет комментариев";
                      }

                  }

              }

          });


*/

    },

};
