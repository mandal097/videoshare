const createError = require('../../../error');
const User = require('../../../models/User');
const bcrypt = require('bcryptjs');
const router = require('express').Router();

router.put('', async (req, res, next) => {
    if (req.body.password) {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        req.body.password = hashedPassword
    }
    try {
        const updatedUser = await User.findOneAndUpdate(req.user.id,
            {
                $set: req.body
            },
            { new: true });

        const { password, ...others } = updatedUser._doc;
        res.status(201).json(others)

    } catch (error) {
        next(error);
    }

})

module.exports = router;