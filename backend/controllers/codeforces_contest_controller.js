const ErrorHandler = require("../utills/Errorhandler");
const catchAsyncErrors = require("../utills/catchAsyncErrors");

function formatTimestamp(unixTimestamp) {
    const date = new Date(unixTimestamp * 1000);
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
  
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
  
    return `${day} ${month} ${year} ${hours}:${minutes}:${seconds}`;
  }
  
  async function fetchCodeforcesContests() {
    const url = "https://codeforces.com/api/contest.list";
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch Codeforces contests. Status: ${response.status}`);
    }
  
    const data = await response.json();
    const rawContests = data.result || [];
    const currentTime = Math.floor(Date.now() / 1000);
  
    const transformedContests = rawContests.map((contest) => {
      const endTime = contest.startTimeSeconds + contest.durationSeconds;
      return {
        Name: contest.name,
        Platform: "Codeforces",
        Duration: (contest.durationSeconds / 3600).toFixed(2) + " hours",
        "Start Time": formatTimestamp(contest.startTimeSeconds),
        Contest_id: `${contest.id}`,
        starttimeint: contest.startTimeSeconds,
        endTimeInt: endTime,
      };
    });
  
    const currentContests = transformedContests.filter(
      (c) => c.starttimeint <= currentTime && c.endTimeInt > currentTime
    );
    const upcomingContests = transformedContests.filter(
      (c) => c.starttimeint > currentTime
    );
    const pastContests = transformedContests.filter(
      (c) => c.endTimeInt <= currentTime
    );
  
    return {
      current_contests: currentContests,
      upcoming_contests: upcomingContests,
      past_contests: pastContests,
    };
  }
  
  exports.Get_Codeforces_Contest = catchAsyncErrors(async (req, res, next) => {
    try {
      const result = await fetchCodeforcesContests();
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });
  
  exports.fetchCodeforcesContests = fetchCodeforcesContests;