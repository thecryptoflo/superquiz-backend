var GameModel = require('../models/GameModel.js');
var QuestionService = require('../services/QuestionService');
const {ObjectId} = require("mongodb");

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
			created_at : new Date(),
            query : undefined,
			user : req.session.user,
			rounds : [],
			scores : [],
            round_number : undefined,
			total : 0,
			total_time : 0
        });

        /**
         * Query possible (? = 0 or 1 elem):
         * { category : cat_id?, difficulty : (easy|medium|hard)?}
         * If value is invalid, we just ignore it
         */
        QuestionService.getRandomQuestions(QuestionService.checkQuery(req.body.query))
            .then(([Questions, query]) => {
                console.log("Final query",query);
                Game.category = query.category;
                Game.difficulty = query.difficulty;
                //Game.markModified('query');
                Questions.forEach(question => {
                    Game.rounds.push({
                        start_time: undefined,
                        end_time: undefined,
                        question: question,
                        user_answer: undefined,
                        is_correct: undefined,
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

        GameModel.findOne({_id: id, user : ObjectId(req.session.user._id)}, function (err, Game) {
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

        GameModel.findOne({_id: id, user : ObjectId(req.session.user._id)}, function (err, Game) {
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

        GameModel.findOne({_id: id, user : ObjectId(req.session.user._id)}, function (err, Game) {
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
    },

    /**
     * GameController.showLeaderboard()
     * Show best 10 scores of all time (a player can appear multiple times)s
     */
    showLeaderboard: function (req, res) {

        GameModel.find({state: "ENDED"}, "created_at user category difficulty total total_time",{limit: 10, sort: {total : -1}},function (err, Leaderboard) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Leaderboard.',
                    error: err
                });
            }

            return res.json(Leaderboard);
        });
    },

    /**
     * GameController.showHistory()
     * Show last 10 games of a player
     */
    showPlayerHistory: function (req, res) {
        var player_id = req.params.id;
        var filter = {user: ObjectId(player_id)};
        if(req.session.user._id !== player_id){
            filter.state = "ENDED";
        }
        console.log(req.session.user, player_id);
        console.log(filter);
        GameModel.find(filter, "created_at state user category difficulty total total_time",
            {limit: 10, sort: {created_at : -1}},
            function (err, History) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting player History.',
                    error: err
                });
            }

            return res.json(History);
        });
    }
}
