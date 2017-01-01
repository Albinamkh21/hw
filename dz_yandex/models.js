var mongoose = require('mongoose');

var Placemark = mongoose.model('placemark', {x: Number, y: Number, adress: String, date : String});

var Review = mongoose.model('review', {x: Number, y: Number,  userName : String,  placeName : String,  text : String, date : String});


module.exports = {
    Placemark: Placemark,
    Review: Review,

};
