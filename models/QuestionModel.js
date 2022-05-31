var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var QuestionSchema = new Schema({
    category : {
        type: Number,
        ref: 'Category'
    },
    type : String,
    difficulty : String, //Either 'easy', 'medium', 'hard' or 0,1,2 if simpler
    description : {
        type : String,
        unique : true
    },
    correct_answer : String,
    incorrect_answers : [ String ]
}, {
    toObject: {
        transform: function (doc, ret) {
            delete ret._id;
            delete ret.__v;
        }
    },
    toJSON: {
        transform: function (doc, ret) {
            delete ret._id;
            delete ret.__v;
        }
    }
});

var Question = mongoose.model('Question', QuestionSchema);
module.exports = Question;