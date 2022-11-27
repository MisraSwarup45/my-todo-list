const express = require("express");
const bodyParser = require("body-parser");
const { response } = require("express");
const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];

app.get("/", (req, res) => {
    let day = date.getDate();
    res.render("list", { listTitle: day, newListItems: items });
});



app.post("/", (req, res) => {

    var item = req.body.newItem;

    // console.log(req.body.list);

    if (req.body.list === "Work") {
        workItems.push(item);
        res.redirect("/work");
    }
    else {
        items.push(item);
        res.redirect("/");
    }


});


app.get("/work", (req, res) => {
    res.render("list", { listTitle: "Work", newListItems: workItems });
})

// app.post("/work", (req, res)=>{
//     var item = req.body.newItem;
//     workItems.push(item);
//     res.redirect("/work");
// })

app.listen(3000, () => {
    console.log("Server Started at Port 3000");
})