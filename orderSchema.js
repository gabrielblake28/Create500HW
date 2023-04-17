const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  StoreID: {
    type: String,
    required: true,
  },
  SalesPersonID: {
    type: String,
    required: true,
  },
  CdID: {
    type: String,
    required: true,
  },
  PricePaid: {
    type: Number,
    required: true,
  },
  Date: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("mongoorders", OrderSchema);
