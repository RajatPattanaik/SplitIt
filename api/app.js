if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express');
// const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const path = require('path');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const session = require('express-session'); 
const MongoDBStore = require("connect-mongo");
const bodyParser = require('body-parser');
const cors=require('cors');
const cookieParser = require('cookie-parser');
//controllers
// const groupController = require('./controllers/group');
// const personController = require('./controllers/person');
const User = require('./models/user');
const userRoutes = require('./routes/users');
// Mongo DB Local
mongoose.connect(process.env.DB_URL, 
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        useFindAndModify: false
    });

const db = mongoose.connection;
db.on('error', console.error.bind(console,"Connection Error!"));
db.once('open', () => {
    console.log("Database connection")
});


const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw({type: "*/*"}))
app.use(cookieParser());
app.use(cors());

app.engine('ejs' , ejsMate);

app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname , 'public')));

const secret = process.env.SECRET || 'thisshouldbeabettersecret';

const store = MongoDBStore.create({
    mongoUrl: process.env.DB_URL,
    secret,     
    touchAfter: 24 * 60 * 60
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e)
})

const sessionConfig ={
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly : true,
        expires : Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use('/', userRoutes);
// Page rendering
// app.get('/home' , (req,res) => {
//     res.render('home');
// })

// app.get('/create' , (req,res) => {
//     res.render('Group/create');
// })

// // Group
// app.get('/groups',groupController.fetchAllGroups);
// app.post('/home', groupController.homePage);
// app.put('/groups/:id', groupController.updateGroup);
// app.delete('/groups/:id',groupController.deleteGroup);
// app.get('/groups/:id', groupController.fetchGroup);
// app.get('/groups/:id/edit',groupController.editGroup);

// // Person 
// app.get('/person/:id', personController.personProfile);

app.listen(3002, () => {
    console.log("On port 3002");
})