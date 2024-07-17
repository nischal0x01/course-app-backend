const { Admin } = require("../db")
const jwt = require("jsonwebtoken")
const secret = require("../index")
const { JWT_SECRET } = require("../config")
// Middleware for handling auth
function adminMiddleware(req, res, next) {
    // const username = req.headers.username;
    // const password = req.headers.password;
    // Admin.findOne({
    //     username: username,
    //     password: password
    // }).then(function (value) {
    //     if (value) {
    //         next();
    //     }
    //     else {
    //         res.status(403).json({
    //             msg: "Admin doesn't exist"
    //         })
    //     }
    // })
    // using jwt
    const token = req.headers.authorization
    const jwtToken = token.split(" ")[1]
    const decodecValue = jwt.verify(jwtToken, JWT_SECRET)
    if (decodecValue.username) {
        next()
    }
    else {
        res.status(403).json({
            msg: "You are not authenticated"
        })
    }



}

module.exports = adminMiddleware;