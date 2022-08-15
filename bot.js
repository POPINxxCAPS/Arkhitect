// Failed new code
const mongoose = require('mongoose')
const Discord = require('discord.js');
const client = new Discord.Client({ partials: ["MESSAGE", "CHANNEL", "REACTION"]});
const prefix = 'a!';
 
client.commands = new Discord.Collection();
client.events = new Discord.Collection();
 
['command_handler', 'event_handler'].forEach(handler => {
  require(`./handlers/${handler}`)(client, Discord);
});
 
// Start MongoDB setup
const { mongoDBLogin, token } = require('./env/env');
mongoose
  .connect(mongoDBLogin, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('Connected to MongoDB Database!')
  })
  .catch((err) => {
    console.log(err)
  })
 
 
// Finish MongoDB setup
// Start bot login

client.login(token);
// Finish bot login


// Start bot functions once bot has logged in
const officialServerQuery = require('./functions/officialServerQuery.js');
const hourlyAvgUpdater = require('./functions/hourlyAvgUpdater.js');
const genAlarmHandler = require('./handlers/genAlarmHandler');

client.on('ready', () => {
  officialServerQuery(client);
  genAlarmHandler(client, Discord);
  


  setInterval(async () => {
    client.user.setActivity(`WIP`, ({type: "WATCHING"}))
  }, 120000)
})