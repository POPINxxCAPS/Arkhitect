const generatorAlarmModel = require('../models/generatorAlarmSchema');
const ms = require('ms');
module.exports = {
    name: 'generatortimers',
    aliases: ['gt'],
    description: "View all of a user's generators",
    permissions: ["SEND_MESSAGES"],
    async execute(message, args, cmd, client, Discord) {
        const generatorName = args[0];
        let genAlarmDoc = await generatorAlarmModel.findOne({
            userID: message.author.id
        });
        if (genAlarmDoc === null || genAlarmDoc === undefined) {
            let genAlarmDocCreate = await generatorAlarmModel.create({
                userID: message.author.id,
                generators: [],
                alarmSetting: '3600000'
            })
            await genAlarmDocCreate.save();
            genAlarmDoc = await generatorAlarmModel.findOne({
                userID: message.author.id
            });
        }

        console.log(genAlarmDoc.alarmSetting)
        if(genAlarmDoc.alarmSetting === undefined) {
            genAlarmDoc.alarmSetting = '3600000';
            await genAlarmDoc.save()
        }
        const newEmbed = new Discord.MessageEmbed()
        .setColor('#E02A6B')
        .setTitle(`Generator Manager`)
        .setDescription(`Showing current generators and their timers`)
        .addFields({
            name: 'Set your alarm preference',
            value: `a!sap or a!setalarmpreference\nYou will currently be alerted ${ms(parseInt(genAlarmDoc.alarmSetting))} before the generator runs out.`
        })
        .setFooter('Arkhitect by POPINxxCAPS');
        
        let current_time = Date.now();
        await genAlarmDoc.generators.forEach(gen => {
            let timeRemaining = ms(parseInt(gen.expirationTime - current_time));
            if(parseInt(gen.expirationTime - current_time) < 0) {
                newEmbed.addFields({
                    name: `Name: ${gen.genName}, Radius: ${gen.radius}x`,
                    value: `Time Remaining: **Out of Element**`
                })
            } else {
                newEmbed.addFields({
                    name: `Name: ${gen.genName}, Radius: ${gen.radius}x`,
                    value: `Time Remaining: ${timeRemaining}`
                })
            }
            
        })
        message.channel.send(newEmbed);
    }
}