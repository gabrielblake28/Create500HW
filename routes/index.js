let x = 2;
var express = require("express");
var router = express.Router();
var fs = require("fs");

// start by creating data so we don't have to type it in each time
let ServerMovieArray = [];
let ServerOrderArray = [];

// define a constructor to create movie objects

let orderObject = function (storeID, salesPersonID, cdID, pricePaid, date) {
  this.StoreID = storeID;
  this.SalesPersonID = salesPersonID;
  this.CdID = cdID;
  this.PricePaid = pricePaid;
  this.Date = date;
};


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
      // var rawdata = fs.readFileSync("moviesData.json"); // read disk file
      // ServerMovieArray = JSON.parse(rawdata); // turn the file data into JSON format and overwrite our array
    } else {
      // make up 3 for testing
      // ServerMovieArray.push(new MovieObject("Moonstruck", 1981, "Drama"));
      // ServerMovieArray.push(new MovieObject("Wild At Heart", 1982, "Drama"));
      // ServerMovieArray.push(new MovieObject("Raising Arizona", 1983, "Comedy"));
      // ServerMovieArray.push(new MovieObject("USS Indianapolis", 2016, "Drama"));
      ServerOrderArray.push(new orderObject());
      fileManager.write();
    }
  },

  write: function () {
    let data = JSON.stringify(ServerOrderArray); // take our object data and make it writeable
    // let data = JSON.stringify(ServerMovieArray); // take our object data and make it writeable
    fs.writeFileSync("ordersData.json", data); // write it
    // fs.writeFileSync("moviesData.json", data); // write it
  },
};

/* GET home page. */
router.get("/", function (req, res, next) {
  res.sendFile("index.html");
});

/* GET all Movie data */
router.get("/getAllMovies", function (req, res) {
  fileManager.read();
  res.status(200).json(ServerOrderArray);
  // res.status(200).json(ServerMovieArray);
});


router.post("/SubmitOne", function (req, res) {
  const newOrder = req.body;
  console.log(newOrder);
  var response = {
    status: 200,
    success: "Added Successfully",
  };
  res.end(JSON.stringify(response)); // get the object from the req object sent from browser
});

router.post("/Submit500", function (req, res) {
  // console.log("hit");
  const newOrder = req.body;
  ServerOrderArray.push(newOrder); // add it to our "DB"  (array)
  fileManager.write();

  var response = {
    status: 200,
    success: "Added Successfully",
  };
  res.end(JSON.stringify(response));
});

module.exports = router;
