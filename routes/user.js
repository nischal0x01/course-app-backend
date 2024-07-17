const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../db");
const { JWT_SECRET } = require("../config")
const jwt = require("jsonwebtoken")


// User Routes
router.post('/signup', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.create({
        username,
        password
    })
    res.json({
        msg: "User created successfully"
    })

});
router.post('/signin', async (req, res) => {
    const username = req.body.username
    const password = req.body.password

    const user = await User.find({
        username,
        password
    })
    if (user) {
        const token = jwt.sign({ username }, JWT_SECRET)
        res.send({
            token
        })
    }
    else {
        res.status(403).json({
            msg: "not authenticated"
        })
    }
})

router.get('/courses', async (req, res) => {
    const response = await Course.find({});
    res.json({
        course: response
    })
});

router.post('/courses/:courseId', userMiddleware, async (req, res) => {
    const courseId = req.params.courseId;
    const username = req.headers.username;
    await User.updateOne({
        username: username
    }, {
        "$push": {
            purchasedCourses: courseId
        }

    })
    res.json({
        msg: "Purchase complete"
    })
});

router.get('/purchasedCourses', userMiddleware, async (req, res) => {
    const user = await User.findOne({
        username: req.username
    })
    const courses = await Course.find({
        _id: {
            "$in": user.purchasedCourses
        }
    })
    res.json({
        courses: courses
    })
});

module.exports = router