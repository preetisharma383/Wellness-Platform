const mongoose = require('mongoose');
const SessionSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: String,
    tags: [String],
    json_file_url: String,
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});
SessionSchema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
});
module.exports = mongoose.model('Session', SessionSchema);