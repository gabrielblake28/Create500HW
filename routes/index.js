let x = 2;
var express = require("express");
var router = express.Router();
var fs = require("fs");

// start by creating data so we don't have to type it in each time
let ServerOrderArray = [];

// define a constructor to create movie objects

let orderObject = function (storeID, salesPersonID, cdID, pricePaid, date) {
  this.StoreID = storeID;
  this.SalesPersonID = salesPersonID;
  this.CdID = cdID;
  this.PricePaid = pricePaid;
  this.Date = date;
};

const mongoose = require("mongoose");

const orderSchema = require("../orderSchema");

// edited to include my non-admin, user level account and PW on mongo atlas
// and also to include the name of the mongo DB that the collection is in (MoviesDB)
const dbURI =
  "mongodb+srv://user:userPass@gabrielcluster.s40dwry.mongodb.net/test?retryWrites=true&w=majority";

mongoose.connect(dbURI).then(
  () => {
    console.log("Database connection established!");
  },
  (err) => {
    console.log("Error connecting Database instance due to: ", err);
  }
);

// my file management code, embedded in an object
fileManager = {
  // this will read a file and put the data in our movie array
  // NOTE: both read and write files are synchonous, we really can't do anything
  // useful until they are done.  If they were async, we would have to use call backs.
  // functions really should take in the name of a file to be more generally useful
  read: function () {
    // has extra code to add 4 movies if and only if the file is empty
    const stat = fs.statSync("ordersData.json");
    if (stat.size !== 0) {
      var rawdata = fs.readFileSync("ordersData.json"); // read disk file
      ServerOrderArray = JSON.parse(rawdata); // turn the file data into JSON format and overwrite our array
    } else {
      ServerOrderArray.push(new orderObject());
      fileManager.write();
    }
  },

  write: function () {
    let data = JSON.stringify(ServerOrderArray); // take our object data and make it writeable
    fs.writeFileSync("ordersData.json", data); // write it
  },
};

/* GET home page. */
router.get("/", function (req, res, next) {
  res.sendFile("index.html");
});

/* GET all Movie data */
router.get("/getAllOrders", async function (req, res) {
  res.status(200).json(await orderSchema.find({}));
});

router.get("/getAllLessThan10/:store", async function (req, res) {
  res
    .status(200)
    .json(
      await orderSchema
        .find({ StoreID: req.params.store, PricePaid: { $gt: 1, $lt: 10 } })
        .exec()
    );
});

router.get("/getAllFromSalesMan/:salesID/:price", async function (req, res) {
  res.status(200).json(
    await orderSchema
      .find({
        SalesPersonID: req.params.salesID,
        PricePaid: req.params.price,
      })
      .exec()
  );
});

router.post("/AddOrder", function (req, res) {
  let oneNewOrder = new orderSchema(req.body);
  console.log(req.body);
  oneNewOrder.save();

  var response = {
    status: 200,
    success: "Added Successfully",
  };

  res.end(JSON.stringify(response));
});

router.post("/Submit500", function (req, res) {
  let oneNewOrder = new orderSchema(req.body);
  console.log(req.body);
  oneNewOrder.save();

  var response = {
    status: 200,
    success: "Added Successfully",
  };

  res.end(JSON.stringify(response));
});

module.exports = router;
