async function calculator(generator, element, elementShards) {
    let baseConsumptionRate = 1.33; // Per 24hrs (86400 seconds)
    let perUnitConsumptionRate = 0.33 // Per 1.0x

    let ele = element + (Math.trunc(elementShards / 100));
    let eleShards = elementShards - (Math.trunc(elementShards / 100) * 100);

    let consumptionModifier = (((generator.radius - 1) * perUnitConsumptionRate) + 1);

    let totalConsumption = consumptionModifier + baseConsumptionRate;
    let consumptionPerMS = totalConsumption / 86400000
    let eleCalcVars = ele + (eleShards / 100);
    let eleCalculation = parseFloat(eleCalcVars);

    let timeRemaining = eleCalculation / consumptionPerMS;
    return timeRemaining
}

module.exports = {
    calculator,
}