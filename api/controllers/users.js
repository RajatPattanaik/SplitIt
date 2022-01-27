const response = require("../libs/responseLib");
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) {
      let apiResponse = response.generate(true, "Email already Exists", 400, {});
      return res.send(apiResponse);
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
    let apiResponse = response.generate(false, "User Registered Successfully", 200, { token: token, userId: user._id,expiresIn: expiresIn, data: "Registered Successfully"});
    return res.send(apiResponse);
  }catch(error){
      console.log(error);
      let apiResponse = response.generate(true, "Registeration Failed", 401, {});
      return res.send(apiResponse);
  }
}

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      let apiResponse = response.generate(true, "Email doesn't exist", 400, {});
      return res.send(apiResponse);
    }
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (validPassword) {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
      var future = new Date();
      future.setDate(future.getDate() + 10);
      const expiresIn = future.getTime();
      let apiResponse = response.generate(false, "User Logged In", 200, { token: token, userId: user._id, expiresIn: expiresIn, data: "Logged in"});
      return res.send(apiResponse);
    }
    else {
      let apiResponse = response.generate(true, "Incorrect Email or Password", 400, {});
      return res.send(apiResponse);
    }
  }catch (error) {
    console.log(error);
    let apiResponse = response.generate(true, "Wrong email or password", 400, {});
    return res.send(apiResponse);
  }
}