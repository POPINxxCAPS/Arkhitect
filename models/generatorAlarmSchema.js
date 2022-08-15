const mongoose = require("mongoose");
 
const singleGenSchema = new mongoose.Schema({
    genName: { type: String, require: true },
    radius: { type: String, require: true },
    expirationTime: { type: String, require: true},
    alarmTriggered: { type: Boolean, require: true },
})


const genAlarmSchema = new mongoose.Schema({
    userID: { type: String, require: true, index: true, unique: true },
    generators: [singleGenSchema],
    alarmSetting: { type: String, require: true }
})

// End Main Schema
 
const model = mongoose.model("generatorAlarms", genAlarmSchema);
 
module.exports = model;