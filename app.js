//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { response } = require("express");
const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


// const items = ["Buy Food", "Cook Food", "Eat Food"];
// const workItems = [];

mongoose.connect("mongodb://localhost:27017/todolistDB", { useNewUrlParser: true });


const itemsSchema = {
    name: String
};

const Item = mongoose.model("Item", itemsSchema);



const item1 = new Item({
    name: "Welcome to your Todo List"
});

const item2 = new Item({
    name: "Hit the + button to add a new item"
});

const item3 = new Item({
    name: "<-- Hit the button to delete the item"
});

const defaultItems = [item1, item2, item3];





app.get("/", (req, res) => {

    Item.find({}, (err, foundItems) => {
        // console.log(foundItems);

        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, (err) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log("successfully added to the database");
                }
            });
            res.redirect("/");
        }
        else {
            res.render("list", { listTitle: "Today", newListItems: foundItems });
        }


    });
    let day = date.getDate();

});



app.post("/", (req, res) => {

    var itemName = req.body.newItem;

    const item = new Item({
        name: itemName
    });

    item.save();

    res.redirect("/");

});

app.post("/delete", (req, res) => {
    const checkedItemId = req.body.checkbox;
    // console.log(checkedItemId);

    Item.findByIdAndRemove(checkedItemId, (err, docs) => {
        if(err){
            console.log(err);
        }
        else{
            console.log("Successfully deleted ", docs);
            res.redirect("/");
        }
    });
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