var mongoose = require('mongoose');

module.exports = mongoose.model('List', {
	user: [String],       // used to be String, now it's [String] thats why it still works
	name : String
});