import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// REGISTER USER

export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      friends,
      location,
      occupation,
    } = req.body;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 10000),
      impressions: Math.floor(Math.random() * 10000),
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    console.log(err, 'something went wrong with user register');
    res.status(500).json({
      error: err.message,
      message: 'Something went wrong with user registration. User not registered',
    });
  }
};
// LOGGING IN

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ msg: 'User credentials not found. ' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'User credentials not valid. ' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_STRING, {
      expiresIn: '2h',
    });
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    console.log(err, 'something went wrong with user login');
    res.status(500).json({
      error: err.message,
      message: 'Something went wrong with user login. User not logged in',
    });
  }
};
