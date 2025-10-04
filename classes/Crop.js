class Crop {
    constructor(name, tempRange, rainfallRange, humidityRange, altitudeRange, growthSpeed, image) {
        this.name = name;
        this.tempRange = tempRange;         // [minIdeal, maxIdeal, minTolerance, maxTolerance]
        this.rainfallRange = rainfallRange; // [minIdeal, maxIdeal, minTolerance, maxTolerance]
        this.humidityRange = humidityRange; // [minIdeal, maxIdeal, minTolerance, maxTolerance]
        this.altitudeRange = altitudeRange; // [minIdeal, maxIdeal, minTolerance, maxTolerance]
        this.growthSpeed = growthSpeed;     // duration in months
        this.image=image;                   //image
    }

    // Check if a given environment is within ideal range
    isIdeal(temp, rainfall, humidity, altitude) {
        return (
            temp >= this.tempRange[0] && temp <= this.tempRange[1] &&
            rainfall >= this.rainfallRange[0] && rainfall <= this.rainfallRange[1] &&
            humidity >= this.humidityRange[0] && humidity <= this.humidityRange[1] &&
            altitude >= this.altitudeRange[0] && altitude <= this.altitudeRange[1]
        );
    }

    // Simple info display
    info() {
        return `${this.name} grows best in ${this.tempRange[0]}–${this.tempRange[1]}°C, rainfall ${this.rainfallRange[0]}–${this.rainfallRange[1]} mm/month, humidity ${this.humidityRange[0]}–${this.humidityRange[1]}%, altitude ${this.altitudeRange[0]}–${this.altitudeRange[1]} m. Soil: ${this.soil}. Growth speed: ${this.growthSpeed}.`;
    }
}