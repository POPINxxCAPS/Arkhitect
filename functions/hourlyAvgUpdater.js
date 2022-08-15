const hourlyAvgModel = require('../models/hourlyAvgSchema.js');
const serverModel = require('../models/serverSchema.js');
const ms = require('ms');
const {
  ReturnDocument
} = require('mongodb');
module.exports = async () => {
  setInterval(async () => {
    console.log('Hourly Averaging Started')
    let time = new Date(); // Set time
    let current_hour = time.getHours();
    let data = await serverModel.findOne({}); // Check if any data
    if (!data || data === null || data === undefined || data === []) return;
    let dataHour = parseInt(data.hour); // Parse data hour

    if (dataHour === current_hour) return console.log('Not a new hour. Cancelling.'); // If it's not a new hour, return.
    console.log('New hour. Downloading data.')
    data = await serverModel.find({
      hour: dataHour
    }).limit(500);
    console.log(`Data Download Finished. ${data.length} Documents downloaded.`);
    serverNames = [];
    await data.forEach(server => {
      if (serverNames.includes(server.serverName)) {} else {
        serverNames.push(server.serverName)
      }
    })
    console.log(`Averaging ${serverNames.length} Servers. ${data[0].month}/${data[0].day} Hour: ${data[0].hour}`)

    await serverNames.forEach(async name => {
      let targetData = await serverModel.find({
        serverName: name,
        hour: dataHour
      })
      if (targetData.length === 0) return;
      let dataToAvg = 0;
      let dataPoints = targetData.length;
      await targetData.forEach(doc => {
        dataToAvg += parseInt(doc.players);
      })
      let average = dataToAvg / dataPoints;
      let hourlyAvgDoc = await hourlyAvgModel.findOne({
        serverName: name,
        year: targetData[0].year,
        map: targetData[0].map
      })

      if (!hourlyAvgDoc || hourlyAvgDoc === null || hourlyAvgDoc === undefined || hourlyAvgDoc === []) { // If hourly avg doc does not exist (new year?)
        let create = await hourlyAvgModel.create({
          serverName: name,
          year: targetData[0].year,
          map: targetData[0].map,
          months: [{
            month: targetData[0].month,
            days: [{
              day: targetData[0].day,
              hours: [{
                hour: targetData[0].hour,
                hourlyAvg: average,
                dataPoints: dataPoints
              }]
            }]
          }]
        }).catch(err => {})
        // If a new doc was created, it already did the rest. So just return. (And delete the used data)
        return;
      }
      let monthBool = false;
      for (let a = 0; a < hourlyAvgDoc.months.length; a++) { // Confirm month is created
        if (hourlyAvgDoc.months[a].month === targetData[0].month) {
          monthBool = true;
          break;
        }
      }
      if (monthBool === false) {
        await hourlyAvgDoc.months.push({
          month: targetData[0].month,
          days: []
        })
        //hourlyAvgDoc.save();
      }

      for (let a = 0; a < hourlyAvgDoc.months.length; a++) { // Find correct month
        if (hourlyAvgDoc.months[a].month === targetData[0].month) {
          // Check if the day exists
          let dayBool = false;
          for (let b = 0; b < hourlyAvgDoc.months[a].days.length; b++) {
            if (hourlyAvgDoc.months[a].days[b].day === targetData[0].day) {
              dayBool = true;
              break;
            }
          }
          if (dayBool === false) {
            await hourlyAvgDoc.months[a].days.push({
              day: targetData[0].day,
              hours: []
            })
            //hourlyAvgDoc.save();
          }
        }
      }


      // If a new doc wasn't created, and it doesn't return, append the new information to the file.
      for (let a = 0; a < hourlyAvgDoc.months.length; a++) { // Using for loop to maintain async, filter month
        if (targetData[0].month === hourlyAvgDoc.months[a].month) { // If it is the correct month
          for (let b = 0; b < hourlyAvgDoc.months[a].days.length; b++) { // Find the correct day with a for loop
            if (targetData[0].day === hourlyAvgDoc.months[a].days[b].day) {
              let hourFound = false;
              for (let c = 0; c < hourlyAvgDoc.months[a].days[b].hours.length; c++) { // Find the correct hour with a for loop
                if (targetData[0].hour === hourlyAvgDoc.months[a].days[b].hours[c].hour) {
                  hourFound = true;
                  break;
                }
              }
              if (hourFound === true) {} else { // If the hour is found, it was already created. Do nothing.
                // console.log('Hour Added')
                // Else, add the hour and save the document.
                await hourlyAvgDoc.months[a].days[b].hours.push({
                  hour: targetData[0].hour,
                  hourlyAvg: average,
                  dataPoints: dataPoints
                })

                try {
                  await hourlyAvgDoc.save();
                } catch(err) {
                  console.log('Error: Double HourlyAvgDoc Save Caught')
                }
                /*let createDoc = await hourlyAvgDoc.create({
                  serverName: hourlyAvgDoc.serverName,
                  map: hourlyAvgDoc.map,
                  year: hourlyAvgDoc.year,
                  months: hourlyAvgDoc.months
                });
                
                await createDoc.save();
                hourlyAvgDoc.remove();*/
              }
            }
          }
        }
      }

      // After adding the data, delete used data
      setTimeout(async () => {
        await targetData.forEach(doc => {
          doc.remove();
        })
      }, 180000)
    });

    let current_time = Date.now();
    console.log(`Hourly Averaging Finished. Took ${ms(current_time - time)}`)
  }, 600000);
}