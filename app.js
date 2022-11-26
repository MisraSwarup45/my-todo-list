const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.get("/", function(req, res){
    res.send("Hello! Welcome to My todo List");
});

app.listen(3000, function(){
    console.log("Server Started at Port 3000");
})