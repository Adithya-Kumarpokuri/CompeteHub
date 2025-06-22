const express=require('express');
const router=express.Router();
const {
    Add_youtubeLink
}=require('../controllers/youtubelink_controller')

const {
   Get_YoutubeLink
}= require('../controllers/get_youtubelink_controller');

router.route('/add_youtubeLink').post(Add_youtubeLink);

router.route('/get_youtubeLink').get(Get_YoutubeLink);

module.exports = router;