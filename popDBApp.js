var dbAuth = require('./dbdata');
var mongoose = require('mongoose');
var CategoryModel = require('./models/CategoryModel')
var QuestionModel = require('./models/QuestionModel')

const {default: axios} = require("axios");
var mongoDB = 'mongodb+srv://'+dbAuth+'@cluster0.mz8l1.mongodb.net/Quizz?retryWrites=true&w=majority';
mongoose.connect(mongoDB,  { useNewUrlParser:true, useUnifiedTopology: true  });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console,
    'MongoDB connection error:'));

axios.get("https://opentdb.com/api_category.php")
    .then((res) => {
        return res.data
    })
    .then(data => {
        data.trivia_categories.forEach((category) => {
            fetch_questions_per_category(save_category(category));
        });

    })
    .catch(function (err) {
        console.log("Unable to fetch -", err);
    });

function save_category(category){
    var Category = new CategoryModel({
        _id: category.id,
        name: category.name
    });

    Category.save(function (err, Category) {
        if (err) {
            console.log({
                message: 'Error when creating Category',
                error: err
            });
        }
        console.log(Category);
    });
    return Category;
}

function save_question(question){
    var Question = new QuestionModel({
        category : question.category,
        type : question.type,
        difficulty : question.difficulty, //Either 'easy', 'medium', 'hard' or 0,1,2 if simpler
        description : question.question,
        correct_answer : question.correct_answer,
        incorrect_answers : [...question.incorrect_answers]
    });

    Question.save(function (err, Question) {
        if (err) {
            console.log({
                message: 'Error when creating Question',
                error: err
            });
        }
        console.log(Question);
    });

}

function fetch_questions_per_category(category){
    axios.get("https://opentdb.com/api.php?amount=50&category="+category._id)
        .then((res) => {
            console.log(res.status,res.statusText)
            return res.data
        })
        .then(data => {
            console.log(category.name, "Number of results :",data.results.length)
            data.results.forEach(question => save_question(question))

        })
        .catch(function (err) {
            console.log("Unable to fetch -", err);
        });
}