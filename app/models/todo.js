var mongoose = require('mongoose');

module.exports = mongoose.model('Todo', {
	user: [String],
	text : String,
	done : Boolean,
	list: String
});