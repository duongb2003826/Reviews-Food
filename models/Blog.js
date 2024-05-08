const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    name: { 
        type: String,
        required: true,
		trim: true,
    },
	status: { 
        type: Number,
		required: false,
		default: 1
    },
	content: { 
        type: String,
		trim: true,
		required: false
    },
	description: { 
        type: String,
		trim: true,
		required: false
    },
    image: {
        type: String,
        trim: true,
        required: true
    }
}, {
    timestamps: true
});
  

module.exports = mongoose.model('Blog', blogSchema);