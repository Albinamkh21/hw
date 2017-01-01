var utils = require('./utils');
var Placemark = require('./models').Placemark;
var Review = require('./models').Review;


module.exports = {
    '/save/': function(req, res) {
        // data - получен кусок данных
        // end - содержимое POST-запроса заполучено полностью

        console.log('пытаемся сохранить метку в Placemark');

        utils.readPlacemark(req)
            .then(function(postBody) {
                console.log('получено тело запроса:', postBody);

                var placemark = new Placemark(postBody);

                placemark.save()
                    .then(function() {
                        res.write('OK');
                        res.end();
                    })
                    .catch(function(error) {
                        res.writeHead(500);
                        res.write(error.message);
                        res.end();
                    });
            })
            .catch(function() {
                res.writeHead(500);
                res.end();
            });
    },
    '/list/': function(req, res) {
        console.log('пытаемся получить список записей');

        Placemark.find()
            .then(function(placemarks) {
                console.log(placemarks);
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                res.write(JSON.stringify(placemarks));
                res.end();
            })
            .catch(function() {
                res.writeHead(500);
                res.end();
            });
    },
    '/saveReview/' : function(req, res) {
        console.log('пытаемся сохранить отзыв в Review');

        utils.readPlacemark(req)
            .then(function(postBody) {
                console.log('получено тело запроса:', postBody);

                var review = new Review(postBody);

                review.save()
                    .then(function() {
                        res.write('OK');
                        res.end();
                    })
                    .catch(function(error) {
                        res.writeHead(500);
                        res.write(error.message);
                        res.end();
                    });
            })
            .catch(function() {
                res.writeHead(500);
                res.end();
            });
    },
    '/reviewList/': function(req, res) {
        console.log('пытаемся получить список отзывов');
        utils.readPlacemark(req)
            .then(function(params) {
                console.log('получено тело запроса:', params);
                Review.find(params)
                    .then(function (reviews) {
                        console.log(reviews);
                        res.setHeader('Content-Type', 'application/json; charset=utf-8');
                        res.write(JSON.stringify(reviews));
                        res.end();
                    })
                    .catch(function () {
                        res.writeHead(500);
                        res.end();
                    });
            });
    },

};
