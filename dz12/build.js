(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{"./model.js":3,"./view.js":5}],2:[function(require,module,exports){
var Model = require('./model.js');
var View = require('./view.js');
var Router = require('./router.js');



console.log(Model.check());


Handlebars.registerHelper('formatTime', function(time) {
    var minutes = parseInt(time / 60),
        seconds = time - minutes * 60;

    minutes = minutes.toString().length === 1 ? '0' + minutes : minutes;
    seconds = seconds.toString().length === 1 ? '0' + seconds : seconds;

    return minutes + ':' + seconds;
});

Handlebars.registerHelper('formatDate', function(ts) {
    return new Date(ts * 1000).toLocaleString();
});

new Promise(function(resolve) {
    window.onload = resolve;
}).then(function() {
    return Model.login(5755375, 2 | 8 | 8192);
}).then(function() {
    return Model.getUser().then(function(users) {
        header.innerHTML = View.render('header', users[0]);
    });
}).then(function() {
    document.addEventListener('click', e => {
        var route = e.target.dataset.route;
        if(route){
            Router.handle(route);
        }

    });

}).catch(function(e) {
    console.error(e);
    alert('Ошибка: ' + e.message);
});

},{"./model.js":3,"./router.js":4,"./view.js":5}],3:[function(require,module,exports){
module.exports = {

        login: function (appId, perms) {
            return new Promise(function (resolve, reject) {
                VK.init({
                    apiId: appId
                });

                VK.Auth.login(function (response) {
                    if (response.session) {
                        resolve(response);
                    } else {
                        reject(new Error('Не удалось авторизоваться'));
                    }
                }, perms);
            });
        },
        callApi: function (method, params) {
            return new Promise(function (resolve, reject) {
                VK.api(method, params, function (response) {
                    if (response.error) {
                        reject(new Error(response.error.error_msg));
                    } else {
                        resolve(response.response);
                    }
                });
            });
        },
        getUser: function () {
            return this.callApi('users.get', {});
        },
        getMusic: function () {
            return this.callApi('audio.get', {});
        },
        getFriends: function () {
            return this.callApi('friends.get', {fields: 'photo_100'});
        },
        getNews: function () {
            return this.callApi('newsfeed.get', {filters: 'post', count: 20});
        },
        check: function () {
            return 558;
        }

};
},{}],4:[function(require,module,exports){
var Controller = require('./controller.js');
module.exports = {

    handle: function (route) {
        var routeName = route + 'Route';

        Controller[routeName]();
    }
};

},{"./controller.js":1}],5:[function(require,module,exports){
module.exports = {

        render: function(templateName, model) {
            templateName = templateName + 'Template';

            var templateElement = document.getElementById(templateName),
                templateSource = templateElement.innerHTML,
                renderFn = Handlebars.compile(templateSource);

            return renderFn(model);
        }
};


},{}]},{},[2]);
