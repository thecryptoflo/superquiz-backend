var GameModel = require('../models/GameModel.js');
var QuestionService = require('../services/QuestionService');

/**
 * GameController.js
 *
 * @description :: Server-side logic for managing Games.
 */
module.exports = {

    /**
     * GameController.create()
     */
    create: function (req, res) {
        var Game = new GameModel({
			state : "CREATED",
			created_at : undefined,
			user : req.user, // Need middleware to append User to the request based on the session
			rounds : [],
			scores : [],
            round_number : undefined,
			total : 0,
			total_time : 0
        });

        QuestionService.getRandomQuestions()
            .then((Questions) => {
                Questions.forEach(question => {
                    Game.rounds.push({
                        start_time: undefined,
                        end_time: undefined,
                        question: question,
                        score: undefined
                    })
                });
                Game.save()
                    .then(Game => res.status(201).json(Game.toClientProofObject()))
                    .catch(err => res.status(500).json({
                        message: 'Error when saving the created Game',
                        error: err
                    }));
            })
            .catch(err => res.status(500).json({
                message: 'Error when randomly selecting Questions for Game',
                error: err
            }));

    },

    /**
     * GameController.startGame()
     */
    startGame: function (req, res) {
        var id = req.params.id;
        /*
        GameModel.findOne({_id: id})
            .populate('rounds.question')
            .exec()
            .then( Game => console.log(Game))
            .catch( err => console.log(err));
        */

        GameModel.findOne({_id: id}, function (err, Game) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Game.',
                    error: err
                });
            }

            if (!Game) {
                return res.status(404).json({
                    message: 'No such Game'
                });
            }
            else if(Game.state === "PLAYING" || Game.state === "PAUSED"){
                return res.status(400).json({
                    message: 'The Game has already been started'
                });
            }
            else if(Game.state === "ENDED") {
                return res.status(400).json({
                    message: 'The Game has already ended'
                });
            }

            Game.startRound();

            Game.save(function (err, Game) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when starting the Game',
                        error: err
                    });
                }

                return res.status(201).json(Game.toClientProofObject());
            });
        });


    },

    /**
     * GameController.answerQuestion()
     */
    answerQuestion: function (req, res) {
        var id = req.params.id;

        GameModel.findOne({_id: id}, function (err, Game) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Game.',
                    error: err
                });
            }

            if (!Game) {
                return res.status(404).json({
                    message: 'No such Game'
                });
            }
            else if(Game.state === "CREATED"){
                return res.status(400).json({
                    message: 'The Game has not yet been started'
                });
            }
            else if(Game.state === "PAUSED"){
                return res.status(400).json({
                    message: 'The Game is in paused, ask for next question before answering'
                });
            }
            else if(Game.state === "ENDED"){
                return res.status(400).json({
                    message: 'The Game has ended'
                });
            }

            Game.endRound(req.body.answer);

            Game.save(function (err, Game) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when answering a Game question',
                        error: err
                    });
                }

                return res.status(201).json(Game.toClientProofObject());
            });
        });
    },

    /**
     * GameController.nextQuestion()
     */
    nextQuestion: function (req, res) {
        var id = req.params.id;

        GameModel.findOne({_id: id}, function (err, Game) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Game.',
                    error: err
                });
            }

            if (!Game) {
                return res.status(404).json({
                    message: 'No such Game'
                });
            }
            else if(Game.state === "CREATED"){
                return res.status(400).json({
                    message: 'The Game has not yet been started'
                });
            }
            else if(Game.state === "PLAYING"){
                return res.status(400).json({
                    message: 'Please answer the question before going to the next one.'
                });
            }
            else if(Game.state === "ENDED"){
                return res.status(400).json({
                    message: 'The Game has ended'
                });
            }

            Game.startRound();

            Game.save(function (err, Game) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when continuing to Game\'s next question',
                        error: err
                    });
                }

                return res.status(201).json(Game.toClientProofObject());
            });
        });
    },

    /**
     * GameController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        GameModel.findOne({_id: id}, function (err, Game) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Game.',
                    error: err
                });
            }

            if (!Game) {
                return res.status(404).json({
                    message: 'No such Game'
                });
            }

            return res.json(Game.toClientProofObject());
        });
    }
}
