const router = require("express").Router();
const Video = require("../../../models/Video");
const createError = require("../../../error");

// liking video
router.put('/likes/:videoId', async (req, res, next) => {
    const id = req.user.id;
    const videoId = req.params.videoId;
    try {
        await Video.findByIdAndUpdate(videoId, {
            $addToSet: { likes: id },
            $pull:{dislikes:id}
        });
        res.status(200).json("The video has been liked");
    } catch (error) {
        next(error)
    }
})

// disliking video
router.put('/dislikes/:videoId', async (req, res, next) => {
    const id = req.user.id;
    const videoId = req.params.videoId;
    try {
        await Video.findByIdAndUpdate(videoId, {
            $addToSet: { dislikes: id },
            $pull:{likes:id}
        });
        res.status(200).json("The video has been disliked");
    } catch (error) {
        next(error)
    }
})

module.exports = router;