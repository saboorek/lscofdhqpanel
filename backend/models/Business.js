const mongoose = require('mongoose');

const BusinessSchema = new mongoose.Schema({
    name: { type: String, required: true },
    owner: { type: String, required: true },
    address: { type: String },
    notes: { type: String, default: '' },
    url: {type: String, require: true},
}, { timestamps: true });

module.exports = mongoose.model('Business', BusinessSchema);