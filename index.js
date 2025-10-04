        // Initialize the map
        const map = L.map('map', {
            center: [20, 0],
            zoom: 2,
            minZoom: 2,
            maxZoom: 10
        });

        // Add NASA GIBS satellite imagery
        L.tileLayer('https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/BlueMarble_ShadedRelief_Bathymetry/default/2024-01-01/GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpg', {
            attribution: 'NASA GIBS',
            maxZoom: 8
        }).addTo(map);

        // Define the locations

        const locations = [
            { id: 1, name: 'Albania, Europe', coords: [41.3275, 19.8187], description: 'Southeastern Europe' },
            { id: 2, name: 'USA, North America', coords: [41.8780, -93.0977], description: 'North America' },
            { id: 3, name: 'Brazil , South America', coords: [-24.9550, -53.4550], description: 'South America' },
            { id: 4, name: 'India, Asia', coords: [31.1471, 75.3412], description: 'Asia' },
            { id: 5, name: 'South Africa , Africa', coords: [-29.0000, 31.0000], description: 'Africa' },
            { id: 6, name: 'Oceania, Australia', coords: [-20.9176, 142.7028], description: 'Oceania' }
        ];


        function createCustomIcon(number) {
            return L.divIcon({
                className: 'custom-div-icon',
                html: `<div class="custom-pin"><span class="custom-pin-number">${number}</span></div>`,
                iconSize: [48, 60],
                iconAnchor: [24, 60],
                popupAnchor: [0, -60]
            });
        }

        // Add markers
        locations.forEach(location => {
            const marker = L.marker(location.coords, {
                icon: createCustomIcon(location.id)
            }).addTo(map);

            marker.bindTooltip(location.name, {
                permanent: false,
                direction: 'top',
                offset: [0, -60],
                opacity: 1
            });

            // Tooltip hover color change
            marker.on('mouseover', function (e) {
                const tooltipEl = e.target.getTooltip().getElement();
                tooltipEl.style.color = 'black';
            });

            marker.on('mouseout', function (e) {
                const tooltipEl = e.target.getTooltip().getElement();
                tooltipEl.style.color = 'white';
            });

            marker.on('click', function () {
                console.log(`Pin ${location.id} clicked: ${location.name}`);
                if (location.id === 6) {
                    window.location.href = './Oceania.html';
                }
            });
        });