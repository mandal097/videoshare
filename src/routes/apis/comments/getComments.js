const router = require("express").Router();
const Comments = require('../../../models/Comments');
// const createError = require("../../../error");

// add video
router.get('/:videoId', async (req, res, next) => {
    try {
        const comments = await Comments.find({ videoId: req.params.videoId });
        res.status(200).json(comments)
    } catch (error) {
        next(error)
    }
})

module.exports = router;