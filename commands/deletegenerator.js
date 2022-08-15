const generatorAlarmModel = require('../models/generatorAlarmSchema');
module.exports = {
    name: 'deletegenerator',
    aliases: ['dg'],
    description: "Remove a generator",
    permissions: ["SEND_MESSAGES"],
    async execute(message, args, cmd, client, Discord) {
        if (args[0] === undefined) return message.reply('Error: Invalid Command Format.\nValid: a!cg {gen name}');
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

        let found = false;
        genAlarmDoc.generators.forEach(gen => {
            if (gen.genName === generatorName) {
                gen.remove()
                found = true;
            }
        })
        genAlarmDoc.save();
        
        if (found = true) {
            const newEmbed = new Discord.MessageEmbed()
                .setColor('#E02A6B')
                .setTitle(`Generator Manager`)
                .setDescription(`Generator with the name **${generatorName}** successfully deleted.`)
                .setFooter('Arkhitect by POPINxxCAPS');
            message.channel.send(newEmbed);
        } else {
            const newEmbed = new Discord.MessageEmbed()
                .setColor('#E02A6B')
                .setTitle(`Generator Manager`)
                .setDescription(`Generator with the name **${generatorName}** was not found.`)
                .setFooter('Arkhitect by POPINxxCAPS');
            message.channel.send(newEmbed);
        }
    }
}