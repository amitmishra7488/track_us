const mongoose = require('mongoose');

const expenditureSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model for user information
        required: true
    },
    category: {
        type: String,
        enum: ['invest', 'spend', 'lend', 'other'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'completed'],
        default: function () {
            return this.category === 'lend' ? 'pending' : 'completed';
        },
    },
    amount: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const expenditureModel = mongoose.model('Expenditure', expenditureSchema);

module.exports = expenditureModel;
