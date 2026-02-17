const router = require("express").Router()
const Package = require("../models/Package")
const { v4: uuidv4 } = require("uuid")
const multer = require("multer")

const storage = multer.diskStorage({
    destination:(req,file,cb)=> cb(null,"uploads"),
    filename:(req,file,cb)=> cb(null, Date.now()+"-"+file.originalname)
})

const upload = multer({storage})

function generateTrackingCode(){
    return "DHL-"+uuidv4().split("-")[0].toUpperCase()
}

// Upload Package
router.post("/upload", upload.single("image"), async(req,res)=>{
    try{

        const trackingCode = generateTrackingCode()

        const pack = new Package({
            trackingCode,
            customerName:req.body.customerName,
            phone:req.body.phone,
            address:req.body.address,
            weight:req.body.weight,
            description:req.body.description,
            image:req.file?.filename,
            status:"Pending"
        })

        await pack.save()

        res.json(pack)

    }catch(err){
        res.status(500).json(err)
    }
})

// Track
router.get("/track/:code", async(req,res)=>{
    const pack = await Package.findOne({trackingCode:req.params.code})
    res.json(pack)
})

// Update Status
router.put("/status/:id", async(req,res)=>{
    const pack = await Package.findByIdAndUpdate(
        req.params.id,
        {status:req.body.status},
        {new:true}
    )
    res.json(pack)
})

module.exports = router
