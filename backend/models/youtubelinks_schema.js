const mongoose = require('mongoose');

const youtubelinksSchema = new mongoose.Schema({
    contest_id: {
        type: String,
        required: true
    },
    youtubelink: {
        type: String,
        required: true
    }
});

const Youtubelinks = mongoose.model('Youtubelinks', youtubelinksSchema);

module.exports = Youtubelinks;