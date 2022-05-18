var QuestionModel = require('../models/QuestionModel.js');

/**
 * QuestionController.js
 *
 * @description :: Server-side logic for managing Questions.
 */

module.exports = {
    /**
     * QuestionController.list()
     */
    list: function (req, res) {
        //React demo
        QuestionModel.find(function (err, Questions) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Question.',
                    error: err
                });
            }

            //React demo
            return res.json(Questions);
        });
    }
};
