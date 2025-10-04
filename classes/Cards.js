class Card {
    constructor(name, options = {}, path="") {
        this.name = name;       // Card name
        this.addRain = options.addRain || 0;            // +mm rainfall
        this.tempBuffer = options.tempBuffer || 0;      // +°C / -°C
        this.flatGrowthPercent = options.flatGrowthPercent || 0; // +% growth
        this.oneTime = options.oneTime ?? true;         // used once per round
        this.path=path;                      // background cards
    }

    apply(cropState, monthlyStats) {
        if (this.addRain) monthlyStats.Rainfall += this.addRain;
        if (this.tempBuffer) monthlyStats.Temperature += this.tempBuffer;
        if (this.flatGrowthPercent) cropState.growth += cropState.growth * (this.flatGrowthPercent / 100);
    }
}



