const router = require('express').Router();
// const createError = require('../../../error');
const User = require('../../../models/User');

router.put('/sub/:id', async (req, res, next) => {
    try {
        const { id } = req.user;
        await User.findByIdAndUpdate(id, {
            $push: { subscribedUsers: req.params.id }
        });

        await User.findByIdAndUpdate(req.params.id, {
            $inc: { subscribers: 1 }
        });

        res.status(200).json('Subsription successfull')
    } catch (error) {
        next(error)
    }
})

router.put('/unsub/:id', async (req, res, next) => {
    try {
        const { id } = req.user;
        await User.findByIdAndUpdate(id, {
            $pull: { subscribedUsers: req.params.id }
        });

        await User.findByIdAndUpdate(req.params.id, {
            $inc: { subscribers: -1 }
        })
        res.status(200).json('Unsubsription successfull')
    } catch (error) {
        next(error)
    }
})

module.exports = router;