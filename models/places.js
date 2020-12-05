const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    comment: { type: String, required: true }
})

const placeSchema = new mongoose.Schema({
    placeName: { type: String, required: true },
    lat: { type: Number, required: true },
    lon: { type: Number, required: true },
    comments: [commentSchema]
}, { timestamps: true })

exports.placeModel = mongoose.model('place', placeSchema)
exports.commentModel = mongoose.model('comment', commentSchema)