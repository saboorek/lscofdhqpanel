const mongoose = require('mongoose');

const CitationSchema = new mongoose.Schema({
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business',
        required: true
    },
    citationDate: {
        type: Date,
        required: true
    },
    citationAmount: {
        type: Number,
        required: true
    },
    citationReason: {
        type: String,
        required: true
    },
});

const Citation = mongoose.model('Citation', CitationSchema);

module.exports = Citation;