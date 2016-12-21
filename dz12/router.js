var Controller = require('./controller.js');
module.exports = {

    handle: function (route) {
        var routeName = route + 'Route';

        Controller[routeName]();
    }
};
