const generatorAlarmModel = require('../models/generatorAlarmSchema');
const ms = require('ms');
module.exports = {
    name: 'setgeneratorradius',
    aliases: ['sgr'],
    description: "Set a generator's radius",
    permissions: ["SEND_MESSAGES"],
    async execute(message, args, cmd, client, Discord) {
        if (args[0] === undefined || args[1] === undefined) return message.reply('Error: Invalid Command Format.\nValid: a!sgr {gen name} {radius}');
        if (isNaN(parseFloat(args[1]))) return message.reply('Error: Arugment *two* (radius) must be a number.');

        const generatorName = args[0];
        const radius = args[1];

        

        let genAlarmDoc = await generatorAlarmModel.findOne({
            userID: message.author.id
        });
        if (genAlarmDoc === null) {
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

        let generator;
        await genAlarmDoc.generators.forEach(gen => {
            if (gen.genName === generatorName) {
                generator = gen
            }
        })
        generator.radius = radius;
        genAlarmDoc.save();

        if (generator === null || generator === undefined) return message.reply('Generator not found.');
        const newEmbed = new Discord.MessageEmbed()
            .setColor('#E02A6B')
            .setTitle(`Generator Manager`)
            .setDescription(`Radius for generator ${generatorName} successfully set to ${radius}.\nSet the element generator's timer again with a!sgt to ensure accuracy.`)
            .setFooter('Arkhitect by POPINxxCAPS');
        message.channel.send(newEmbed);
    }
}