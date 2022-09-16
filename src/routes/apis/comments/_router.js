const router = require("express").Router();
const auth = require("../../../middlewares/auth");

const getComments = require("./getComments");
const deleteComments = require("./deleteComments");
const addComments = require("./addComments");

// get comments
router.use('/find', getComments);

// add comments
router.use('/', auth, addComments);

// delete comments
router.use('/delete', auth, deleteComments);


module.exports = router;