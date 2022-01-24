const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const groupSchema = new Schema({
    username: {
        type: Schema.Types.ObjectId,
        ref:'Person'
    },
    name: String,
    members: Number,
    membersName:[{
        type: Schema.Types.ObjectId,
        ref: 'Person'
    }],
    total: Number,
    expenses:[Number]
});

module.exports = mongoose.model('Group', groupSchema);