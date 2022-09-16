const router = require("express").Router();
const Comments = require('../../../models/Comments');
const createError = require("../../../error");

// add video
router.post('', async (req, res, next) => {
    const newComments = new Comments({ ...req.body, userId: req.user.id })
    try {
        const savedComments = await newComments.save();
        res.status(200).json(savedComments);
    } catch (error) {
        next(error)
    }
})

module.exports = router;