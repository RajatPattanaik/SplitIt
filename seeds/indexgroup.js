const mongoose = require('mongoose');
const Person = require('../models/Person');
const Group = require('../models/Group');
const groupName = require('./names/groupname');

mongoose.connect('mongodb://localhost:27017/SplitIt', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console,"Connection Error!"));
db.once('open', () => {
    console.log("Database connection")
});

const seedDB = async () => {
    await Group.deleteMany({});
    const people = await Person.find({}).populate('friends');
    for(let i=0;i<50;i++){
        const person = await Person.findOne({groups : []});
        if(person){
            const random = Math.floor(Math.random() * 10 + 1) + 1;
            const randomName = Math.floor(Math.random() * 380);
            const group = new Group({username:person , members : random, name: groupName[randomName], membersName : [person]})
            for(let j=0; j<random - 1; j++){
                const randomMember = Math.floor(Math.random() * 50);
                group.membersName.push(people[randomMember]);
                const randperson = await Person.findOne({_id:people[randomMember]._id});
                randperson.groups.push(group);
                await randperson.save();
            }
            person.groups.push(group);
            await group.save();
            await person.save();
        }else{
            break;
        }
    }

}

seedDB().then(() => {
    mongoose.connection.close();
});