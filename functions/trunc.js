function trunc(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.trunc(value * multiplier) / multiplier;
}

module.exports = trunc;