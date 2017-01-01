var fs = require('fs');
var utils = require('./utils');
var http = require('http');
var path = require('path');
var config = require('./config.json');
var routes = require('./routes');
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/test');

var server = http.createServer(function(req, res) {
    var url = req.url;

    if (url == '/') {
        url += config.defaultPage;
    }

    var target = './public' + url;
    var code = 200;

    console.log('поступил запрос:', '[', req.method, ']', url);

    if (req.method == 'GET') {
        if (!fs.existsSync(target)) {
            target = './public/' + config.page404;
            code = 404;
        }

        var ext = path.extname(target);
        var mimeType = config.mime[ext].type;
        var encoding = config.mime[ext].encoding;

        utils.readFile(target, encoding)
            .then(function(content) {
                res.setHeader('Content-Type', mimeType + '; charset=utf-8');
                res.writeHead(code);
                res.write(content);
                res.end();
            });
    } else {
        var routeFn = routes[url];

        routeFn(req, res);
    }
});

server.listen(8888);
