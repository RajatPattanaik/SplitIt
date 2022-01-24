const mongoose = require('mongoose');
const Person = require('../models/Person');
const firstname = require('./names/firstname');
const lastname = require('./names/lastname');

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

const save =[];

const seedDB = async () => {
    await Person.deleteMany({});
    for(let i=0; i<50; i++ ) {
        const first = Math.floor(Math.random() * 2500);
        const last = Math.floor(Math.random() * 1000) ;
        const person = new Person({
            name: `${firstname[first]}`,
            last : `${lastname[last]}`
        });
        await person.save();
        save.push(person);
    }
}

const randomfriends = async () => {
    for(let i=0; i<50; i++){
        const person = await Person.findOne({friends : []});
        for(let j=0 ; j<10; j++){
            const num = Math.floor(Math.random() * 50);
            if(save[num]._id !== person._id){
                person.friends.push(save[num]);
            }
        }
        await person.save();
    }
}

seedDB().then(randomfriends).then(() => {
    mongoose.connection.close();
})

module.exports = save;

