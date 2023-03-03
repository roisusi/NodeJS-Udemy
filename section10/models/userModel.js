//----------//
// Requires //
//----------//

const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

//-----------//
// Database //
//----------//

//validators are check in create or in runValidators true in others , that is build in and custom
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
        lowercase: true,
        validator: [validator.isEmail],
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'Please enter your password'],
        minlength: 8,
        select: false,
    },
    passwordConfirmation: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            //this is only work on CREAT and SAVE !!!
            validator: function (el) {
                return el === this.password;
            }, message: 'Passwords do not match',
        }
    }
});

userSchema.pre('save', async function (next) {
    //Only run this function if password is modified
    if (!this.isModified('password')) {
        return next();
    }
    //hash the password
    const saltRounds = 12;
    this.password = await bcrypt.hash(this.password, saltRounds);
    //remove the filed from the DB
    this.passwordConfirmation = undefined;
    next();
})

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return bcrypt.compare(candidatePassword, userPassword);
}

const User = mongoose.model('User', userSchema);

module.exports = User;
