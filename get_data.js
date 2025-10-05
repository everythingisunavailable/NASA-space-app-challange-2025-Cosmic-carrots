function getYearData(climateData, year) {
    return climateData.yearly_data.find(entry => entry.year === year) || null;
}

function getDataByYearAndMonth(data, year, month) {
    // Find the requested year
    const yearData = data.yearly_data.find(entry => entry.year === year);
    if (!yearData) return null;

    // Find the requested month inside that year
    const monthData = yearData.monthly_data.find(
        entry => entry.month.toLowerCase() === month.toLowerCase()
    );
    if (!monthData) return null;

    // Combine and return full info with location + altitude
    return {
        location: data.location,
        altitude_meters: data.altitude_meters,
        year: year,
        ...monthData
    };
}


async function loadClimateData(filePath = './Qeen_2020-2024.json') {
    const response = await fetch(filePath);
    const data = await response.json();
    return data;
}

