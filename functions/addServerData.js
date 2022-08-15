const serverModel = require('../models/serverSchema.js');
module.exports = async (serverData, utcTimestamp) => {
  let serverDoc = await serverModel.create({
    serverName: serverData.Name,
    players: serverData.NumPlayers,
    map: serverData.MapName,
    gameDay: serverData.DayTime,
    itemTransfersEnabled: serverData.AllowDownloadItems,
    characterTransfersEnabled: serverData.AllowDownloadChars,
    utcTimestamp: utcTimestamp
  });
  return serverDoc;
}