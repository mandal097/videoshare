const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");

dotenv.config();
require("./src/config/dbconn")

const baseRouter = require('./src/routes/router');

const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// error handling
app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "something went wrong";
    return res.status(status).json({
        success: false,
        status,
        message
    })
})

app.get('/', async (req, res) => {
    res.send(`Welcome to Video sharing App little like youTube  <br> You are at API Side`);
});
app.get('/api/v1', async (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'amar.html'), function (err) {
        if (err) {
            res.status(500).send(err)
        }
    })
});

app.use('/api/v1', baseRouter)

app.listen(port, () => {
    console.log(`server is running at port no. ${port} `);
})