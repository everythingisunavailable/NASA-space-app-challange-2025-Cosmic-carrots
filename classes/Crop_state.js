class Crop_state {
    constructor(crop) {
        this.name = crop.name;     // Crop name
        this.growth = 0;          // Growth percentage (0–100)
        this.growth_percentage = 100 / crop.growthSpeed;
    }
}
