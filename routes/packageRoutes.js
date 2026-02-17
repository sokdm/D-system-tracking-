const router = require("express").Router()
const Package = require("../models/Package")
const multer = require("multer")

/* ================= MULTER CONFIG ================= */

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname)
    }
})

const upload = multer({ storage })

/* ================= CREATE PACKAGE ================= */

router.post("/upload", upload.single("image"), async (req, res) => {
    try {

        const trackingCode = "DHL" + Date.now()

        const newPackage = new Package({
            trackingCode,

            customerName: req.body.customerName || "",
            phone: req.body.phone || "",
            address: req.body.address || "",

            weight: req.body.weight || "",
            description: req.body.description || "",

            departureDate: req.body.departureDate || "",
            arrivalEstimate: req.body.arrivalEstimate || "",

            image: req.file ? req.file.filename : "",
            status: "Pending"
        })

        await newPackage.save()

        res.json({
            success: true,
            trackingCode,
            package: newPackage
        })

    } catch (err) {
        console.log("UPLOAD ERROR:", err)
        res.status(500).json({ message: "Upload failed" })
    }
})

/* ================= GET ALL PACKAGES ================= */

router.get("/all", async (req, res) => {
    try {

        const packages = await Package.find().sort({ createdAt: -1 })
        res.json(packages)

    } catch (err) {
        console.log("GET ALL ERROR:", err)
        res.status(500).json({ message: "Failed to fetch packages" })
    }
})

/* ================= TRACK PACKAGE ================= */

router.get("/track/:code", async (req, res) => {
    try {

        const pkg = await Package.findOne({
            trackingCode: req.params.code
        })

        if (!pkg) {
            return res.status(404).json({
                message: "Package not found"
            })
        }

        res.json(pkg)

    } catch (err) {
        console.log("TRACK ERROR:", err)
        res.status(500).json({ message: "Tracking failed" })
    }
})

/* ================= UPDATE STATUS ================= */

router.put("/status/:id", async (req, res) => {
    try {

        const updated = await Package.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        )

        res.json(updated)

    } catch (err) {
        console.log("STATUS UPDATE ERROR:", err)
        res.status(500).json({ message: "Status update failed" })
    }
})

/* ================= RECEIPT DATA ================= */

router.get("/receipt/:code", async (req, res) => {
    try {

        const pkg = await Package.findOne({
            trackingCode: req.params.code
        })

        if (!pkg) {
            return res.status(404).json({
                message: "Package not found"
            })
        }

        res.json(pkg)

    } catch (err) {
        console.log("RECEIPT ERROR:", err)
        res.status(500).json({ message: "Receipt fetch failed" })
    }
})

module.exports = router
