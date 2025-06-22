const ErrorHandler = require("../utills/Errorhandler");
const catchAsyncErrors = require("../utills/catchAsyncErrors");
const Bookmark = require("../models/bookmark_schema");

exports.Get_Bookmarks_By_Email = catchAsyncErrors(async (req, res, next) => {
    try {
        const { email } = req.query;
        let bookmark = await Bookmark.findOne({ email });
        if (!bookmark) {
            return res.status(404).json({
                success: false,
                message: "No bookmarks found for this email"
            });
        }

        res.status(200).json({
            success: true,
            bookmarks: bookmark.contest_ids
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});