const mongoose = require("mongoose");
 
const serverSchema = new mongoose.Schema({
    serverName: { type: String, require: true, index: true },
    players: { type: String, require: true },
    map: { type: String, require: true },
    gameDay: { type: String, require: true },
    itemTransfersEnabled: { type: String, require: true },
    characterTransfersEnabled: { type: String, require: true },
    utcTimestamp: { type: String, require: true, index: true },
    modifiers: [String]
});
// End Main Schema
 
const model = mongoose.model("serverdata", serverSchema);
 
module.exports = model;