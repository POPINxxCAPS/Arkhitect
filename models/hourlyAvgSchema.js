const mongoose = require("mongoose");
const hourlyDataSchema = new mongoose.Schema({
    timestamp: { type: String, require: true },
    hourlyAvg: { type: String, require: true },
    dataPoints: { type: String, require: true }
})
const hourlyAvgSchema = new mongoose.Schema({
    serverName: { type: String, require: true, index: true },
    map: { type: String, require: true },
    hourlyData: [hourlyDataSchema],
});
// End Main Schema
 
const model = mongoose.model("hourlyaverage", hourlyAvgSchema);
 
module.exports = model;