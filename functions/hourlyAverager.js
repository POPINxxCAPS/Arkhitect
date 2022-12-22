const singleQueryModel = require('../models/singleQuerySchema');
const hourlyAvgModel = require('../models/hourlyAvgSchema');
const ms = require('ms');

module.exports = async () => {
    const start_time = Date.now();
    const firstDoc = await singleQueryModel.findOne({}); // Get the first document in the collection
    if (firstDoc === null) return console.log('No documents, cancelling hourly averager.');
    const timeTest = start_time - firstDoc.timestamp;
    const timeLimit = 3700000;
    console.log(timeTest)
    if(timeTest < timeLimit) return;
    console.log('Running hourly averager');
    const queryStartTime = firstDoc.timestamp;
    const queryEndTime = firstDoc.timestamp + 3600000;
    let documents = await singleQueryModel.find({
        timestamp: {
            $gte: queryStartTime,
            $lte: queryEndTime
        }
    }).catch(err => { console.log(err )})

    let finishedAverages = [];
    let insertData = [];
    for (const doc of documents) {
        if (finishedAverages.includes(doc.name) === true) continue;
        let dataToAvg = 0;
        let timestampToAvg = 0;
        let count = 0;
        for (const single of documents) {
            if (doc.name !== single.name) continue;
            dataToAvg += single.players;
            timestampToAvg += single.timestamp;
            count += 1;
        }
        const average = Math.round(dataToAvg / count);
        const timestampAvg = Math.round(timestampToAvg / count);
        insertData.push({
            name: doc.name,
            average: average,
            timestamp: timestampAvg,
            dataPoints: count
        })
        finishedAverages.push(doc.name)
    }

    for(const doc of documents) {
        doc.remove();
    }

    await hourlyAvgModel.insertMany(insertData);
    const end_time = Date.now();
    console.log(`Hourly Averaging took ${ms(end_time - start_time)}`);
}