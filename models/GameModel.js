var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var RoundSchema = new Schema({
	start_time: Date,
	end_time: Date,
	question: {
		type: Schema.Types.ObjectId,
		ref: 'Question'
	},
	score: Number
}, { _id : false });

var GameSchema = new Schema({
	'state' : String, // CREATED, PLAYING, PAUSED, ENDED ; PAUSED is the state between the question
	'created_at' : Date,
	'user' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'User'
	},
	'rounds' : [RoundSchema],
	'round_number' : Number, // From 0 to 9
	'total' : Number,
	'total_time' : Number
}, {
		toObject: {
			transform: function (doc, ret) {
				delete ret.__v;
			}
		},
		toJSON: {
			transform: function (doc, ret) {
				delete ret.__v;
			}
		}
	});

GameSchema.pre('findOne', function() {
	this.populate('rounds.question');
});

GameSchema.methods.toClientProofObject = function (){
	let game = this.toObject();
	switch (game.state) {
		case "CREATED":
			game.rounds = [];
			break;
		case "PLAYING":
			let question = game.rounds[game.round_number].question;
			question.answers = [...question.incorrect_answers];
			question.answers.push(question.correct_answer);
			question.answers.sort();
			delete question.incorrect_answers;
			delete question.correct_answer;
		case "PAUSED":
			game.rounds = game.rounds.slice(0,game.round_number + 1);
			break;
	}

	return game;
}

GameSchema.methods.startRound = function (){
	this.state = "PLAYING";
	if(this.round_number === undefined){
		this.round_number = 0;
		this.total = 0;
		this.total_time = 0;
		this.created_at = new Date();
	}
	else{
		this.round_number++;
	}

	this.rounds[this.round_number].start_time = new Date();
}

GameSchema.methods.endRound = function (answer){
	this.rounds[this.round_number].end_time = new Date();
	this.state = "PAUSED";

	let diff_time = (this.rounds[this.round_number].end_time - this.rounds[this.round_number].start_time)/1000;
	let score = (answer === this.rounds[this.round_number].question.correct_answer) ? 1.0 : 0.0;
	console.log("Correct",score,"Score (not floored)",100 * score * Math.exp(-0.2*diff_time));
	score = Math.floor(100 * score * Math.exp(-0.2*diff_time));
	this.rounds[this.round_number].score = score;
	this.total += score;
	this.total_time += diff_time;

	if(this.round_number === 9){
		this.state = "ENDED";
	}
}

module.exports = mongoose.model('Game', GameSchema);
