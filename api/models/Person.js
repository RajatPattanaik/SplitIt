const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const personSchema = new Schema({
    name: String,
    last: String,
    friends : [{
        type: Schema.Types.ObjectId,
        ref:'Person'
    }],
    groups : [{
        type: Schema.Types.ObjectId,
        ref: 'Group'
    }]
});

module.exports = mongoose.model('Person',personSchema);