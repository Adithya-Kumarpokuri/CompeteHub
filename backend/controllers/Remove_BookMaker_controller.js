const ErrorHandler = require("../utills/Errorhandler");
const catchAsyncErrors = require("../utills/catchAsyncErrors");
const Bookmark = require("../models/bookmark_schema");

exports.Remove_BookMark_Contest = catchAsyncErrors(async (req, res, next) => {
    try {
        const { Contest_id, email } = req.body;

        let bookmark = await Bookmark.findOne({ email });

        if (!bookmark) {
            return res.status(400).json({
                success: false,
                message: "User does not exist"
            });
        }

        const contestIndex = bookmark.contest_ids.indexOf(Contest_id);

        if (contestIndex === -1) {
            return res.status(400).json({
                success: false,
                message: "Contest_id does not exist in the bookmark"
            });
        }

        // Remove the Contest_id from the array
        bookmark.contest_ids.splice(contestIndex, 1);

        await bookmark.save();

        res.status(200).json({
            success: true,
            message: "Bookmark removed successfully",
            bookmark
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});