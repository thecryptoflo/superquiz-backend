var UserModel = require('../models/UserModel.js');
/**
 * UserController.js
 *
 * @description :: Server-side logic for managing Users.
 */

function isInputSafe(str) {
    return /^[A-Za-z0-9_]*$/.test(str);
}

module.exports = {

    /**
     * UserController.list()
     */
    list: function (req, res) {
        UserModel.find(function (err, Users) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting User.',
                    error: err
                });
            }
            return res.json(Users);
        });
    },

    /**
     * UserController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        UserModel.findOne({_id: id}, function (err, User) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting User.',
                    error: err
                });
            }

            if (!User) {
                return res.status(404).json({
                    message: 'No such User'
                });
            }

            return res.json(User);
        });
    },

    /**
     * UserController.create()
     */
    create: function (req, res) {
        if(!isInputSafe(req.body.username))
            return res.status(400).json({message : "Username should only contains letters, numbers and _"})
        var User = new UserModel({
            username: req.body.username,
            password: req.body.password
        });

        User.save(function (err, User) {

            if(err){
                if (err.code === 11000) {
                    return res.status(409).json({
                        message: "Username already taken"
                    });
                }

                return res.status(500).json({
                    message: 'Error when creating User',
                    error: err
                });
            }
            req.session.user = User;
            return res.status(201).json(User);
        });
    },

    login: function (req, res) {
        if(!isInputSafe(req.body.username))
            return res.status(400).json({message : "Username should only contains letters, numbers and _"})
        UserModel.authenticate(req.body.username, req.body.password, function (error, user) {
            if (error || !user) {
                var err = new Error("Wrong username or password");
                return res.status(401).json({
                    err: err
                });
            } else {
                req.session.user = user;
                return res.json(user);
            }
        });
    },

    logout: function (req, res) {
        if(req.session !== undefined)
            req.session.destroy();
        res.status(205).json();
    },

    /**
     * UserController.update()
     */
    update: function (req, res) {

        var id = req.params.id;

        if(req.params.id !== req.session.user._id){
            return res.status(403).json({
                message: "Forbidden to modify User"
            });
        }

        if(!isInputSafe(req.body.username))
            return res.status(400).json({message : "Username should only contains letters, numbers and _"})

        UserModel.findOne({_id: id}, function (err, User) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting User',
                    error: err
                });
            }

            if (!User) {
                return res.status(404).json({
                    message: 'No such User'
                });
            }

            User.username = req.body.username ? req.body.username : User.username;
            User.password = req.body.password ? req.body.password : User.password;

            User.save(function (err, User) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating User.',
                        error: err
                    });
                }

                return res.status(204).json(User);
            });
        });
    },

    /**
     * UserController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        UserModel.findByIdAndRemove(id, function (err, User) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the User.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    }
};
