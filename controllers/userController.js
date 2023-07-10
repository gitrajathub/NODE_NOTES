const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');

const dotenv = require("dotenv");
require('dotenv').config();

//signup---------------------------------------

const salt = bcrypt.genSaltSync(10);
const secret = 'abc123xyz';

exports.signUp = async (req, res) => {
  try {
    const { username, password } = req.body;
    //console.log("req.body", req.body);
    
    const hashedPassword = await bcrypt.hash(password, salt);
    //console.log("hashedPassword",hashedPassword);

    const newUser = new User({
      username,
      password: hashedPassword
    });

    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
    } 
    catch (error) {
        //console.error('Error creating user:', error);
        res.status(500).json({ error: 'Server Error' });
  }
};

//login------------------------------------------------

exports.login = async (req,res) => {
    
  try{
    const {username,password} = req.body;
    const userDoc = await User.findOne({username});

    if(userDoc){
      const passOk = bcrypt.compareSync(password, userDoc.password);
      if (passOk) {
          // logged in
          jwt.sign({username,id:userDoc._id}, secret, {}, (err,token) => {
          if (err) throw err;
          res.cookie('token', token).json({
              id:userDoc._id,
              username,
          });
        });
      } 
      else {
          res.status(400).json('wrong credentials');
      }
    }
    else{
      res.status(400).json('user not found');
    }
  }
  catch(err){
    res.status(500).json({ error: 'Server error' });
  }
};

//logout--------------------------------------------------------------

exports.logout = async (req,res) => {  
  res.cookie('token', '').json('logged out');
};

//delete--------------------------------------------------------------

exports.deleteUser = async (req,res) => {
    
  try{
    const {token} = req.cookies;
    jwt.verify(token, secret, {}, async (err,info) => {
        if (err) {
          res.status(500).json({error: "Please login first"});
        }
        else{
          const userId = info.id;
          const deletedUser = await User.findByIdAndDelete(userId);
    
          if (deletedUser) {
            res.status(200).json({ message: 'User deleted successfully' });
          } else {
            res.status(404).json({ error: 'User not found' });
          }
      }
    });
  }
  catch{
    res.status(500).json({ error: 'Server error' });
  }
};


//update------------------------------------------------------

exports.updateUser = async (req, res)  => {

  const {token} = req.cookies;
  
  try {
    jwt.verify(token, secret, {}, async (err,info) => {
      if (err) throw err;
      const {username, password} = req.body;
      const updatedUser = await User.findByIdAndUpdate(
        { username, password },
        { new: true }
      );
    });
  }
  catch(err){
    //console.error('Error updating user:', error);
    res.status(500).json({ error: 'Server error' });
  }
};


