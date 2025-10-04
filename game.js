let CROP_INDEX = 0;
let VEGETATION_INDEX = 1;
let PLACE_INDEX = 0;

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
        card.textContent = crop.name; // Set crop name as text
        card.setAttribute('onclick', `chooseCard(${index})`); // Add click handler
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
    if (cropCard) {
        cropCard.textContent = newCropName;
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

    // Hide overlay after selection
    const overlay = document.getElementById('cardOverlay');
    overlay.style.display = 'none';
}

window.onload = ()=>{
    buildCropCards(crops);
};