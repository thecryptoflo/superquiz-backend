var CategoryModel = require('../models/CategoryModel.js');

/**
 * CategoryController.js
 *
 * @description :: Server-side logic for managing Categories.
 */

module.exports = {
    /**
     * CategoryController.list()
     */
    list: function (req, res) {
        //React demo
        CategoryModel.find({},{},{sort : {name: 1}},function (err, Categories) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting Category.',
                    error: err
                });
            }

            return res.json(Categories);
        });
    }
};
