const router = require('express').Router();
const createError = require('../../../error');
const User = require('../../../models/User');

router.get('/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const user = await User.findById({ _id: id }).select('-password');
        if (!user) {
            next(createError(404, "User not found"))
        } else {
            res.status(200).json({
                status: 'success',
                msg: 'User found',
                user: user
            })
        }
    } catch (error) {
        next(error)
    }
})

module.exports = router;