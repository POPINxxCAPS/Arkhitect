const generatorAlarmModel = require('../models/generatorAlarmSchema');
const calculateGeneratorTimer = require('../functions/calculateGeneratorTimer');
const ms = require('ms');
module.exports = {
    name: 'setgeneratortimer',
    aliases: ['sgt'],
    description: "Set a generator's timer",
    permissions: ["SEND_MESSAGES"],
    async execute(message, args, cmd, client, Discord) {
        if (args[0] === undefined || args[1] === undefined || args[2] === undefined) return message.reply('Error: Invalid Command Format.\nValid: a!sgt {gen name} {element} {element shards}');
        if (args[1] % 1 != 0) return message.reply('Error: Arugment *two* (element) must be a number');
        if (args[2] % 1 != 0) return message.reply('Error: Arugment *three* (element shards) must be a number');

        const generatorName = args[0];
        let element = parseInt(args[1]);
        let elementShards = parseInt(args[2]);

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
        if (generator === null || generator === undefined) return message.reply('Generator not found.');

        let genTime;
        await calculateGeneratorTimer.calculator(generator, element, elementShards).then(res => {
            genTime = res
        })

        if(genTime === undefined) return message.channel.send('An unknown error occurred.');

        let current_time = Date.now();
        let exp_time = current_time + genTime

        generator.expirationTime = exp_time;
        generator.alarmTriggered = false;
        genAlarmDoc.save();

        const newEmbed = new Discord.MessageEmbed()
            .setColor('#E02A6B')
            .setTitle(`Generator Manager`)
            .setDescription(`Successfully set timer for generator **${generator.genName}**\n**Time Remaining**: ${ms(genTime, { long: true })}\nYou will be DM'd **${ms(parseInt(genAlarmDoc.alarmSetting), { long: true })}** before the generator runs out.\nChange this setting with a!sap {time}`)
            .setFooter('Arkhitect by POPINxxCAPS');
        message.channel.send(newEmbed);
    }
}