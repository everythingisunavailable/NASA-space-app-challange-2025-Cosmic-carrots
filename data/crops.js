const crops = [
    new Crop(
        "Carrot",
        [16, 21, 10, 25],        // tempRange: minIdeal, maxIdeal, minTolerance, maxTolerance
        [50, 75, 30, 100],       // rainfallRange in mm/month
        [50, 70, 40, 80],        // humidityRange %
        [100, 500, 0, 1000],     // altitudeRange m
        4,                       // growthSpeed in months
        './carrot.png'
    ),
    new Crop(
        "Pineapple",
        [20, 30, 15, 35],        // temperature °C
        [83, 125, 50, 150],      // rainfall mm/month
        [60, 70, 50, 80],        // humidity %
        [0, 1000, 0, 1200],      // altitude m
        18,                      // growthSpeed in months
        "./pineapple.png"
    ),
    new Crop(
        "Strawberry",
        [15, 20, 10, 25],        // temp °C
        [75, 100, 40, 120],      // rainfall mm/month
        [60, 80, 50, 85],        // humidity %
        [0, 1500, 0, 1500],      // altitude m
        5,                       // growthSpeed in months
        "./strawberry.png"
    ),
    new Crop(
        "Sweet Corn",
        [20, 30, 18, 35],        // temp °C
        [50, 150, 40, 180],      // rainfall mm/month
        [60, 80, 50, 90],        // humidity %
        [0, 1200, 0, 1200],      // altitude m
        4,                       // growthSpeed in months
        "./corn.png"
    )
];
