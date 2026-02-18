<!DOCTYPE html>
<html>
<head>
<title>Courier Upload Package</title>

<style>
body{
    margin:0;
    font-family:Arial;
    background:#ffcc00;
}

.header{
    background:#cc0000;
    color:white;
    text-align:center;
    padding:25px;
    font-size:28px;
    font-weight:bold;
}

.card{
    background:white;
    width:95%;
    max-width:600px;
    margin:40px auto;
    padding:30px;
    border-radius:15px;
    box-shadow:0 0 20px rgba(0,0,0,0.2);
}

input, textarea, select{
    width:100%;
    padding:14px;
    margin:10px 0;
    border-radius:10px;
    border:1px solid #ddd;
    font-size:16px;
}

button{
    width:100%;
    padding:18px;
    background:#cc0000;
    color:white;
    border:none;
    border-radius:12px;
    font-size:18px;
    font-weight:bold;
    cursor:pointer;
}

button:hover{
    background:#990000;
}

.preview{
    width:100%;
    margin-top:10px;
    border-radius:12px;
    display:none;
}

.loading{
    text-align:center;
    font-weight:bold;
    margin-top:15px;
}
</style>
</head>

<body>

<div class="header">📦 COURIER PACKAGE UPLOAD</div>

<div class="card">

<input id="name" placeholder="Customer Name">
<input id="phone" placeholder="Phone Number">
<input id="address" placeholder="Delivery Address">

<input id="location" placeholder="Current Location (City, Country)">

<select id="status">
<option>Pending</option>
<option>Collected</option>
<option>In Transit</option>
<option>Custom Clearance</option>
<option>Out For Delivery</option>
<option>Delivered</option>
</select>

<input id="weight" placeholder="Package Weight">

<label>Departure Date</label>
<input type="datetime-local" id="departure">

<label>Arrival Estimate</label>
<input type="datetime-local" id="arrival">

<textarea id="desc" placeholder="Package Description"></textarea>

<input type="file" id="image" onchange="previewImage()">
<img id="preview" class="preview">

<button onclick="upload()">UPLOAD PACKAGE</button>

<div id="loading" class="loading"></div>

</div>

<script>

function previewImage(){
    const file = document.getElementById("image").files[0]
    const preview = document.getElementById("preview")

    if(file){
        preview.src = URL.createObjectURL(file)
        preview.style.display = "block"
    }
}

async function upload(){

    const loading = document.getElementById("loading")
    loading.innerText = "Uploading package..."

    const form = new FormData()

    const currentLocation = document.getElementById("location").value.trim()
    const status = document.getElementById("status").value.trim()

    form.append("customerName", document.getElementById("name").value.trim())
    form.append("phone", document.getElementById("phone").value.trim())
    form.append("address", document.getElementById("address").value.trim())

    form.append("currentLocation", currentLocation)
    form.append("status", status)

    form.append("weight", document.getElementById("weight").value.trim())
    form.append("departureDate", document.getElementById("departure").value)
    form.append("arrivalEstimate", document.getElementById("arrival").value)
    form.append("description", document.getElementById("desc").value.trim())

    // Create first timeline automatically
    form.append("timeline", JSON.stringify([
        {
            location: currentLocation || "Warehouse",
            status: status || "Pending",
            date: new Date()
        }
    ]))

    const imageInput = document.getElementById("image")

    if(imageInput.files.length > 0){
        form.append("image", imageInput.files[0])
    }

    try{

        const res = await fetch("/api/packages/upload",{
            method:"POST",
            body:form
        })

        const data = await res.json()

        if(data.trackingCode){
            loading.innerText = "Upload successful!"
            setTimeout(()=>{
                window.location = "/receipt.html?code=" + data.trackingCode
            },1000)
        }else{
            loading.innerText = ""
            alert("Upload failed")
        }

    }catch(err){
        loading.innerText = ""
        alert("Server error")
    }

}

</script>

</body>
</html>
