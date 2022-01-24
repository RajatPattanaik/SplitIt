if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const path = require('path');
const mongoose = require('mongoose');

//controllers
const groupController = require('./controller/group');
const personController = require('./controller/person');

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
app.use(express.urlencoded({extended : true}));
app.use(methodOverride('_method'));

app.engine('ejs' , ejsMate);

app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname , 'public')));

// Page rendering
app.get('/home' , (req,res) => {
    res.render('home');
})

app.get('/create' , (req,res) => {
    res.render('Group/create');
})

// Group
app.get('/groups',groupController.fetchAllGroups);
app.post('/home', groupController.homePage);
app.put('/groups/:id', groupController.updateGroup);
app.delete('/groups/:id',groupController.deleteGroup);
app.get('/groups/:id', groupController.fetchGroup);
app.get('/groups/:id/edit',groupController.editGroup);

// Person 
app.get('/person/:id', personController.personProfile);

app.listen(3002, () => {
    console.log("On port 3002");
})