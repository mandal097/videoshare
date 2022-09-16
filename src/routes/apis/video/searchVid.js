const router = require("express").Router();
const Video = require("../../../models/Video");
// const createError = require("../../../error");

// searching videos
router.get('', async (req, res, next) => {
    const query = req.query.q;
    try {
        const videos = await Video.find({
            title: { $regex: query, $options: '$i'},
        }).limit(20);
        res.status(200).json(videos);
    } catch (error) {
        next(error)
    }
});


module.exports = router;