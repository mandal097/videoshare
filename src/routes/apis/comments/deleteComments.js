const router = require("express").Router();
const Comments = require('../../../models/Comments');
const Video = require('../../../models/Video');
const createError = require("../../../error");

// add video
router.delete('/:id', async (req, res, next) => {
    try {
        const comment = await Comments.findById(req.params.id);
        const video = await Video.find({ videoId: req.body.videoId });
        // console.log(req.user.id);
        // console.log(comment);
        // console.log(video);
        if (req.user.id === comment.userId || req.user.id === video.userId) {
            await Comments.findByIdAndDelete(req.params.id)
            res.status(200).json("The comment has been deleted.")
        } else {
            return next(createError(403, "You can delete only your comments."))
        }
    } catch (error) {
        next(error)
    }
})

module.exports = router;