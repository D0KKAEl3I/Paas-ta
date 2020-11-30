const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    filename: {type: String, required: true, unique: true}
}, {timestamps: true})

module.exports = mongoose.model('imageLink', imageSchema)