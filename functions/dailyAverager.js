const hourlyAvgModel = require('../models/hourlyAvgSchema');
const dailyAvgModel = require('../models/dailyAvgSchema');
const ms = require('ms');
const trunc = require('./trunc');

module.exports = async () => {
    const start_time = Date.now();
    const firstDoc = await hourlyAvgModel.findOne({}); // Get the first document in the collection
    if (firstDoc === null) return;
    // Wait until 24hrs have passed since first doc in collection
    const timeTest = start_time - firstDoc.timestamp;
    const timeLimit = 86500000;
    console.log(timeTest)
    if(timeTest < timeLimit) return;
    console.log('Running daily averager');
    const queryStartTime = firstDoc.timestamp;
    const queryEndTime = firstDoc.timestamp + 86400000;
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
            dataToAvg += parseFloat(single.average);
            count += 1;
            dataPoints += single.dataPoints;
        }
        const average = dataToAvg / count;
        const truncAvg = trunc(average, 3);
        insertData.push({
            name: doc.name,
            average: truncAvg,
            timestamp: doc.timestamp,
            dataPoints: dataPoints
        })
        finishedAverages.push(doc.name);
    }

    for(const doc of documents) {
        doc.remove();
    }

    await dailyAvgModel.insertMany(insertData);
    const end_time = Date.now();
    console.log(`Daily Averaging took ${ms(end_time - start_time)}`);
}