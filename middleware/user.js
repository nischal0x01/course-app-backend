const { User } = require("../db")
const jwt = require("jsonwebtoken")
const { JWT_SECRET } = require("../config");
function userMiddleware(req, res, next) {
    // Implement user auth logic
    // You need to check the headers and validate the user from the user DB. Check readme for the exact headers to be expected
    // const username = req.headers.username;
    // const password = req.headers.password;
    // User.findOne({
    //     username: username,
    //     password: password
    // }).then(function (value) {
    //     if (value) {
    //         next();
    //     }
    //     else {
    //         res.status(403).json({
    //             msg: "User doen't exist"
    //         })
    //     }
    // })
    const token = req.headers.authorization
    const jwtToken = token.split(" ")[1]
    const decodecValue = jwt.verify(jwtToken, JWT_SECRET)
    if (decodecValue.username) {
        req.username = decodecValue.username;

        next()
    }
    else {
        res.status(403).json({
            msg: "You are not authenticated"
        })
    }


}

module.exports = userMiddleware;