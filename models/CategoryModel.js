var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var CategorySchema = new Schema({
    _id: Number,
    name: String
});

CategorySchema.pre('save', function (next) {

    Category.findById(this._id, function (err, category) {
        if (category === null){
            next();
        }else{
            console.log('Category exists: ',category);
            next(new Error("Category exists!"));
        }
    });
}) ;

var Category = mongoose.model('Category', CategorySchema);
module.exports = Category;