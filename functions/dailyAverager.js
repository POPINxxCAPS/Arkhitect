const hourlyAvgModel = require('../models/hourlyAvgSchema');
const dailyAvgModel = require('../models/dailyAvgSchema');
const ms = require('ms');

module.exports = async () => {
    const start_time = Date.now();
    const firstDoc = await hourlyAvgModel.findOne({}); // Get the first document in the collection
    if (firstDoc === null) return;
    // Wait until 48hrs have passed since first doc in collection
    if(firstDoc.timestamp < (start_time - (3600000 * 25))) return;
    console.log('Running daily averager');
    const queryStartTime = firstDoc.timestamp;
    const queryEndTime = firstDoc.timestamp + (3600000 * 24);
    let documents = await hourlyAvgModel.find({
        timestamp: {
            $gte: queryStartTime,
            $lte: queryEndTime
        }
    })

    let finishedAverages = [];
    let insertData = [];
    for (const doc of documents) {
        if (finishedAverages.includes(doc.name) === true) continue;
        let dataToAvg = 0;
        let count = 0;
        let dataPoints = 0;
        for (const single of documents) {
            if (doc.name !== single.name) continue;
            dataToAvg += single.players;
            count += 1;
            dataPoints += single.dataPoints;
            single.remove();
            const index = documents.indexOf(single);
            documents.splice(index, 1); // Improves speed by reducing the amount of repeated documents...
        }
        const average = Math.round(dataToAvg / count);
        insertData.push({
            name: doc.name,
            average: average,
            timestamp: doc.timestamp,
            dataPoints: dataPoints
        })
        finishedAverages.push(doc.name)
    }

    await dailyAvgModel.insertMany(insertData);
    const end_time = Date.now();
    console.log(`Daily Averaging took ${ms(end_time - start_time)}`);
}