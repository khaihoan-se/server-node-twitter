const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema

const userSchema = new Schema({
    name: { type: String, required: true, trim: true, maxlength: 50 },
    username: { type: String, required: true, trim: true, maxlength: 50, unique: true },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true, minLength: 6 },
    avatar: { type: String, default: 'https://res.cloudinary.com/devstylea/image/upload/v1664359082/fallback_profile_sgxnrc.png' },
    banner: { type: String },
    bio: { type: String },
    websites: { type: String },
    location: { type: String },
    bio: { type: String, maxlength: 160 },
    birthdate: { type: Date },
    
    posts: [{ type: mongoose.Types.ObjectId, ref: 'Post' }],
    like: [{ type: mongoose.Types.ObjectId, ref: 'Post' }],
    following: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    followers: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
});

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model('User', userSchema)