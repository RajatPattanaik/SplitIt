const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) {
      return res.send("Email already exists");
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const user = new User({
      email: req.body.email,
      password: hashedPassword,
      username : req.body.username
    })                                             
    var token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    await user.save();
    var future = new Date();
    future.setDate(future.getDate() + 10);
    const expiresIn = future.getTime();
    res.send({ token: token, userId: user._id,expiresIn: expiresIn, data: "Registered Successfully"});
  }catch(error){
      console.log(error);
      res.send("Registeration Failed!");
  }
}

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) res.send("Incorrect Email Id");
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (validPassword) {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      var future = new Date();
      future.setDate(future.getDate() + 10);
      const expiresIn = future.getTime();
      res.send({ token: token, userId: user._id, expiresIn: expiresIn, data: "Logged in"});
    }
    else {
      res.send("Incorrect password");
    }
  }catch (error) {
    res.send("Wrong email or password");
  }
}