const router = require('express').Router();
const User = require('../../../models/User');


router.delete('', async (req, res, next) => {
    try {
        const deleteUser = await User.findByIdAndDelete(req.user.id);
        res.status(201).json({
            status: 'success',
            msg: 'Deleted Successfully',
            data: deleteUser
        })
    } catch (error) {
        next(error)
    }
})



module.exports = router;