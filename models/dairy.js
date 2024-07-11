const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const dairySchema = mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    document: {
        type: String,
        required: true
    },
    user: {
        type: ObjectId,
        ref: "Users"
    }
    }
)

const Dairy = mongoose.model("Dairy", dairySchema);

module.exports = Dairy;