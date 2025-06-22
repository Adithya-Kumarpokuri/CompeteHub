const ErrorHandler = require("../utills/Errorhandler");
const catchAsyncErrors = require("../utills/catchAsyncErrors");
const Youtubelinks = require("../models/youtubelinks_schema");

exports.Add_youtubeLink = catchAsyncErrors(async (req, res, next) => {
    try {
        const { contest_id, youtubelink } = req.body;
        let youtubeLink = await Youtubelinks.findOne({ contest_id });

        if (youtubeLink) {
            youtubeLink.youtubelink = youtubelink;
            await youtubeLink.save();
        } else {
            youtubeLink = new Youtubelinks({ contest_id, youtubelink });
            await youtubeLink.save();
        }
        res.status(200).json({
            success: true,
            youtubeLink
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});