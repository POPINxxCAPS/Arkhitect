const generatorAlarmModel = require('../models/generatorAlarmSchema');
const ms = require('ms');
module.exports = {
    name: 'setalarmpreference',
    aliases: ['sap'],
    description: "Set the time before the gen runs out that the alarm should trigger", // terrible english
    permissions: ["SEND_MESSAGES"],
    async execute(message, args, cmd, client, Discord) {
        let time;
        try {
            time = ms(args[0])
        } catch (err) {
            return message.reply('Invalid time format in argument *one*.\nValid: 1d, 3h, 1w, etc.');
        }

        let genAlarmDoc = await generatorAlarmModel.findOne({
            userID: message.author.id
        });
        if (genAlarmDoc === null) {
            let genAlarmDocCreate = await generatorAlarmModel.create({
                userID: message.author.id,
                generators: [],
                alarmSetting: time
            })
            await genAlarmDocCreate.save();
            genAlarmDoc = await generatorAlarmModel.findOne({
                userID: message.author.id
            });
        } else {
            genAlarmDoc.alarmSetting = time;
            genAlarmDoc.save();
        }


        try {
            const newEmbed = new Discord.MessageEmbed()
                .setColor('#E02A6B')
                .setTitle(`Generator Manager`)
                .setDescription(`You will now be alerted ${ms(time)} before your generators run out.`)
                .setFooter('Arkhitect by POPINxxCAPS');
            message.channel.send(newEmbed);
        } catch (err) {
            return message.reply('Invalid time format in argument *one*.\nValid: 1d, 3h, 1w, etc.');
        }

    }
}