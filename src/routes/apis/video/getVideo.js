const router = require("express").Router();
const Video = require("../../../models/Video");
const createError = require("../../../error");

// get video
router.get('/:id', async (req, res, next) => {
    try {
        const video = await Video.findById(req.params.id);
        res.status(200).json(video);
    } catch (error) {
        next(error)
    }
})

module.exports = router;