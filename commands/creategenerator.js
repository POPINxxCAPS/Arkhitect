const generatorAlarmModel = require('../models/generatorAlarmSchema');
module.exports = {
    name: 'creategenerator',
    aliases: ['cg'],
    description: "Add a generator",
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
        await genAlarmDoc.generators.forEach(gen => {
            if (gen.genName === generatorName) {
                found = true
            }
        })

        if (found === true) {
            const newEmbed = new Discord.MessageEmbed()
                .setColor('#E02A6B')
                .setTitle(`Generator Manager`)
                .setDescription(`Generator with the name **${generatorName}** already exists.\nCannot use the same name twice.`)
                .setFooter('Arkhitect by POPINxxCAPS');
            message.channel.send(newEmbed);
        } else {
            genAlarmDoc.generators.push({
                genName: generatorName,
                radius: '1',
                expirationTime: '0',
                alarmTriggered: true
            })
            genAlarmDoc.save();
            const newEmbed = new Discord.MessageEmbed()
                .setColor('#E02A6B')
                .setTitle(`Generator Manager`)
                .setDescription(`Generator with the name **${generatorName}** successfully created.`)
                .addFields({
                    name: 'Set the timer for this generator',
                    value: `a!sgt {${generatorName}} {element} {element shards}`
                }, {
                    name: 'Set the radius for this generator',
                    value: `a!sgr ${generatorName} {radius}`
                }, {
                    name: 'View your current timers',
                    value: 'a!gt'
                })
                .setFooter('Arkhitect by POPINxxCAPS');
            message.channel.send(newEmbed);
        }


    }
}