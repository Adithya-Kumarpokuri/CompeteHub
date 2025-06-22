const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    contest_ids: {
        type: [String],
        required: true
    }
});

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

module.exports = Bookmark;