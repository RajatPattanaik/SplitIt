const Person = require('../models/Person');

exports.personProfile = async (req,res) => {
    try{
        const person = await Person.findById(req.params.id).populate('friends').populate('groups');
        if(person){
            return res.render('Group/profile', {person})
        }
        res.send("User not Found")
    }catch(error){
        console.log(error);
        res.send("ERROR")
    }
}