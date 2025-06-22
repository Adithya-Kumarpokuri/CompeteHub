const ErrorHandler = require("../utills/Errorhandler");
const catchAsyncErrors = require("../utills/catchAsyncErrors");


function convertToUnixTimestamp(isoString) {
    const dateObj = new Date(isoString);
    return Math.floor(dateObj.getTime() / 1000);
  }

  async function fetchCodeChefContests() {
    const url = "https://www.codechef.com/api/list/contests/all";
    const response = await fetch(url);
  
    if (!response.ok) {
      throw new Error(`Failed to fetch CodeChef contests. Status: ${response.status}`);
    }
  
    const data = await response.json();

    function transformContest(contest) {
        const startTimeSeconds = convertToUnixTimestamp(contest.contest_start_date_iso);
        const durationSeconds = Number(contest.contest_duration) * 60;
        const endTimeSeconds = startTimeSeconds + durationSeconds;
    
        return {
          Name: contest.contest_name,
          Platform: "Codechef",
          Duration: (Number(contest.contest_duration) / 60) + " hours",
          "Start Time": contest.contest_start_date,
          Contest_id: contest.contest_code,
          starttimeint: startTimeSeconds,
          endTimeInt: endTimeSeconds, // Used to filter contests
        };
      }

    const presentContests = (data.present_contests || []).map(transformContest);
    const futureContests = (data.future_contests || []).map(transformContest);
    const pastContests = (data.past_contests || []).map(transformContest);

    return {
        current_contests: presentContests,
        upcoming_contests: futureContests,
        past_contests: pastContests,
      };
  }

  exports.Get_CodeChef_Contest = catchAsyncErrors(async (req, res, next) => {
    try {
      const result = await fetchCodeChefContests();
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

exports.fetchCodeChefContests = fetchCodeChefContests;