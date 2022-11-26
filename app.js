const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set('view engine', 'ejs');


var today = new Date();
var currentday = today.getDay();
var day = "";

app.get("/", function(req, res){
    day = "weekend";
    res.render("list", {kindOfDay: day});
});

app.listen(3000, function(){
    console.log("Server Started at Port 3000");
})