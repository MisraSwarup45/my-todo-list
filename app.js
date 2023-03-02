//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const path = require("path");
const { response } = require("express");
const date = require(__dirname + "/date.js");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, 'images')));


mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });


const itemsSchema = {
    name: String
};

const Item = mongoose.model("Item", itemsSchema);


const defaultItems = [];


const listSchema = {
    name: String,
    items: [itemsSchema]
};


const List = mongoose.model("List", listSchema);

app.get("/", (req, res) => {
    Item.find({}, (err, foundItems) => {
        res.render("list", { listTitle: "Today", newListItems: foundItems });
    });
});


app.get("/:customListName", (req, res) => {
    const customListName = _.capitalize(req.params.customListName);
    List.findOne({ name: customListName }, (err, foundList) => {
        if (!err) {
            if (!foundList) {
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
                list.save();
                res.redirect("/" + customListName);
            }
            else {
                res.render("list", { listTitle: foundList.name, newListItems: foundList.items });
            }
        }
    });


});



app.post("/", (req, res) => {

    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({
        name: itemName
    });

    if (listName === "Today") {
        item.save();
        res.redirect("/");
    }
    else {
        List.findOne({ name: listName }, (err, foundList) => {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/" + listName);
        });
    }



});

app.post("/delete", (req, res) => {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;
    // console.log(checkedItemId);

    if (listName === "Today") {
        Item.findByIdAndRemove(checkedItemId, (err) => {
            if (err) {
                console.log(err);
            }
            else {
                // console.log("Successfully deleted ");
                res.redirect("/");
            }
        });
    }
    else {
        List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } }, (err, foundList) => {
            if (!err) {
                res.redirect("/" + listName);
            }
        });
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

app.listen(process.env.PORT || 3000, () => {
    console.log("Server Started at Port 3000");
})