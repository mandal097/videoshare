const generateToken = require('../../../../helpers/generateToken');
const User = require('../../../../models/User');

const router = require('express').Router();

router.post('', async (req, res, next) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            const newUser = new User({
                ...req.body,
                fromGoogle: true
            })
            const savedUser = await newUser.save()

            const accessToken = generateToken({ id: savedUser._id, email: email });


            res.status(201).json({
                status: 'success',
                msg: 'Successfully Logged In',
                token: accessToken,
                user: savedUser._doc
            })
        } else {
            const accessToken = generateToken({ id: user._id, email: email });

            res.status(201).json({
                status: 'success',
                msg: 'Successfully Logged In',
                token: accessToken,
                user: user._doc
            })
        }
    } catch (error) {
        next(error)
    }
})

module.exports = router;