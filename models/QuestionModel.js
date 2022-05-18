var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var QuestionSchema = new Schema({
    category : String,
    type : String,
    difficulty : String, //Either 'easy', 'medium', 'hard' or 0,1,2 if simpler
    description : String,
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

QuestionSchema.pre('save', function (next) {
    var self = this;
    Question.findOne({question:self.description}, function (err, question) {
        if (question === null){
            next();
        }else{
            console.log('Question exists: ',question.question);
            next(new Error("Question exists!"));
        }
    });
}) ;

var Question = mongoose.model('Question', QuestionSchema);
module.exports = Question;