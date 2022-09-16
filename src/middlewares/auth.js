const jwt = require("jsonwebtoken");
const createError = require("../error");

const auth = (req, res, next) => {
    const authHeaders = req.headers.token;
    // const token = req.cookies.access_token;
    // if (token) {
    if (authHeaders) {
        const token = authHeaders.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
            if (err) {
                next(createError(404, "Invalid Token!"));
            }
            req.user = user;
            next()
        })
    } else {
        next(createError(401, "You must have to logged in"))
    }
};

module.exports = auth;