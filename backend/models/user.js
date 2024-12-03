const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    'username' : {
        type: String,
        required: [true,"please enter a username"],
        unique: true,
    },
    'email' : {
        type: String,
        required: [true, "please enter an email"],
        unique: true,
        lowercase: true,
        trim: true,
        validate: [isEmail, "invalid email"],
    },
    'organization' : {
        type: String,
        required: [true, "please enter organization name"],
    },
    'role' : {
        type: String,
        enum: ['admin', 'developer', 'reviewer'],
        required: true,
    },
    'password' : {
        type: String,
        required: [true, "please enter password"],
        minlength: [8, "password must be atleast 8 characters"],
        validate: {
            validator: function (password) {
              // Require at least one letter, one number, and one special character
              return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
            },
            message: 'Password must contain at least one letter, one number, and one special character.',
        },
    }
}, {timestamps: true});

userSchema.pre('save', async function(next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.statics.login = async function(username, password) {
    const user = await this.findOne({ username });
    if (user) {
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
        return user;
      }
      throw Error('incorrect password');
    }
    throw Error('incorrect email');
};

const User = mongoose.model('user', userSchema);

module.exports = User;