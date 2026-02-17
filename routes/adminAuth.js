const router = require("express").Router()
const Admin = require("../models/Admin")
const jwt = require("jsonwebtoken")

// ADMIN LOGIN
router.post("/login", async (req, res) => {
    try {

        const admin = await Admin.findOne({
            username: req.body.username
        })

        if (!admin) {
            return res.status(400).json("Admin not found")
        }

        if (admin.password !== req.body.password) {
            return res.status(400).json("Wrong password")
        }

        const token = jwt.sign(
            { id: admin._id },
            process.env.JWT_SECRET
        )

        res.json({
            message: "Login success",
            token
        })

    } catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router
