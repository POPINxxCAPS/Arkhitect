const mongoose = require("mongoose");
const dailyAvgSchema = new mongoose.Schema({
    name: { type: String, require: true, index: true },
    average: { type: String, require: true},
    timestamp: { type: Number, require: true, index: true },
    dataPoints: { type: Number, require: true }
});
// End Main Schema
 
const model = mongoose.model("dailyavgs", dailyAvgSchema);
 
module.exports = model;