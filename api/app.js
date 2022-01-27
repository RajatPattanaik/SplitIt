if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

const express = require('express');
const ejsMate = require('ejs-mate');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors=require('cors');
const cookieParser = require('cookie-parser');
const fs = require('fs');

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

const routesPath = './routes';

fs.readdirSync(routesPath).forEach(function (file) {
    if (~file.indexOf('.js')) {
      let route = require(routesPath + '/' + file);
      route.setRouter(app);
    }
  });

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