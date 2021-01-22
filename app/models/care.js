var mongoose = require('mongoose');

module.exports = mongoose.model('GaryCare', {
    _id:String,
    acount: String,
    phone:String,
	pass: String,
	data: Array,
});
