var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var CategorySchema = new Schema({
    _id: Number,
    name: String
});

CategorySchema.pre('save', function (next) {
    var self = this;
    Category.findById(self._id, function (err, category) {
        if (category === null){
            next();
        }else{
            console.log('Category exists: ',self.category);
            next(new Error("Category exists!"));
        }
    });
}) ;

var Category = mongoose.model('Category', CategorySchema);
module.exports = Category;