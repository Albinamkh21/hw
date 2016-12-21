var Model = require('./model.js');
var View = require('./view.js');
module.exports = {
        musicRoute: function () {
            return Model.getMusic().then(function (music) {
                results.innerHTML = View.render('music', {list: music});
            });
        },
        friendsRoute: function () {
            return Model.getFriends().then(function (friends) {
                results.innerHTML = View.render('friends', {list: friends});
            });
        },
        newsRoute: function () {
            return Model.getNews().then(function (news) {
                results.innerHTML = View.render('news', {list: news.items});
            });
        }
};