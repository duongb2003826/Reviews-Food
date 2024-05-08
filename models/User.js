const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 20,
    },
    email: {
        type: String,
        maxLength: 150,
        unique: true,
        trim: true,
        lowercase: true,
        required: true,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    },
    status: {
        type: Number,
        required: false,
        default: 1
    },
    role: {
        type: String,
        required: false,
        default: "USER"
    },
    password: {
        type: String,
        trim: true,
        minLength: 8,
        maxLength: 12,
        required: true
    },
    avatar: {
        type: String, // Đường dẫn tới ảnh đại diện của người dùng
    },
    bookmarks: [{
        type: Schema.Types.ObjectId,
        ref: "Location",
    }],
    isRestaurant: {
        type: String, // Restaurant
    },
}, {
    timestamps: true
});


userSchema.pre('save', async function (next) {
    // 'this' is the user doc
    if (!this.isModified('password')) return next();
    // update the password with the computed hash
    this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
    return next();
});


module.exports = mongoose.model('User', userSchema);
