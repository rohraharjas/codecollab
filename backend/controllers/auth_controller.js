const User = require("../models/user");
const jwt = require("jsonwebtoken");

const handleErrors = (err) => {
    console.log(err.message, err.code);
    let errors = { email: '', password: '' };
  
    if (err.message === 'incorrect email') {
      errors.email = 'That email is not registered';
    }
  
    if (err.message === 'incorrect password') {
      errors.password = 'That password is incorrect';
    }
  
    if (err.code === 11000) {
      errors.email = 'that email is already registered';
      return errors;
    }
  
    if (err.message.includes('user validation failed')) {
      Object.values(err.errors).forEach(({ properties }) => {
        errors[properties.path] = properties.message;
      });
    }
  
    return errors;
};

const jwtSecret = process.env.jwt;
const maxAge = 12*60*60;
const createToken = async (id) => {
    return jwt.sign({ id }, jwtSecret, {
        expiresIn: maxAge
    });
};

const register = async (req, res) => {
    const { username, email, organization, role, password } = req.body;

    try{
        const user = await User.create({ username, email, organization, role, password });
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json({ user: user._id });
    }
    catch(err){
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

const login = async(req, res) => {
    const { username, password } = req.body;

    try{
        const user = await User.login(username, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge*1000});
        res.status(201).json({user: user._id});
    }
    catch(err){
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

const logout = (req, res) => {
    res.cookie('jwt', '', {maxAge:1});
};

module.exports = {register, login, logout};