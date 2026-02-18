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
            status: "Pending",

            currentLocation: "Shipment Created",

            timeline: [
                {
                    location: "Shipment Created",
                    status: "Pending",
                    date: new Date()
                }
            ]

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

/* ================= UPDATE STATUS ONLY ================= */

router.put("/status/:id", async (req, res) => {
    try {

        const pkg = await Package.findById(req.params.id)

        if (!pkg) return res.status(404).json({ message: "Not found" })

        pkg.status = req.body.status || pkg.status

        pkg.timeline.push({
            location: pkg.currentLocation || "Unknown",
            status: pkg.status,
            date: new Date()
        })

        await pkg.save()

        res.json(pkg)

    } catch (err) {
        console.log("STATUS UPDATE ERROR:", err)
        res.status(500).json({ message: "Status update failed" })
    }
})

/* ================= UPDATE LOCATION + STATUS ================= */

router.put("/update-movement/:id", async (req, res) => {
    try {

        const { location, status } = req.body

        const pkg = await Package.findById(req.params.id)

        if (!pkg) return res.status(404).json({ message: "Not found" })

        if (location) pkg.currentLocation = location
        if (status) pkg.status = status

        pkg.timeline.push({
            location: location || pkg.currentLocation,
            status: status || pkg.status,
            date: new Date()
        })

        await pkg.save()

        res.json(pkg)

    } catch (err) {
        console.log("MOVEMENT UPDATE ERROR:", err)
        res.status(500).json({ message: "Movement update failed" })
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
