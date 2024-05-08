const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: { 
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
    },
    image: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 250,
    },
    locations: [{
        type: Schema.Types.ObjectId,
        ref: "Location",
    }],
}, {
    timestamps: true
});


categorySchema.pre('save', async function(next) {
    return next();
});
  

module.exports = mongoose.model('Category', categorySchema);