const Person = require('../models/Person');
const Group = require('../models/Group');

exports.homePage = async (req,res) => {
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
}

exports.fetchAllGroups =  async (req,res) => {
    try{
        const groups = await Group.find({});
        if(groups.length() !== 0){
            return res.render('Group/index', {groups} );
        }
        res.send("Groups not Found");
    }catch(error){
        console.log(error);
        res.send('Error');
    }
}

exports.updateGroup = async(req,res) => {
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
}

exports.deleteGroup =  async(req,res) => {
    try{
        const { id } = req.params;
        await Group.findByIdAndDelete(id);
        res.redirect('/group');
    }catch(error){
        console.log(error);
        res.send("Error")
    }
}

exports.fetchGroup = async(req,res) => {
    try{
        const group = await Group.findById(req.params.id).populate('membersName').populate('username');
        if(group.length !== 0){
            return res.render('Group/show', {group})
        }
        res.send("Group not Found");
    } catch(error){
        console.log(error);
        res.send("ERROR");
    }
}

exports.editGroup = async (req,res) => {
    try{
        const { id } = req.params;
        const group = await Group.findById(id).populate('membersName').populate('username');
        if(!group){
            return res.redirect('/groups');
        }
        res.render('Group/edit' , {group});
    } catch(error){
        console.log(error);
        res.send("ERROR");
    }
}