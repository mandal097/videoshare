const router = require("express").Router();
const Video = require("../../../models/Video");
const createError = require("../../../error");

// add video
router.put('/:id', async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) return next(createError(404, "Video not found"));
        if (req.user.id === video.userId) {
            const updatedVideo = await Video.findByIdAndUpdate(req.params.id,
                {
                    $set: req.body,
                },
                { new: true },
            )
            res.status(200).json(updatedVideo);
        } else {
            return next(createError(403, "You can update only your video"))
        }
    } catch (error) {
        next(error)
    }
})

module.exports = router;