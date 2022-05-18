var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var QuizzResultSchema = new Schema({
	'date' : Date,
	'user' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'User'
	},
	'score' : Number,
	'questions' : Array
});

module.exports = mongoose.model('QuizzResult', QuizzResultSchema);
