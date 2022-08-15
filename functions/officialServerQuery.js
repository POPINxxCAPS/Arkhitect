const http = require('http');
const addServerData = require('./addServerData');
const ms = require('ms');

module.exports = async (client) => {
  const channel = client.channels.cache.get("858336281413812234");
  const highChanceChannel = client.channels.cache.get("858591010186985492");
  const ignoredTypes = ['PVE', "Primitive", "CrossArk", "SmallTribes", "FreeBuildNoMissions"]
  setInterval(async () => {
    http.get('http://arkdedicated.com/xbox/cache/officialserverlist.json', async (resp) => {
      let data = '';

      // A chunk of data has been received.
      resp.on('data', (chunk) => {
        data += chunk;
      });
      let utcTimestamp = new Date().getTime()
      // The whole response has been received. Print out the result.
      resp.on('end', async () => {
        let serverData;
        try {
          serverData = JSON.parse(data);
        } catch (err) {
          console.log('Error parsing data. Cancelling official server query.');
        }

        for (const server of serverData) {
          let cancel = false;
          for (const type of ignoredTypes) {
            if (server.Name.includes(type) === true) {
              cancel = true;
              continue;
            }
          }
          if(cancel = true) {
            cancel = false;
            continue;
          };
          console.log(server.Name)
          //addServerData(server, utcTimestamp);
        }


        /*let i = 0;
        while (i < serverData.length) {
          let singleServer = serverData[i];
          addServerData(singleServer, time)
          activityLog(singleServer.Name, singleServer.NumPlayers, singleServer.MapName, client)
          i += 1;
        }*/


        let timeTest = Date.now();
        let timeDiff = ms(timeTest - utcTimestamp);
        console.log(`Completed official server query. Took ${timeDiff}`);
      });

    }).on("error", (err) => {
      return;
      console.log("Error: " + err.message);
    });
    return;
  }, 30000);
}