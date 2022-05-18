var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var DifficultySchema = new Schema({
    name : String
});

module.exports = mongoose.model('difficulties', DifficultySchema);