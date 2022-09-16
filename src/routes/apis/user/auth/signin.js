const router = require('express').Router();
const User = require('../../../../models/User');
const bcrypt = require('bcryptjs');
const generateToken = require('../../../../helpers/generateToken');
const createError = require('../../../../error');

router.post('', async (req, res, next) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            res.status(404).json({
                status: 'err',
                msg: 'Please add all fields'
            })
        } else {
            const user = await User.findOne({ email });
            if (!user) {
                next(createError(404, "User not found"))
            } else {
                const isMatched = await bcrypt.compare(password, user.password);
                if (!isMatched) {
                    next(createError(404, "Invalid Credentials"))
                } else {
                    const accessToken = generateToken({ id: user._id, email: email })
                    const { password, ...others } = user._doc;
                    // res.cookie("access_token", accessToken, {
                    //     httpOnly: true
                    // }).status(200).json(others);
                    res.status(201).json({
                        status: 'success',
                        msg: 'Successfully Logged In',
                        token: accessToken,
                        user: others
                    })
                }
            }
        }
    } catch (error) {
        next(error)
    }
})

module.exports = router;