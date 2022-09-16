const router = require("express").Router();
const Video = require("../../../models/Video");
const createError = require("../../../error");
const User = require("../../../models/User");

// subscribed videos
router.get('', async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const subscribedChannel = user.subscribedUsers;

        const list = await Promise.all(
            subscribedChannel.map(channelId => {
                return Video.find({ userId: channelId });
            })
        )
        res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt));

    } catch (error) {
        next(error)
    }
});

module.exports = router;