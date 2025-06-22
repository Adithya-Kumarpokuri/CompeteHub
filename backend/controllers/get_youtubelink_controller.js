const ErrorHandler = require("../utills/Errorhandler");
const catchAsyncErrors = require("../utills/catchAsyncErrors");
const Youtubelinks = require("../models/youtubelinks_schema");

exports.Get_YoutubeLink = catchAsyncErrors(async (req, res, next) => {
    try {
        let youtubeLinks = await Youtubelinks.find({});

        if (youtubeLinks.length > 0) {
            const response = youtubeLinks.map(link => ({
            contest_id: link.contest_id,
            youtubelink: link.youtubelink
            }));
            res.status(200).json({
            success: true,
            links: response
            });
        } else {
            res.status(404).json({
            success: false,
            message: "No YouTube links found"
            });
        }
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});