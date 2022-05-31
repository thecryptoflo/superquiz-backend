var dbAuth = require('./dbdata');
var mongoose = require('mongoose');
var CategoryModel = require('./models/CategoryModel')
var QuestionModel = require('./models/QuestionModel')
var he = require('he');

const {default: axios} = require("axios");
var mongoDB = 'mongodb+srv://'+dbAuth+'@cluster0.mz8l1.mongodb.net/Quizz?retryWrites=true&w=majority';
mongoose.connect(mongoDB,  { useNewUrlParser:true, useUnifiedTopology: true  });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console,
    'MongoDB connection error:'));

fill_db();

function fill_db(){
    axios.get("https://opentdb.com/api_category.php")
        .then((res) => {
            return res.data
        })
        .then(data => {
            data.trivia_categories.forEach((category) => {
                var cat = save_category(category);
                axios.get("https://opentdb.com/api_count.php",{params : {category : cat.id}})
                    .then((res) => {
                        let counts = res.data.category_question_count;
                        let easy_num = counts.total_easy_question_count < 50 ? counts.total_easy_question_count : 50;
                        let medium_num = counts.total_medium_question_count < 50 ? counts.total_medium_question_count : 50;
                        let hard_num = counts.total_hard_question_count < 50 ? counts.total_hard_question_count : 50;

                        fetch_questions_per_category(easy_num,cat, "easy");
                        fetch_questions_per_category(medium_num,cat, "medium");
                        fetch_questions_per_category(hard_num,cat, "hard");
                    })
            });
        })
        .catch(function (err) {
            console.log("Unable to fetch -", err);
        });
}

function save_category(category){
    var Category = new CategoryModel({
        _id: category.id,
        name: category.name
    });

    Category.save(function (err, Category) {

        if (err) {
            console.log({
                message: 'Error when saving Category'
            });
        }
    });
    return Category;
}

function save_question(question, category){
    var Question = new QuestionModel({
        category : category,
        type : question.type,
        difficulty : question.difficulty, //Either 'easy', 'medium', 'hard' or 0,1,2 if simpler
        description : he.decode(question.question),
        correct_answer : he.decode(question.correct_answer),
        incorrect_answers : [...question.incorrect_answers].map( (elem) =>he.decode(elem))
    });

    Question.save(function (err, Question) {
        if (err) {
            console.log({
                message: 'Error when creating Question',
                error: err
            });
        }
    });

}

function fetch_questions_per_category(amount, category, difficulty){
    axios.get("https://opentdb.com/api.php",
        {
            params : {
                amount : amount,
                category: category._id,
                difficulty: difficulty
            }})
        .then((res) => {
            console.log(category.name, category._id,difficulty, "Code :",res.data.response_code,
                "Amount ask :",amount,"Amount received :", res.data.results.length);
            res.data.results.forEach(question => save_question(question, category));
        })
        .catch(function (err) {
            console.log("Unable to fetch -"+ err);
        });
}