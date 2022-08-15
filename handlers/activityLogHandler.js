const activityLogModel = require('../models/activityLogSchema');

module.exports = async (client, discord) => {
    const channel = client.channels.cache.get("858336281413812234");
    const highChanceChannel = client.channels.cache.get("858591010186985492");
    setInterval(async () => {
        const embed = new discord.MessageEmbed()
            .setColor('#E02A6B')
            .setTitle(`Activity Alerts`)
            .setFooter('Arkhitect by POPINxxCAPS');

        let war = [];
        let warString = [];
        let tribeBuilding = [];
        let tribeBuildingString = [];
        let pvpChance = [];
        let pvpChanceString = [];
        let possibleActivity = [];
        let possibleActivityString = [];

        let activityDocs = await activityLogModel.find({});

        if (activityDocs.length === 0) return;
        activityDocs.forEach(doc => {
            if (doc.category === 'War') {
                war.push(doc)
                doc.remove()
                return;
            }
            if (doc.category === 'Tribe Building on Dead Server') {
                tribeBuilding.push(doc)
                doc.remove()
                return;
            }
            if (doc.category === 'PvP Chance') {
                pvpChance.push(doc)
                doc.remove();
                return;
            }
            if (doc.category === 'Possible Activity') {
                possibleActivity.push(doc)
                doc.remove();
                return;
            }
        })

        if (war.length === 0 && tribeBuilding.length === 0 && pvpChance.length === 0) return;

        if (war.length !== 0) {
            let sorted = war.sort((a, b) => ((a.string) > (b.string)) ? -1 : 1);
            for (let i = 0; i < sorted.length; i++) {
                let stringCount = 0;
                if (warString[stringCount] === undefined) {
                    warString[stringCount] = `${sorted[i].string}\n`;
                } else {
                    if (warString[stringCount].length > 900) {
                        stringCount += 1;
                        warString[stringCount] = `${sorted[i].string}\n`;
                    } else {
                        warString[stringCount] += `${sorted[i].string}\n`;
                    }
                }
            }
            warString.forEach(string => {
                embed.addFields({
                    name: 'War',
                    value: string
                })
            })
        }

        if (tribeBuilding.length !== 0) {
            let sorted = tribeBuilding.sort((a, b) => ((a.string) > (b.string)) ? -1 : 1);
            for (let i = 0; i < sorted.length; i++) {
                let stringCount = 0;
                if (tribeBuildingString[stringCount] === undefined) {
                    tribeBuildingString[stringCount] = `${sorted[i].string}\n`;
                } else {
                    if (tribeBuildingString[stringCount].length > 900) {
                        stringCount += 1;
                        tribeBuildingString[stringCount] = `${sorted[i].string}\n`;
                    } else {
                        tribeBuildingString[stringCount] += `${sorted[i].string}\n`;
                    }
                }
            }
            tribeBuildingString.forEach(string => {
                embed.addFields({
                    name: 'Tribe Building',
                    value: string
                })
            })
        }

        if (pvpChance.length !== 0) {
            let sorted = pvpChance.sort((a, b) => ((a.string) > (b.string)) ? -1 : 1);
            for (let i = 0; i < sorted.length; i++) {
                let stringCount = 0;
                if (pvpChanceString[stringCount] === undefined) {
                    pvpChanceString[stringCount] = `${sorted[i].string}\n`;
                } else {
                    if (pvpChanceString[stringCount].length > 900) {
                        stringCount += 1;
                        pvpChanceString[stringCount] = `${sorted[i].string}\n`;
                    } else {
                        pvpChanceString[stringCount] += `${sorted[i].string}\n`;
                    }
                }
            }
        }

        if (possibleActivity.length !== 0) {
            let sorted = possibleActivity.sort((a, b) => ((a.string) > (b.string)) ? -1 : 1);
            for (let i = 0; i < sorted.length; i++) {
                let stringCount = 0;
                if (possibleActivityString[stringCount] === undefined) {
                    possibleActivityString[stringCount] = `${sorted[i].string}\n`;
                } else {
                    if (possibleActivityString[stringCount].length > 900) {
                        stringCount += 1;
                        possibleActivityString[stringCount] = `${sorted[i].string}\n`;
                    } else {
                        possibleActivityString[stringCount] += `${sorted[i].string}\n`;
                    }
                }
            }
            possibleActivityString.forEach(string => {
                embed.addFields({
                    name: 'Possible Activity',
                    value: string
                })
            })
        }
        if((war.length === 0) && (tribeBuilding.length) === 0 && (pvpChance.length === 0) && (possibleActivity.length === 0)) return;
        return channel.send(embed)
    }, 120000)
}