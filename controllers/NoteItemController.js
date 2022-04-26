var NoteItemModel = require('../models/NoteItemModel.js');

/**
 * NoteItemController.js
 *
 * @description :: Server-side logic for managing NoteItems.
 */

module.exports = {
    /**
     * NoteItemController.list()
     */
    list: function (req, res) {
        //React demo
        NoteItemModel.find(function (err, NoteItems) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting NoteItem.',
                    error: err
                });
            }

            //React demo
            return res.json(NoteItems);
        });
    },

    openTask: function (req, res) {
        NoteItemModel.find({username:req.session.username, done:false},function (err, NoteItems) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting NoteItem.',
                    error: err
                });
            }

            return res.json(NoteItems);
        });
    },

    finishedTask: function (req, res) {
        NoteItemModel.find({username:req.session.username, done:true},function (err, NoteItems) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting NoteItem.',
                    error: err
                });
            }

            return res.json(NoteItems);
        });
    },

    workTask: function (req, res) {
        NoteItemModel.find({username:req.session.username, category:"Work"},function (err, NoteItems) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting NoteItem.',
                    error: err
                });
            }

            return res.json(NoteItems);
        });
    },

    shopTask: function (req, res) {
        NoteItemModel.find({username:req.session.username, category:"Shopping"},function (err, NoteItems) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting NoteItem.',
                    error: err
                });
            }

            return res.json(NoteItems);
        });
    },


    newTask: function (req, res) {
        res.render('noteItems/newNote',  {userId:req.session.userId , username:req.session.username});
    },

    /**
     * NoteItemController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        NoteItemModel.findOne({_id: id}, function (err, NoteItem) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting NoteItem.',
                    error: err
                });
            }
            if (!NoteItem) {
                return res.status(404).json({
                    message: 'No such NoteItem'
                });
            }
            return res.json(NoteItem);
        });
    },

    /**
     * NoteItemController.create()
     */
    create: function (req, res) {
        var NoteItem = new NoteItemModel({
			name : req.body.name,
			done : req.body.done,
            category : req.body.category,
            username : req.session.username

        });

        NoteItem.save(function (err, NoteItem) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating NoteItem',
                    error: err
                });
            }
            return res.status(201).json(NoteItem);
        });
    },

    /**
     * NoteItemController.update()
     */
    update: function (req, res) {
        var id = req.params.id;
        NoteItemModel.findOne({_id: id}, function (err, NoteItem) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting NoteItem',
                    error: err
                });
            }
            if (!NoteItem) {
                return res.status(404).json({
                    message: 'No such NoteItem'
                });
            }

            NoteItem.id = req.body.id ? req.body.id : NoteItem.id;
            NoteItem.name = req.body.name ? req.body.name : NoteItem.name;
			NoteItem.done = req.body.done ? req.body.done : NoteItem.done;
            NoteItem.category = req.body.category ? req.body.category : NoteItem.category;
            NoteItem.username = req.body.username ? req.body.username : NoteItem.username;

            NoteItem.save(function (err, NoteItem) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating NoteItem.',
                        error: err
                    });
                }

                return res.status(204).json(NoteItem);
            });
        });
    },

    /**
     * NoteItemController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        NoteItemModel.findByIdAndRemove(id, function (err, NoteItem) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the NoteItem.',
                    error: err
                });
            }
            return res.status(204).json();
        });
    }
};