const singleQueryModel = require('../models/singleQuerySchema');
const hourlyAvgModel = require('../models/hourlyAvgSchema');
const ms = require('ms');

module.exports = async () => {
    const start_time = Date.now();
    const firstDoc = await singleQueryModel.findOne({}); // Get the first document in the collection
    if (firstDoc === null) return;
    // Wait until 1 1/2hrs have passed since first doc in collection
    if(firstDoc.timestamp < (start_time - (3600000 * 1.5))) return;
    console.log('Running hourly averager');
    const queryStartTime = firstDoc.timestamp;
    const queryEndTime = firstDoc.timestamp + 3600000;
    let documents = await singleQueryModel.find({
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
        let timestampToAvg = 0;
        let count = 0;
        for (const single of documents) {
            if (doc.name !== single.name) continue;
            dataToAvg += single.players;
            timestampToAvg += single.timestamp;
            count += 1;
            single.remove();
            const index = documents.indexOf(single);
            documents.splice(index, 1); // Improves speed by reducing the amount of repeated documents...
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

    await hourlyAvgModel.insertMany(insertData);
    const end_time = Date.now();
    console.log(`Hourly Averaging took ${ms(end_time - start_time)}`);
}