let CROP_INDEX = 0;
let VEGETATION_INDEX = 1;
let AREA_INDEX = 0;

function buildCropCards(crops) {
    // Create the overlay div
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.id = 'cardOverlay';

    // Create the modal div
    const modal = document.createElement('div');
    modal.className = 'modal';

    // Loop through crops and create a card for each
    crops.forEach((crop, index) => {
        const card = document.createElement('div');
        card.className = 'card-choice';
        card.setAttribute('onclick', `chooseCard(${index})`); // Add click handler
        
        card.style.backgroundImage = `url('${crop.image}')`;
        card.style.backgroundSize = 'cover';       // cover the whole card
        card.style.backgroundPosition = 'center';  // center the image
        card.style.backgroundRepeat = 'no-repeat';
        
         modal.appendChild(card);
    });

    // Append modal to overlay
    overlay.appendChild(modal);

    // Append overlay to body
    document.body.appendChild(overlay);
}

// Update the crop card text
function updateCropCard(newCropName) {
    const cropCard = document.querySelector('.crop-card');
    if (!cropCard) return;

    // find matching crop (case-insensitive) from available crops
    const list = (typeof window !== 'undefined' && Array.isArray(window.crops)) ? window.crops : (Array.isArray(crops) ? crops : []);
    const match = list.find(c => c && c.name && c.name.toLowerCase() === String(newCropName).toLowerCase());
    // set or clear background
    if (match && match.image) {
        cropCard.style.backgroundImage = `url('${match.image}')`;
        cropCard.style.backgroundSize = 'cover';
        cropCard.style.backgroundPosition = 'center';
        cropCard.style.backgroundRepeat = 'no-repeat';
    } else {
        cropCard.style.backgroundImage = '';
    }
}


// Update the cards for the current round
// newCards is an array of strings, e.g. ["Card 1", "Card 2", ...]
function updateSingleRoundCards(newCards) {
    const roundCards = document.querySelectorAll('.card-container .card');
    roundCards.forEach((card, index) => {
        if (newCards[index]) {
            card.textContent = newCards[index];
        }
    });
}

// Update the info panel stats
// newStats is an object, e.g. {temperature: "+2°C", rainfall: "-10mm", humidity: "+5%", altitude: "N/A"}
function updateInfoPanel(newStats) {
    const infoPanel = document.getElementById('infoPanel');
    if (infoPanel) {
        let html = "<strong>Upcoming Stat Changes</strong>";
        for (const [key, value] of Object.entries(newStats)) {
            html += `<p>${capitalizeFirstLetter(key)}: ${value}</p>`;
        }
        infoPanel.innerHTML = html;
    }
}

// Helper function to capitalize the first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function chooseCard(index) {
    console.log("Player chose card", index + 1);
    CROP_INDEX = index;

    // TODO: trigger your game logic here
    updateCropCard(crops[index].name);
    // start round here 

    // Hide overlay after selection
    const overlay = document.getElementById('cardOverlay');
    overlay.style.display = 'none';
}

async function get_random_year_data() {
    // Load the full climate dataset
    const climateData = await loadClimateData();

    // Ignore the last year in the dataset
    const validYears = climateData.yearly_data.slice(0, -1);

    // Pick a random year entry (excluding the last one)
    const randomYearEntry = validYears[
        Math.floor(Math.random() * validYears.length)
    ];
    const year = randomYearEntry.year;

    // Pick a random month entry from that year
    const randomMonthEntry = randomYearEntry.monthly_data[
        Math.floor(Math.random() * randomYearEntry.monthly_data.length)
    ];
    const month = randomMonthEntry.month;

    // Get detailed data using your existing helper function
    const result = getDataByYearAndMonth(climateData, year, month);

    // Debug/log
    console.log(`🎲 Random pick (excluding last year): ${month} ${year}`);
    console.log(result);

    return result;
}


async function load_stats() {
    const data = await get_random_year_data();
    // Create the container div
    const panel = document.createElement('div');
    panel.classList.add('info-panel');

    // Create the content
    panel.innerHTML = `
        <strong>Upcoming Stat Changes</strong>
        <p>Temperature: ${data.average_temperature_celsius ?? "N/A"}°C</p>
        <p>Rainfall: ${data.average_rainfall_mm ?? "N/A"} mm</p>
        <p>Humidity: ${data.average_humidity_percent ?? "N/A"}%</p>
        <p>Altitude: ${data.altitude_meters ?? "N/A"}</p>
    `;

    // Add to page — append or replace existing panel
    const oldPanel = document.querySelector('.info-panel');
    if (oldPanel) oldPanel.replaceWith(panel);
    else document.body.appendChild(panel);
}


window.onload = async ()=>{
    let params = new URLSearchParams(window.location.search);
    if (!params.has("ndvi") || !params.has("area"))
    {
        console.log("There are search parameters missing!");
        return;
    }
    let crop = parseFloat(params.get("ndvi"));
    let area = parseInt(params.get("area"));
    
    CROP_INDEX = crop;
    AREA_INDEX = area;
    
    console.log(crop, area);
    buildCropCards(crops);
    await load_stats();
};