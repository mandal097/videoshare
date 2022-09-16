const router = require('express').Router();

const userRoutes = require("./apis/user/_router");
const commentsRoutes = require("./apis/comments/_router");
const videosRoutes = require("./apis/video/_router");

router.use('/user', userRoutes);

router.use('/comments', commentsRoutes);

router.use('/videos', videosRoutes);

module.exports = router;