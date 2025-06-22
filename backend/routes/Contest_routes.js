const express=require('express');
const router=express.Router();
const {
    Get_Codeforces_Contest
}=require('../controllers/codeforces_contest_controller')

const {
    Get_CodeChef_Contest
} = require('../controllers/codechef_contest_controller')

const {
   Get_LeetCode_Contests
} = require('../controllers/Leetcode_contest_controller');

const{
    Get_All_Contests
}=require('../controllers/Combined_contest_controller')

router.route('/codeforces_contest').get(Get_Codeforces_Contest);

router.route('/codechef_contest').get(Get_CodeChef_Contest);

router.route('/leetcode_contest').get(Get_LeetCode_Contests);

router.route('/get_all_contest').get(Get_All_Contests);

module.exports = router;