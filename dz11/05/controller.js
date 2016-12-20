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

       document.getElementById('sortWrapper').style.display = "block";
       return Model.getPhotos()
            .then(function (albums  ) {
                results.innerHTML = View.render('albums', {list: albums});
                var promises = [];
                for (var album of albums) {
                    var p = Model.getPhotos2(album.aid, 'pdate');
                    promises.push(p);
                }
                ;
               return Promise.all(promises).then(function (albums) {
                    for (var album of albums) {
                        var albumElement = document.querySelector('div#album' + album[0].aid);
                        var photosList = albumElement.querySelector('#photosList');
                        photosList.innerHTML = View.render('photos', {list: album});
                    }

                });
            }).then(function () {
               ShowComment();
            });

    },

};

var sortSelect = document.getElementById('sortSelect');
sortSelect.addEventListener('change', function (e) {
    return Model.getAlbums()
        .then(function (albums) {
            results.innerHTML = View.render('albums', {list: albums});
            var promises = [];
            for (var album of albums) {
                var sortField = e.target.value;
                if(e.target.value != 'pdate') sortField += ' desc';
                var p =  Model.getPhotos2(album.aid,sortField);
                promises.push(p);
            };
            return Promise.all(promises).then(function (albums) {
                for (var album of albums) {

                    var albumElement = document.querySelector('div#album' + album[0].aid);
                    var photosList = albumElement.querySelector('#photosList');
                    photosList.innerHTML = View.render('photos', {list: album});
                }

            });
        }).then(function () {
            ShowComment();
        });
});

function ShowComment() {


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

}