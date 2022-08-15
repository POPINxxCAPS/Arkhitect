const serverModel = require('../models/serverSchema');
const twoWeekAvgModel = require('../models/2wAvgSchema');
module.exports = {
  name: 'ping',
  aliases: ['p'],
  description: "Ping a server to query",
  cooldown: 0,
  permissions: ["SEND_MESSAGES"],
  async execute(message, args, cmd, client, Discord) {
    //if(message.member.roles.cache.has("849896037715017779")) {} else {return message.channel.send('You do not have access to this command.');}
    searchTerm = args[0]
    if(searchTerm === '') {
        message.channel.send('Argument *one* should be a server number.');
        return message.delete().catch(err => {});
    }
    
    let search = new RegExp(searchTerm);

    const dataCheck = await serverModel.findOne({serverName: search}).sort({'date': -1}).limit(1)
    if(!dataCheck[0]) {
        message.channel.send('No data found. Try a different search term.');
        return message.delete().catch(err => {});
    }
    let avgData = await twoWeekAvgModel.findOne({serverName: search});

    if(avgData === null) {
      const newEmbed = new Discord.MessageEmbed()
      .setColor('#E02A6B')
      .setTitle(`${mapNames[l]}`)
      .setDescription(`Top 10 Highest Population Servers.`)
      .addFields(
          {name: `Servers`, value: `${string}`},
      )
      .setFooter('Arkhitect by POPINxxCAPS');
      message.channel.send(newEmbed);
    } else {
      const newEmbed = new Discord.MessageEmbed()
      .setColor('#E02A6B')
      .setTitle(`Server Lookup`)
      .setDescription(`Showing information for ${args[0]}`)
      .addFields(
        {name: `Server Name`, value: `${dataCheck[0].serverName}`},
        {name: `Map`, value: `${dataCheck[0].map}`},
        {name: `Players`, value: `${dataCheck[0].players}`},
        {name: `Two Week Average`, value: `${Math.round(avgData.twoWeekAvg * 100) / 100}`},
        {name: `In-Game Day`, value: `${dataCheck[0].gameDay}`},
        {name: `Item Transfers Enabled`, value: `${dataCheck[0].itemTransfersEnabled}`},
        {name: `Character Transfers Enabled`, value: `${dataCheck[0].characterTransfersEnabled}`},
        )
      .setFooter('Arkhitect by POPINxxCAPS');
      message.channel.send(newEmbed);
    }
  }
}