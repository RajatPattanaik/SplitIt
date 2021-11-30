const express = require('express');
const app = express();
const ejsMate = require('ejs-mate');
const path = require('path');
const Group = require('./models/Group');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const Person = require('./models/Person');
mongoose.connect('mongodb://localhost:27017/SplitIt', 
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

app.use(express.urlencoded({extended : true}));
app.use(methodOverride('_method'));

app.engine('ejs' , ejsMate);

app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname , 'public')));

app.get('/home' , (req,res) => {
    res.render('home');
})

app.post('/home',async (req,res) => {
    try{
        console.log(req.body);
        const {username, name, members, membersName} = req.body.Group;
        let admin = await Person.findOne({name: username});
        if(!admin){
            admin = new Person({name: username});
        }
        console.log(`Admin = ${admin}`);
        const num = Number(members)+1; 
        const group = new Group({username:admin,name: name,members:num});
        group.membersName.push(admin);
        for(let memberName of membersName){
            let member = await Person.findOne({name: memberName});
            if(!member){
                member = new Person({name : memberName});
            }
            group.membersName.push(member);
            member.groups.push(group);
            await member.save();
        }
        await group.save();
        await admin.save();
        res.redirect(`/groups/${group._id}`);
    }catch(error){
        console.log(error);
        res.send("Somthing went wrong!");
    }
});

app.get('/create' , (req,res) => {
    res.render('Group/create');
})

app.get('/groups', async (req,res) => {
    const groups = await Group.find({});
    res.render('Group/index', {groups} );
});

app.get('/groups/:id', async(req,res) => {
    const group = await Group.findById(req.params.id).populate('membersName').populate('username');
    res.render('Group/show', {group})
})

app.put('/groups/:id', async(req,res) => {
    try{
        const { id } = req.params;
        const people = req.body.Group;
        const username = await Person.findOne({name :people.username.trim()});
        console.log(`USERNAME = ${username}`);
        const membersName=[];
        for(let member of people.membersName){
            const person = await Person.findOne({name : member});
            if(person){
                membersName.push(person);
            }
        }
        const group = await Group.findByIdAndUpdate(id,{username : username, membersName: membersName, members:people.members, name: people.name });
        console.log(group);
        await group.save();
        res.redirect(`/groups`)
    }catch(error){
        console.log(error);
    }
})


app.delete('/groups/:id', async(req,res) => {
    const { id } = req.params;
    await Group.findByIdAndDelete(id);
    res.redirect('/groups');
})

app.get('/groups/:id/edit', async (req,res) => {
    const { id } = req.params;
    const group = await Group.findById(id).populate('membersName').populate('username');
    if(!group){
        return res.redirect('/groups');
    }
    res.render('Group/edit' , {group});
})

app.get('/groups/person/:id', async (req,res) => {
    const person = await Person.findById(req.params.id).populate('friends').populate('groups');
    res.render('Group/profile', {person})
})

app.listen(3000, () => {
    console.log("On port 3000");
})