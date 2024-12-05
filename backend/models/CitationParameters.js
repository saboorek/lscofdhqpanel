const mongoose = require('mongoose');

const citationParametersSchema = new mongoose.Schema({
    description: { type: String, required: true },
    amount: { type: Number, required: true },
});

module.exports = mongoose.model('CitationParameters', citationParametersSchema);