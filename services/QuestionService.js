var QuestionModel = require('../models/QuestionModel.js');
const {ObjectID, ObjectId} = require("mongodb");

/**
 * shuffle()
 * Utility function to shuffle an array, for now placed here unless there's anywhere else where it's useful.
 * From : https://stackoverflow.com/a/2450976
 */

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

function checkQuery(raw_query){
    /**
     * Query possible (? = 0 or 1 elem):
     * { category : cat_id?, difficulty : (easy|medium|hard)?}
     * If value is invalid, we just ignore it
     */

    var query = {};
    if(raw_query.category !== undefined && parseInt(raw_query.category) !== NaN){
        query.category = raw_query.category;
    }
    if(["easy","medium","hard"].includes(raw_query.difficulty)){
        query.difficulty = raw_query.difficulty;
    }
    console.log(query);
    return query;
}

/**
 * QuestionController.getRandomQuestions()
 */

function getRandomQuestions(query) {
    console.log(query);
    return new Promise(function(resolve, reject) {
        QuestionModel.find(query)
            .then((questions) => {
                if(questions.length < 10){
                    if(questions.length > 0 && query.difficulty !== undefined)
                        delete query.difficulty;
                    else{
                        if(query === {})
                            throw new Error("Not enough Questions");
                        else
                            delete query.category;
                    }
                    console.log("After modif",query);
                    return resolve(getRandomQuestions(query));
                } else {
                    questions = shuffle(questions);
                    questions = questions.slice(0, 10);
                    return resolve([questions, query]);
                }
            })
            .catch((err) => {
                console.log(err)
                reject(err)
            });
    });
}

module.exports = {
    checkQuery,
    getRandomQuestions
}