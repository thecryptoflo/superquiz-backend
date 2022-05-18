var DifficultyModel = require('../models/DifficultyModel.js');

/**
 * DifficultyController.js
 *
 * @description :: Server-side logic for managing Difficulties.
 */

module.exports = {
    /**
     * DifficultyController.list()
     */
    list: function (req, res) {
        //React demo
        DifficultyModel.find(function (err, Difficulties) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Difficulty.',
                    error: err
                });
            }

            //React demo
            return res.json(Difficulties);
        });
    },

    /**
     * DifficultyController.create()
     */
    create: function (req, res) {
        var Difficulty = new DifficultyModel({
            name : req.body.name,
        });

        Difficulty.save(function (err, Difficulty) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating Difficulty',
                    error: err
                });
            }
            return res.status(201).json(Difficulty);
        });
    }
};
