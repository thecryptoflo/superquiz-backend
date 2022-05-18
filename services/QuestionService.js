var QuestionModel = require('../models/QuestionModel.js');

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

/**
 * QuestionController.getRandomQuestions()
 */
module.exports = {
    getRandomQuestions: function (query) {
        return new Promise(function(resolve, reject) {
                resolve(QuestionModel.find(query)
                    .then(questions => shuffle(questions))
                    .then(questions => questions.slice(0, 10))
                    .catch(err => reject(err)));
            }
        )
    }
}