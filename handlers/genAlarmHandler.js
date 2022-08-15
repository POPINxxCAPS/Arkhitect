const generatorAlarmModel = require('../models/generatorAlarmSchema');
const ms = require('ms');

module.exports = async (client, discord) => {
    const guild = client.guilds.cache.get("849892492039290920");
    setInterval(async () => {
        let current_time = Date.now();
        let genAlarmDocs = await generatorAlarmModel.find({});
        await genAlarmDocs.forEach(doc => {
            doc.generators.forEach(async gen => {
                if(gen.alarmTriggered === true) return;

                if((parseFloat(gen.expirationTime) - current_time) < parseInt(doc.alarmSetting)) {
                    let userTarget = await client.users.cache.find(user => user.id === `${doc.userID}`);
                    
                    const embed = new discord.MessageEmbed()
                    .setColor('#E02A6B')
                    .setTitle(`Generator Manager`)
                    .setDescription(`Generator **${gen.genName}** is running low.\nTime Remaining: ${ms(parseFloat(gen.expirationTime) - current_time)}`)
                    .setFooter('Arkhitect by POPINxxCAPS');

                    userTarget.send(embed)

                    gen.alarmTriggered = true;
                    doc.save()
                }
            })
        })
    }, 300000)
}