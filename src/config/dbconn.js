const mongoose = require("mongoose");

const { MONGO_PASS, MONGO_USER } = process.env;
const mongo_uri = `mongodb+srv://${MONGO_USER}:${MONGO_PASS}@cluster0.f95lwsg.mongodb.net/?retryWrites=true&w=majority`

mongoose.connect(mongo_uri, {
    UseNewUrlParser: true,
}).then(() => {
    console.log(`connection successfull...`);
}).catch((err) => {
    console.log(`connetion failed.. ${err}`);
});

