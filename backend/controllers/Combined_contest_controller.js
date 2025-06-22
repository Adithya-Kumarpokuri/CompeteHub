const ErrorHandler = require("../utills/Errorhandler");
const catchAsyncErrors = require("../utills/catchAsyncErrors");

const { fetchLeetCodeContests } = require("./Leetcode_contest_controller");
const { fetchCodeChefContests } = require("./codechef_contest_controller");
const { fetchCodeforcesContests } = require("./codeforces_contest_controller");

exports.Get_All_Contests = catchAsyncErrors(async (req, res, next) => {
  
  try {

    let promises = [];
    if (!req.query.filter) {
      promises = [
      fetchCodeforcesContests(),
      fetchCodeChefContests(),
      fetchLeetCodeContests(),
      ];
    } else {
      const filters = req.query.filter.split(',');
      if (filters.includes('codeforces')) {
      promises.push(fetchCodeforcesContests());
      }
      if (filters.includes('codechef')) {
      promises.push(fetchCodeChefContests());
      }
      if (filters.includes('leetcode')) {
      promises.push(fetchLeetCodeContests());
      }
    }

    const [codeforcesData, codechefData, leetcodeData] = await Promise.all(promises);

    const current_contests = [
      ...(codeforcesData?.current_contests || []),
      ...(codechefData?.current_contests || []),
      ...(leetcodeData?.current_contests || []),
    ];

    const upcoming_contests = [
      ...(codeforcesData?.upcoming_contests || []),
      ...(codechefData?.upcoming_contests || []),
      ...(leetcodeData?.upcoming_contests || []),
    ];

    const past_contests = [
      ...(codeforcesData?.past_contests || []),
      ...(codechefData?.past_contests || []),
      ...(leetcodeData?.past_contests || []),
    ];

    res.status(200).json({
      success: true,
      data: {
        current_contests,
        upcoming_contests,
        past_contests,
      },
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});
