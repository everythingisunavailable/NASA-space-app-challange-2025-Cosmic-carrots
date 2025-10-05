    let CROP_INDEX = 0;
    let VEGETATION_INDEX = 1;
    let AREA_INDEX = 0;
    let selected_cards = [];
    let CROP_STATE = {};
    let STATS;
    let GAME_STATE = {
        gameOver: false,         // true if the crop has failed
        monthsWithLowGrowth: 0   // counter for consecutive months of insufficient growth
    };

function setGrowthProgress(percentage) {
    const bar = document.getElementById('growthProgressBar');
    if (!bar) return;
    console.log("percentege :", percentage);
    bar.style.height = percentage + '%';
}

function endGame(message) {
    // Create overlay background
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    overlay.style.backdropFilter = 'blur(8px)';
    overlay.style.background = 'rgba(0, 0, 0, 0.7)';
    overlay.style.zIndex = '9999';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.color = 'white';
    overlay.style.fontFamily = "'ITC Benguiat', serif";
    overlay.style.textAlign = 'center';
    overlay.style.padding = '30px';

    // Create message
    const msg = document.createElement('h2');
    msg.textContent = message;
    msg.style.fontSize = '2rem';
    msg.style.marginBottom = '30px';
    msg.style.textShadow = '0 0 10px rgba(255,255,255,0.5)';

    // Create "New Game" button
    const btn = document.createElement('button');
    btn.textContent = '🌾 Start New Game';
    btn.style.background = '#37b24d';
    btn.style.color = 'white';
    btn.style.fontWeight = 'bold';
    btn.style.fontSize = '1.2rem';
    btn.style.padding = '14px 28px';
    btn.style.border = 'none';
    btn.style.borderRadius = '12px';
    btn.style.cursor = 'pointer';
    btn.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.4)';
    btn.style.transition = 'transform 0.2s, background 0.3s';

    btn.addEventListener('mouseover', () => {
        btn.style.transform = 'translateY(-4px)';
        btn.style.background = '#4cd964';
    });
    btn.addEventListener('mouseout', () => {
        btn.style.transform = 'translateY(0)';
        btn.style.background = '#37b24d';
    });
    btn.addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    // Append to overlay and body
    overlay.appendChild(msg);
    overlay.appendChild(btn);
    document.body.appendChild(overlay);
}


function buildCropCards(crops) {
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.id = 'cardOverlay';

    const container = document.createElement('div');
    container.className = 'crop-container';

    const title = document.createElement('div');
    title.className = 'crop-title';
    title.textContent = 'Pick a Crop to Grow';
    container.appendChild(title);

    title.dataset.color = '#905328ff'; 
    title.dataset.size  = '50px';   

// Apply them as style
title.style.color = title.dataset.color;
title.style.fontSize = title.dataset.size;
title.style.textShadow = '2px 2px 4px rgba(243, 236, 236, 0.5)'

    const modal = document.createElement('div');
    modal.className = 'modal';

        const farmBrown = '#905328ff';
    modal.style.backgroundColor = farmBrown;
    modal.style.borderRadius = '12px';
    modal.style.padding = '20px';


    crops.forEach((crop, index) => {
        const card = document.createElement('div');
        card.className = 'card-choice';
        card.dataset.name = crop.name; 
        card.style.backgroundImage = `url('${crop.image}')`;
        card.style.backgroundSize = 'cover';
        card.style.backgroundPosition = 'center';
        card.style.backgroundRepeat = 'no-repeat';

            card.style.width = '200px';  // was ~180px
    card.style.height = '280px'; // was ~240px
    card.style.borderRadius = '12px';
    card.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
    card.style.cursor = 'pointer';


        card.addEventListener('click', () => {
            chooseCard(index); // existing logic
        });

        modal.appendChild(card);
    });

    container.appendChild(modal);
    overlay.appendChild(container);
    document.body.appendChild(overlay);
}
    
// Update the crop card text
function updateCropCard(newCropName) {
    const cropCard = document.querySelector('.crop-card');
    if (!cropCard) return;

    const list = (typeof window !== 'undefined' && Array.isArray(window.crops)) ? window.crops : (Array.isArray(crops) ? crops : []);
    const match = list.find(c => c && c.name && c.name.toLowerCase() === String(newCropName).toLowerCase());
    if (match && match.image) {
        cropCard.style.backgroundImage = `url('${match.image}')`;
        cropCard.style.backgroundSize = 'cover';
        cropCard.style.backgroundPosition = 'center';
        cropCard.style.backgroundRepeat = 'no-repeat';
    } else {
        cropCard.style.backgroundImage = '';
    }
}

function handle_card_click(card_div, card_data) {
    // Check if this exact card (both data + div) is already selected
    const index = selected_cards.findIndex(sel => 
        JSON.stringify(sel.data) === JSON.stringify(card_data) && sel.div === card_div
    );

    if (index >= 0) {
        // Already selected → unselect it
        selected_cards.splice(index, 1);
        card_div.classList.remove("selected");
    } else {
        // Add new selection if less than 2 selected
        if (selected_cards.length < 2) {
            selected_cards.push({ div: card_div, data: card_data });
            card_div.classList.add("selected");
        } else {
            console.log("Cannot select more than 2 cards");
            return;
        }
    }
}   

function updateSingleRoundCards(newCards) {
    const roundCards = document.querySelectorAll('.card-container .card');
    roundCards.forEach((card, index) => {
        if (newCards[index]) {

            if (card) {
                // Set the background image of the card element
                card.style.backgroundImage = `url('${newCards[index].path}')`;
                card.style.backgroundSize = 'cover';
                card.style.backgroundPosition = 'center';
                
                card.title = card.name;
            } else {
                card.style.backgroundImage = '';
                card.title = '';
            }

            // Remove all previous event listeners by cloning the node
            const newCard = card.cloneNode(true);
            card.parentNode.replaceChild(newCard, card);

            // Add a new onclick listener
            newCard.addEventListener('click', () => {
                handle_card_click(newCard, newCards[index]);
            });
        }
    });
}

function updateInfoPanel(data) {
    // Create the container div
    const panel = document.createElement('div');
    panel.classList.add('info-panel');
    panel.id = 'infoPanel';

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

    console.log("Info panel updated");
}


    // Helper function to capitalize the first letter
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function shuffle_cards()
    {
        let hand_cards = [];
        for (let i = 0; i < 4; i++)
        {
            let index = Math.floor(Math.random() * 4);
            hand_cards.push(allCards[index]);
        }

        updateSingleRoundCards(hand_cards);
    }

function evaluateCropGrowth(crop, monthlyStats, gameState) {
    // Use the global CROP_STATE
    const checks = [
        { stat: monthlyStats.average_temperature_celsius, range: crop.tempRange },
        { stat: monthlyStats.average_rainfall_mm, range: crop.rainfallRange },
        { stat: monthlyStats.average_humidity_percent, range: crop.humidityRange },
        { stat: monthlyStats.altitude_meters, range: crop.altitudeRange }
    ];

    let totalFactor = 0;

    for (const { stat, range } of checks) {
        const [minIdeal, maxIdeal, minTol, maxTol] = range;
        let factor = 0;

        if (stat >= minIdeal && stat <= maxIdeal) {
            factor = 1;
        } else if (stat >= minTol && stat < minIdeal) {
            factor = 0.5 + 0.5 * (stat - minTol) / (minIdeal - minTol);
        } else if (stat > maxIdeal && stat <= maxTol) {
            factor = 0.5 + 0.5 * (maxTol - stat) / (maxTol - maxIdeal);
        } else {
            factor = 0.2;
        }

        totalFactor += factor;
    }

    const avgFactor = totalFactor / checks.length;

    // Apply VEGETATION_INDEX as a growth multiplier (example: 1 for normal, 0.8 for slower)
    const vegetationMultiplier = VEGETATION_INDEX === 0 ? 1 : 0.8;

    const growthThisRound = CROP_STATE.growth_percentage * avgFactor * vegetationMultiplier;

    CROP_STATE.growth += growthThisRound;
    if (CROP_STATE.growth > 100) CROP_STATE.growth = 100;
    if (CROP_STATE.growth < 0) CROP_STATE.growth = 0;

    // Update the progress bar
    setGrowthProgress(CROP_STATE.growth);

    console.log(`🌱 ${crop.name} total growth: ${CROP_STATE.growth.toFixed(2)}%`);

    // Check win condition
    if (CROP_STATE.growth >= 100 && !CROP_STATE.fullyGrown) {
        CROP_STATE.fullyGrown = true;
        console.log(`✅ ${crop.name} is fully grown!`);
        endGame(`${crop.name} has fully grown!`);
    }

    // Check lose condition
    const minGrowthThreshold = CROP_STATE.growth_percentage * 0.5;
    if (growthThisRound < minGrowthThreshold) {
        if (!gameState.monthsWithLowGrowth) gameState.monthsWithLowGrowth = 0;
        gameState.monthsWithLowGrowth++;
        if (gameState.monthsWithLowGrowth >= 3 && !gameState.gameOver) {
            gameState.gameOver = true;
            console.log(`⛔ Crop failed to grow properly. Game over!`);
            endGame(`${crop.name} has Died`);
        }
    } else {
        if (gameState.monthsWithLowGrowth) gameState.monthsWithLowGrowth = 0;
    }
}




    function resetCardSelection() {
        // Remove "selected" class from all currently selected card divs
        selected_cards.forEach(sel => {
            if (sel.div) sel.div.classList.remove("selected");
        });

        // Clear the array
        selected_cards = [];
    }

const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

async function getNextMonthData() {
    if (!STATS) {
        console.error("No current stats available");
        return null;
    }

    const climateData = await loadClimateData();

    // Current year and month
    let currentYear = STATS.year;
    let currentMonthNumber = STATS.month_number; // 1–12

    // Increment month
    let nextMonthNumber = currentMonthNumber + 1;
    let nextYear = currentYear;

    if (nextMonthNumber > 12) {
        nextMonthNumber = 1;
        nextYear += 1;
    }

    const nextMonthName = MONTH_NAMES[nextMonthNumber - 1]; // Convert number to name

    // Check if nextYear exists in the dataset
    const yearData = climateData.yearly_data.find(y => y.year === nextYear);
    if (!yearData) {
        console.warn("Next year data not available, looping back to first year");
        nextYear = climateData.yearly_data[0].year;
    }

    // Fetch next month by name
    const monthData = getDataByYearAndMonth(climateData, nextYear, nextMonthName);
    if (!monthData) {
        console.warn("Next month data not found, using current month stats");
        return STATS;
    }

    // Update global STATS
    STATS = monthData;
    updateInfoPanel(STATS);
}


    async function next_round()
    {
        if (selected_cards.length < 1){
            alert("Please pick at least one card!");
            return;
        }

        selected_cards.forEach(card => {
            card.data.apply(STATS);
        });
        evaluateCropGrowth(crops[CROP_INDEX], STATS, GAME_STATE);
        resetCardSelection();

        await getNextMonthData();

        shuffle_cards();
    }

    function init_crop_state(crop)
    {
        CROP_STATE = new Crop_state(crop);
    }

    function chooseCard(index) {
        console.log("Player chose card", index + 1);
        CROP_INDEX = index;

        updateCropCard(crops[index].name);
        shuffle_cards();
        init_crop_state(crops[index]);
        
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

        return result;
    }


    async function load_stats() {
        const data = await get_random_year_data();
        //pass them globally like a moron
        STATS = data;
        updateInfoPanel(data);
    }

    window.onload = async ()=>{
        let params = new URLSearchParams(window.location.search);
        if (!params.has("ndvi") || !params.has("area"))
        {
            console.log("There are search parameters missing!");
            return;
        }
        let index = parseFloat(params.get("ndvi"));
        let area = parseInt(params.get("area"));
        
        CROP_INDEX = index;
        AREA_INDEX = area;
        
        buildCropCards(crops);
        await load_stats();
    };

    document.addEventListener('DOMContentLoaded', () => {
    updateSingleRoundCards(allCards);
});