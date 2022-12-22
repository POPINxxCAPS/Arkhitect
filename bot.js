// Failed new code
const mongoose = require('mongoose')
const Discord = require('discord.js');
const client = new Discord.Client({
  partials: ["MESSAGE", "CHANNEL", "REACTION"]
});

client.commands = new Discord.Collection();
client.events = new Discord.Collection();

['command_handler', 'event_handler'].forEach(handler => {
  require(`./handlers/${handler}`)(client, Discord);
});

// Start MongoDB setup
const mongoDBLogin = process.env.mongoDBLogin || require('./env/env').mongoDBLogin;
const token = process.env.token || require('./env/env').token;
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
const officialServerQuery = require('./functions/officialServerQuery');
const hourlyAverager = require('./functions/hourlyAverager');
const dailyAverager = require('./functions/dailyAverager');

client.on('ready', async () => {
  let running = false;
  setInterval(async () => {
    if (running === true) return; // Just to prevent "infinite interval" error
    running = true;
    await officialServerQuery(client);
    await hourlyAverager();
    running = false;
  }, 180000); // Query all servers every 3 minutes.
  //genAlarmHandler(client, Discord);
})