class Card {
    constructor(name, options = {}, path="") {
        this.name = name;       // Card name
        this.addRain = options.addRain || 0;            // +mm rainfall
        this.tempBuffer = options.tempBuffer || 0;      // +°C / -°C
        this.flatGrowthPercent = options.flatGrowthPercent || 0; // +% growth
        this.oneTime = options.oneTime ?? true;         // used once per round
        this.path=path;                      // background cards
    }

    apply(monthlyStats) {
        if (monthlyStats.rainfall !== undefined)
            monthlyStats.rainfall += this.addRain;

        if (monthlyStats.temperature !== undefined)
            monthlyStats.temperature += this.tempBuffer;

        if (monthlyStats.growth !== undefined)
            monthlyStats.growth += this.flatGrowthPercent;
    }
}
