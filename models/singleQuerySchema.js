const mongoose = require("mongoose");
 
const serverSchema = new mongoose.Schema({
    name: { type: String, require: true, index: true },
    players: { type: Number, require: true },
    timestamp: { type: Number, require: true, index: true },
});
// End Main Schema
 
const model = mongoose.model("singleQueries", serverSchema);
 
module.exports = model;