const serverTimerModel = require('../models/serverTimerSchema');

module.exports = async () => {
    setInterval(async () => {
        const current_time = Date.now()
        const checkTime = current_time + 300000
        let timerDocs = await serverTimerModel.find({})
        timerDocs.forEach(doc => {
            if(doc.expirationTime < checkTime) return doc.remove().catch(err => console.log('Timer doc error caught.'));
        })
    }, 120000)
}