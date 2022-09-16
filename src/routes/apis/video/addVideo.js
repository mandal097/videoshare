const router = require("express").Router();
const Video = require("../../../models/Video");
const createError = require("../../../error");

// add video
router.post('', async (req, res, next) => {
    const newVideo = new Video({ userId: req.user.id, ...req.body })
    try {
        const savedVideo = await newVideo.save();
        res.status(200).json(savedVideo);
    } catch (error) {
        next(error)
    }
})

module.exports = router;