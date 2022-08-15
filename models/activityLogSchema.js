const mongoose = require("mongoose");
 
const activityLogSchema = new mongoose.Schema({
    category: { type: String, require: true },
    string: { type: String, require: true }
});
// End Main Schema
 
const model = mongoose.model("activityLogs", activityLogSchema);
 
module.exports = model;