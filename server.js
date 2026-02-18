require("dotenv").config()

const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const path = require("path")
const fs = require("fs")

const adminAuthRoutes = require("./routes/adminAuth")
const packageRoutes = require("./routes/packageRoutes")

const app = express()

/* ===== CREATE UPLOADS FOLDER IF NOT EXISTS ===== */
const uploadDir = path.join(__dirname, "uploads")
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir)
}

/* ===== MIDDLEWARE ===== */
app.use(cors())
app.use(express.json())

/* ===== STATIC FOLDERS ===== */
app.use("/uploads", express.static("uploads"))
app.use(express.static("public"))

/* ===== ROUTES ===== */
app.use("/api/admin", adminAuthRoutes)
app.use("/api/packages", packageRoutes)

/* ===== DATABASE ===== */
mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log("Database Connected"))
.catch(err=> console.log(err))

/* ===== SERVER ===== */
app.listen(process.env.PORT || 3000, ()=>{
    console.log("Server running")
})
