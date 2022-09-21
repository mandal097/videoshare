const router = require("express").Router();
const Video = require("../../../models/Video");
const createError = require("../../../error");

// get channel videos
router.get('/:id', async (req, res, next) => {
    try {
        const video = await Video.find({userId:req.params.id});
        res.status(200).json(video);
    } catch (error) {
        next(error)
    }
})

module.exports = router;