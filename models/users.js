const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    title : {type: String, required: true},
    body : {type:String, required: true}
}, {timestamps: true})

const userSchema = new mongoose.Schema({
    name : {type: String, required: true, unique: true},
    password : {type: String, required: true},
    reports : [reportSchema]
}, {timestamps: true})

exports.userModel = mongoose.model('user', userSchema)
exports.reportModel = mongoose.model('report', reportSchema)