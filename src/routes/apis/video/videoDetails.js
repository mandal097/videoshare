const router = require("express").Router();
const Video = require("../../../models/Video");
// const createError = require("../../../error");

// handle views
router.put('/views/:id', async (req, res, next) => {
    try {
        await Video.findByIdAndUpdate(req.params.id, {
            $inc: { views: 1 }
        });
        res.status(200).json('Views has been increased');
    } catch (error) {
        next(error)
    }
})

// trending videos
router.get('/trend', async (req, res, next) => {
    try {
        const videos = await Video.find().sort({ views: -1 })
        res.status(200).json(videos);
    } catch (error) {
        next(error)
    }
})

// random videos
router.get('/random', async (req, res, next) => {
    try {
        const videos = await Video.aggregate([{ $sample: { size: 40 } }]);
        res.status(200).json(videos);
    } catch (error) {
        next(error)
    }
})

module.exports = router;