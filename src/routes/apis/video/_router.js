const router = require("express").Router();
const auth = require("../../../middlewares/auth");

const addVideo = require('./addVideo');
const updateVideo = require('./updateVideo');
const deleteVideo = require('./deleteVideo');
const getVideo = require('./getVideo');
const subscribedVideos = require('./subscribedVideos');
const likeDislikes = require('./likeDislike');
const videoDetails = require('./videoDetails');
const videosByTags = require('./getVideoBytag');
const searchVideos = require('./searchVid');


// get video
router.use('/find', getVideo);

// details of video
router.use('/vid-f', videoDetails);

// get videos by tags
router.use('/tags', videosByTags);

// search videos
router.use('/search', searchVideos);



// add video
router.use('/', auth, addVideo);

// update video
router.use('/update', auth, updateVideo);

// delete video
router.use('/delete', auth, deleteVideo);

// subscribed videos
router.use('/subs', auth, subscribedVideos);

// like-dislikes videos
router.use('/vid-l', auth, likeDislikes);

module.exports = router;