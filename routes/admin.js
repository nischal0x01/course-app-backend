const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const { Admin, User, Course } = require("../db");
const router = Router();
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");


// Admin Routes
router.post('/signup', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    await Admin.create({
        username: username,
        password: password,
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

router.post('/courses', adminMiddleware, async (req, res) => {
    const title = req.body.title;
    const description = req.body.description;
    const price = req.body.price;
    const imageLink = req.body.imageLink;
    const response = await Course.create({
        title,
        description,
        price,
        imageLink
    })
    res.json({
        msg: "Course created successfully", courseID: response._id
    })
});

router.get('/courses', adminMiddleware, async (req, res) => {
    const response = await Course.find({});
    res.json({ courses: response })
});

module.exports = router;