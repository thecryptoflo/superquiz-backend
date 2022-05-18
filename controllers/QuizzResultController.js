var QuizzresultModel = require('../models/QuizzResultModel.js');

/**
 * QuizzResultController.js
 *
 * @description :: Server-side logic for managing QuizzResults.
 */
module.exports = {

    /**
     * QuizzResultController.list()
     */
    list: function (req, res) {
        QuizzresultModel.find(function (err, QuizzResults) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting QuizzResult.',
                    error: err
                });
            }

            return res.json(QuizzResults);
        });
    },

    /**
     * QuizzResultController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        QuizzresultModel.findOne({_id: id}, function (err, QuizzResult) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting QuizzResult.',
                    error: err
                });
            }

            if (!QuizzResult) {
                return res.status(404).json({
                    message: 'No such QuizzResult'
                });
            }

            return res.json(QuizzResult);
        });
    },

    /**
     * QuizzResultController.create()
     */
    create: function (req, res) {
        var QuizzResult = new QuizzresultModel({
			date : req.body.date,
			user : req.body.user,
			score : req.body.score,
			questions : req.body.questions
        });

        QuizzResult.save(function (err, QuizzResult) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating QuizzResult',
                    error: err
                });
            }

            return res.status(201).json(QuizzResult);
        });
    },

    /**
     * QuizzResultController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        QuizzresultModel.findOne({_id: id}, function (err, QuizzResult) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting QuizzResult',
                    error: err
                });
            }

            if (!QuizzResult) {
                return res.status(404).json({
                    message: 'No such QuizzResult'
                });
            }

            QuizzResult.date = req.body.date ? req.body.date : QuizzResult.date;
			QuizzResult.user = req.body.user ? req.body.user : QuizzResult.user;
			QuizzResult.score = req.body.score ? req.body.score : QuizzResult.score;
			QuizzResult.questions = req.body.questions ? req.body.questions : QuizzResult.questions;
			
            QuizzResult.save(function (err, QuizzResult) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating QuizzResult.',
                        error: err
                    });
                }

                return res.json(QuizzResult);
            });
        });
    },

    /**
     * QuizzResultController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        QuizzresultModel.findByIdAndRemove(id, function (err, QuizzResult) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the QuizzResult.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
