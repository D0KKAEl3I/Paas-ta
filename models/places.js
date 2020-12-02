const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
    placeName : {type: String, required: true},
    lat : {type:Number, required: true},
    lon : {type:Number, required: true} 
}, {timestamps: true})

module.exports =  mongoose.model('place', placeSchema)