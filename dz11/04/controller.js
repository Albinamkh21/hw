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

       return Model.getPhotos()
            .then(function (albums  ) {
                results.innerHTML = View.render('albums', {list: albums});
                var promises = [];
                for (var album of albums) {
                    var p =  Model.getPhotos2(album.aid);
                    promises.push(p);
                };
                Promise.all(promises).then(function (albums) {
                    for (var album of albums) {
                       var albumElement = document.querySelector('div#album' + album[0].aid);
                       var photosList = albumElement.querySelector('#photosList');
                       photosList.innerHTML = View.render('photos', {list: album});
                    }
                    
                });
            });

    },

};
