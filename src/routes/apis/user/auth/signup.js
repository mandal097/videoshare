const router = require("express").Router();
const User = require("../../../../models/User");
const bcrypt = require("bcryptjs");
const createError = require("../../../../error");

// user register
router.post('', async (req, res, next) => {
    const { name, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            res.status(404).json({
                status: 'err',
                msg: 'Please add all fields'
            })
        } else {
            const user = await User.findOne({ email });
            if (!user) {
                const hashPassword = await bcrypt.hashSync(password, 10);
                const newUser = new User({
                    name,
                    email,
                    password: hashPassword
                })
                await newUser.save();
                res.status(201).json({
                    status: 'success',
                    msg: 'User added Successfully',
                    user: newUser
                })
            } else {
                // res.status(404).json({
                //     status: 'err',
                //     msg: 'User already exists'
                // })
                next(createError(404, "User already exists"))
            }

        }
    } catch (error) {
        next(error)
        // res.status(501).json({
        //     status: 'err',
        //     msg: `Server error-${error} `
        // })
    }
})

module.exports = router;