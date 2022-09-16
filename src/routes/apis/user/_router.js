const router = require("express").Router();

const auth = require("../../../middlewares/auth");

const userRegister = require("./auth/signup");
const userLogin = require("./auth/signin");
const updateProfile = require("./updateProfile");
const getProfile = require("./getProfile");
const deleteUser = require("./deleteUser");
const subscribeChannel = require("./subcribe");



// user signup 
router.use('/auth/signup', userRegister);

// user signin
router.use('/auth/signin', userLogin);

// user update
router.use('/update/:id', auth, updateProfile);

// user delete
router.use('/delete', auth, deleteUser);

// get user
router.use('/find', getProfile);

// subscribe a user
router.use('/subscribe', auth, subscribeChannel);


// // like a video
// router.use('/like/:videoid', likevideo);

// // dislike a video
// router.use('/dislike/:videoid', dislikeVideo);

module.exports = router;