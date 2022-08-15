const mongoose = require("mongoose");
 
const twoWeekAvgSchema = new mongoose.Schema({
    serverName: { type: String, require: true, index: true, unique: true },
    twoWeekAvg: { type: String },
    dataPoints: { type: String }
});
// End Main Schema
 
const model = mongoose.model("twoweekavgs", twoWeekAvgSchema);

module.exports = model;