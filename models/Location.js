const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

const reviewSchema = new Schema( {
	userName: {
		type: String,
		required: true,
		minlength: 2,
		maxlength: 20,
	},
	content: {
		type: String,
		required: true,
		minlength: 4,
		maxlength: 100
	},
	rating: {
		type: Number,
		required: true,
		min: 1,
		max: 5
	},
	status: {
		type: Number,
		default: 1
	},
	// image: {
	// 	type: String,
	// 	match: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/,
	// 	maxLength: 200,
	// 	required: true
	// },
}, {
	timestamps: true
} );

const menuSchema = new Schema( {
	nameFood: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	linkFood: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	}
}, {
	timestamps: true
} );

const locationSchema = new Schema( {
	locationName: {
		type: String,
		required: true,
		unique: true,
		minLength: 3,
		maxLength: 200
	},
	address: {
		type: String,
		required: true,
		unique: true,
		minLength: 8,
		maxLength: 200
	},
	image: {
		type: String,
		match: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/,
		maxLength: 200,
		required: true
	},
	description: {
		type: String,
		minLength: 8,
		maxLength: 10000,
		required: true
	},
	openingTime: {
        type: String,
        required: true
    },
    closingTime: {
        type: String,
        required: true
    },
	category_id: {
		type: String,
	},
	sub_category: {
		type: String,
	},
	website: {
		type: String,
		match: /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/
	},
	latitude: {
		type: Number,
		unique: true,
		required: true,
	},
	longitude: {
		type: Number,
		unique: true,
		required: true,
	},
	postalCode: {
		type: String,
		minLength: 6,
		maxLength: 6,
		required: true,
		match: /^\d{6}$/
	},
	reviews: [ reviewSchema ],
	menus: [ menuSchema ],
	ownUser: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	category: {
		type: Object,
	}
}, {
	timestamps: true,
} );
locationSchema.index( { nameLocation: 'text' } );

module.exports = mongoose.model( 'Location', locationSchema );