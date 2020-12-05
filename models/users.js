const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    title: { type: String, required: true },
    body: { type: String, required: true }
}, { timestamps: true })

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    id: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    salt: { type: String, required: true },
    hash_password: { type: String, required: true },
    reports: [reportSchema]
}, { timestamps: true })

exports.userModel = mongoose.model('user', userSchema)
exports.reportModel = mongoose.model('report', reportSchema)