require("dotenv").config()
const mongoose = require("mongoose")
const Admin = require("./models/Admin")

mongoose.connect(process.env.MONGO_URI)
.then(async () => {

    const admin = new Admin({
        username: "admin",
        password: "123456"
    })

    await admin.save()

    console.log("Admin created")
    process.exit()

})
