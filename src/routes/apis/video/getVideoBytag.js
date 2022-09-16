const router = require("express").Router();
const Video = require("../../../models/Video");
// const createError = require("../../../error");

// getting videos by tags
router.get('', async (req, res, next) => {
    const tags = req.query.tags.split(",");
    // console.log(tags);
    try {
        const videos = await Video.find({ tags: { $in: tags } }).limit(20);
        res.status(200).json(videos);
    } catch (error) {
        next(error)
    }
});

module.exports = router;