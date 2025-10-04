
const crops = [
    new Crop(
        "Carrot",
        [16, 20, 10, 25],        // tempRange: minIdeal, maxIdeal, minTolerance, maxTolerance
        [50, 70, 30, 100],       // rainfallRange in mm/month
        [60, 70, 50, 80],        // humidityRange %
        [100, 500, 0, 1000],     // altitudeRange m
        4                        // growthSpeed in months
    ),
    new Crop(
        "Wheat",
        [18, 22, 10, 28],
        [40, 60, 20, 90],
        [50, 65, 40, 75],
        [0, 800, 0, 1200],
        6
    ),
    new Crop(
        "Potato",
        [14, 18, 10, 25],
        [60, 80, 40, 120],
        [65, 75, 50, 85],
        [200, 800, 0, 1500],
        5
    ),
    new Crop(
        "Banana",
        [24, 30, 18, 35],        // ideal tropical temperature
        [80, 120, 60, 150],      // rainfall mm/month
        [70, 90, 60, 100],       // humidity %
        [0, 800, 0, 1200],       // altitude m
        9                        // growthSpeed in months
    )
];
