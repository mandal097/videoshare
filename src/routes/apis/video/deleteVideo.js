const router = require("express").Router();
const Video = require("../../../models/Video");
const createError = require("../../../error");

// add video
router.delete('/:id', async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) return next(createError(404, "Video not found"));
        if (req.user.id === video.userId) {
            const deleteVideo = await Video.findByIdAndDelete(req.params.id)
            res.status(200).json("video has been deleted");
        } else {
            return next(createError(403, "You can update only your video"))
        }
    } catch (error) {
        next(error)
    }
})

module.exports = router;