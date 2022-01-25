const User = require('../models/user');

module.exports.regsiter = async (req,res,next) => {
    try{
        const { username , email , password } = req.body;
        const user = new User({username , email});
        const registeredUser = await User.register(user , password);
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash('success', 'Welcome to Yelp-camp!');
        });
    }catch(e){
        req.flash('error', e.message);
    }
}

module.exports.login = (req,res) => {
    console.log("login Called");
    req.flash('success', 'Welcome Back!');
    const returnUrl = req.session.returnTo;
    delete req.session.returnTo;
    res.send({ data: req.body })
}

module.exports.logout = (req,res) => {
    req.logout();
    req.flash('success', 'Goodbye!');
}