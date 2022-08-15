const ChartJS = require('chart.js');
const {
  CanvasRenderService
} = require('chartjs-node-canvas');
const {
  MessageAttachment
} = require('discord.js');
const hourlyAvgModel = require('../models/hourlyAvgSchema');
const plugin = {
  id: 'Blank',
  beforeDraw: (chart) => {
    const ctx = chart.canvas.getContext('2d');
    ctx.save();
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, chart.width, chart.height);
    ctx.restore();
  }
};

module.exports = {
  name: 'chart',
  aliases: ['c'],
  description: "simple ping command",
  cooldown: 0,
  permissions: ["SEND_MESSAGES"],
  async execute(message, args, cmd, client, Discord) {
    let searchTerm = '';
    if ((!args[1]) || (args[1] === undefined)) {
      hrsToSearch = 24
    } else {
      hrsToSearch = args[1];
    }
    if (!Number.isInteger(parseInt(hrsToSearch))) return message.channel.send('Argument two must be a number. Please specify the amount of hours you would like to chart in argument two.')

    /*for(i = 0; i < args.length; i++) {
      searchTerm += args[i]
    }*/
    searchTerm = args[0]

    if (searchTerm === '') {
      message.channel.send('Search terms required');
      return message.delete().catch(err => {});
    }


    let search = new RegExp(searchTerm);
    const data = await hourlyAvgModel.findOne({
      serverName: search
    });
    if (!data || data === null || data === undefined || data === []) {
      message.channel.send('No data found. Try a different search term.');
      return message.delete().catch(err => {});
    }

    let server = data;
    let chartData = []


    let totalDaysUsed = 0;
    let totalHoursUsed = 0;
    let dataPoints = 0;

    totalHoursUsed += 1;
    for (let a = server.months.length; a >= (server.months.length - 12); a--) {
      if (a < 0 || server.months[a] === undefined) {} else {
        for (let b = server.months[a].days.length; b > (server.months[a].days.length - 14); b--) {
          if (b < 0 || totalDaysUsed >= 14 || server.months[a].days[b] === undefined) {} else {
            totalDaysUsed += 1;
            server.months[a].days[b].hours.forEach(hr => {
              if (totalHoursUsed >= hrsToSearch) return;
              //console.log(hr)
              let date = new Date(parseInt(server.year), parseInt(server.months[a].month), parseInt(server.months[a].days[b].day), parseInt(hr.hour))
              let sortTimestamp = date.getTime();

              let timestamp = `${server.months[a].month}/${server.months[a].days[b].day} ${hr.hour}:00`;
              let playerAvg = Number(hr.hourlyAvg)
              chartData.push({
                players: playerAvg,
                timestamp: timestamp,
                sortTimestamp: sortTimestamp
              })
              //dataPoints += parseInt(hour.dataPoints);
              totalHoursUsed += 1;
            })
          }
          if (totalHoursUsed >= hrsToSearch) break;
        }
      }
      if (totalHoursUsed >= hrsToSearch) break;
    }
    //console.log(`Days Used: ${totalDaysUsed}`)
    //console.log(`Hours Used: ${totalHoursUsed}`)
    //console.log(players)
    //console.log(dates)
    /*
    let x = 0;
    while(x < data.length) {
      for(i = 0; i < data[x].hourlyAvg.length; i++) {
        let timestamp = `${data[x].month}/${data[x].day} ${data[x].hourlyAvg[i].hour}:00`;
        let playerAvg = Number(data[x].hourlyAvg[i].avgPlayers)
        players.push(playerAvg)
        dates.push(timestamp)
      }
      
      x += 1;
    }*/

    let y = chartData.length;
    let sortedChartData = chartData.sort((a, b) => ((a.sortTimestamp) > (b.sortTimestamp)) ? -1 : 1);
    let dateLabels = [];
    let playerData = [];
    while (y >= 0) {
      if(sortedChartData[y] === undefined) {} else {
        playerData.push(sortedChartData[y].players);
        dateLabels.push(sortedChartData[y].timestamp);
      }
      y -= 1;
    }
    const width = 800;
    const height = 600;

    const canvas = new CanvasRenderService(width, height)
    const configuration = {
      type: 'line',
      data: {
        labels: dateLabels,
        datasets: [{
          label: 'Average Player Count',
          data: playerData,
          backgroundColor: '#FF0042',
          borderColor: '#000000',
          borderWidth: 1

        }, ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      },
      plugins: [plugin]
    }
    const image = await canvas.renderToBuffer(configuration)
    const attachment = new MessageAttachment(image)
    await message.channel.send(attachment);
    message.channel.send(`Data for ${server.serverName}`);
    message.delete().catch(err => {});
  }
}