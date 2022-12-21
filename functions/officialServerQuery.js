const http = require('http');
const ms = require('ms');
const singleQueryModel = require('../models/singleQuerySchema');

module.exports = async (client) => {
  const start_time = Date.now();
  let insertData = [];
  http.get('http://arkdedicated.com/xbox/cache/officialserverlist.json', async (resp) => {
    let dataJSONString = '';
    // A chunk of data has been received.
    resp.on('data', (chunk) => {
      dataJSONString += chunk;
    });


    // The whole response has been received. Process results.
    resp.on('end', async () => {
      let dataJSON;
      let queryErr = false;
      try {
        dataJSON = JSON.parse(dataJSONString);
      } catch (err) {
        console.log('Error parsing json string. Cancelling server query.');
        queryErr = true;
      }
      if (queryErr === true) return;

      for (const server of dataJSON) {
        insertData.push({
          name: server.Name,
          players: server.NumPlayers,
          timestamp: start_time,
        })
      }

      if(insertData.length !== 0) await singleQueryModel.insertMany(insertData);
      const end_time = Date.now();
      console.log(`Completed server query. Took ${ms(end_time - start_time)}`);
    });
  }).on("error", (err) => { // If there was an error retreiving the HTTP address
    console.log("Error: " + err.message);
    return;
  });
  return;
}

/* Sample Data
{
  AllowDownloadItems: 1,
  IP: '46.251.238.210',
  Service: 'https://xboxnitradoeu233.arkdedicated.com:93',
  MinorBuildId: 9,
  MaxPlayers: 70,
  ClusterId: 'NewPVPCrossArk1',
  Sandbox: 'RETAIL',
  MapName: 'Gen2',
  SessionIsPve: 0,
  LatencyPort: 10004,
  AllowDownloadChars: 1,
  NumPlayers: 2,
  LastUpdated: 1671208440343,
  BuildId: 955,
  Port: 10000,
  SearchHandle: '49c74604-5ce1-4f60-88e4-94e74e076698',
  DayTime: '13172',
  GameMode: 'TestGameMode_C',
  Name: 'EU-PVP-GenTwo-CrossArk1',
  SearchTags: [ 'crossplayallowxbox' ]
}
*/