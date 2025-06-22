const express=require('express');
const router=express.Router();
const {
    BookMark_Contest
} = require('../controllers/bookMark_controller');

const {
    Remove_BookMark_Contest
} = require('../controllers/Remove_BookMaker_controller')

const {
    Get_Bookmarks_By_Email
} = require('../controllers/Get_myBookmarks_controller')

router.route('/bookMark_contest').post(BookMark_Contest);

router.route('/remove_bookmark_contest').post(Remove_BookMark_Contest);

router.route('/myBookmarks').get(Get_Bookmarks_By_Email);

module.exports = router;