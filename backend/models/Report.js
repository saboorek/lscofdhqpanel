const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    businessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business', // Zakładając, że masz model Business
        required: true
    },
    controlDate: {
        type: Date,
        required: true
    },
    inspector: {
        type: String,
        required: true
    },
    controlPassed: {
        type: Boolean,
        required: true
    },
    controlDescription: {
        type: String,
        required: true
    },
    alarmService: {
        type: Boolean,
        required: true
    },
    controlType: {
        type: String,
        enum: ['Planowana', 'Nieplanowana'],
        required: true
    }
});

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;