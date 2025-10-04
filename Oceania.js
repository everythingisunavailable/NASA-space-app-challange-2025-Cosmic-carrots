  
        const map = L.map('map', {
            center: [-20.9176, 142.7028],
            zoom: 6,
            minZoom: 4,
            maxZoom: 10
        });

        L.tileLayer('https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/BlueMarble_ShadedRelief_Bathymetry/default/2024-01-01/GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpg', {
            attribution: 'NASA GIBS',
            maxZoom: 8
        }).addTo(map);

        function getNDVIColor(ndvi) {
            if (ndvi >= 0.7) return '#4caf50';
            if (ndvi >= 0.4) return '#ffc107';
            if (ndvi >= 0.2) return '#ff9800';
            return '#9e9e9e';
        }

        function getNDVICategory(ndvi) {
            if (ndvi >= 0.7) return 'Dense, healthy forests';
            if (ndvi >= 0.4) return 'Moderate vegetation';
            if (ndvi >= 0.2) return 'Sparse vegetation';
            return 'Bare soil or desert';
        }

        function getVegetationShape(ndvi) {
            const color = getNDVIColor(ndvi);

            if (ndvi >= 0.7) {
                // Dense forest - full tree shape
                return `
                    <svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                        <g transform="translate(60, 60)">
                             Tree trunk 
                            <rect x="-6" y="15" width="12" height="30" fill="#8B4513" rx="3"/>
                             Tree foliage layers 
                            <ellipse cx="0" cy="0" rx="38" ry="30" fill="${color}" opacity="0.9"/>
                            <ellipse cx="0" cy="-12" rx="30" ry="24" fill="${color}"/>
                            <ellipse cx="0" cy="-22" rx="22" ry="18" fill="${color}" opacity="0.95"/>
                             NDVI label 
                            <text x="0" y="8" text-anchor="middle" fill="white" font-size="18" font-weight="bold" style="text-shadow: 0 1px 3px rgba(0,0,0,0.5);">${ndvi.toFixed(2)}</text>
                        </g>
                    </svg>
                `;
            } else if (ndvi >= 0.4) {
                // Moderate vegetation - leaf shape
                return `
                    <svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                        <g transform="translate(60, 60)">
                             Leaf shape 
                            <path d="M 0,-38 Q 22,-22 30,8 Q 15,22 0,30 Q -15,22 -30,8 Q -22,-22 0,-38 Z" 
                                  fill="${color}" stroke="${color}" stroke-width="3" opacity="0.95"/>
                             Leaf vein 
                            <line x1="0" y1="-38" x2="0" y2="30" stroke="#2e7d32" stroke-width="3" opacity="0.6"/>
                             NDVI label 
                            <text x="0" y="8" text-anchor="middle" fill="white" font-size="18" font-weight="bold" style="text-shadow: 0 1px 3px rgba(0,0,0,0.5);">${ndvi.toFixed(2)}</text>
                        </g>
                    </svg>
                `;
            } else if (ndvi >= 0.2) {
                // Sparse vegetation - small sprout
                return `
                    <svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                        <g transform="translate(60, 60)">
                             Stem 
                            <line x1="0" y1="22" x2="0" y2="-8" stroke="#8B4513" stroke-width="4"/>
                             Small leaves 
                            <ellipse cx="-12" cy="-8" rx="15" ry="12" fill="${color}" opacity="0.9"/>
                            <ellipse cx="12" cy="0" rx="15" ry="12" fill="${color}" opacity="0.9"/>
                            <ellipse cx="0" cy="-15" rx="18" ry="15" fill="${color}"/>
                             NDVI label 
                            <text x="0" y="38" text-anchor="middle" fill="white" font-size="18" font-weight="bold" style="text-shadow: 0 1px 3px rgba(0,0,0,0.5);">${ndvi.toFixed(2)}</text>
                        </g>
                    </svg>
                `;
            } else {
                // Bare soil - ground/rock shape
                return `
                    <svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
                        <g transform="translate(60, 60)">
                             Ground mound 
                            <ellipse cx="0" cy="8" rx="42" ry="27" fill="${color}" opacity="0.9"/>
                            <ellipse cx="-15" cy="0" rx="22" ry="18" fill="${color}" opacity="0.7"/>
                            <ellipse cx="18" cy="5" rx="27" ry="21" fill="${color}" opacity="0.8"/>
                             NDVI label 
                            <text x="0" y="12" text-anchor="middle" fill="white" font-size="18" font-weight="bold" style="text-shadow: 0 1px 3px rgba(0,0,0,0.5);">${ndvi.toFixed(2)}</text>
                        </g>
                    </svg>
                `;
            }
        }

        function createCustomIcon(ndvi) {
            return L.divIcon({
                className: 'custom-div-icon',
                html: `<div class="vegetation-pin">${getVegetationShape(ndvi)}</div>`,
                iconSize: [120, 120],
                iconAnchor: [60, 60],
                popupAnchor: [0, -60]
            });
        }

        qldLocations.forEach(loc => {
            const marker = L.marker(loc.coords, { icon: createCustomIcon(loc.ndvi) }).addTo(map);

            marker.on('mouseover', function () {
                const tooltip = document.getElementById('pin-tooltip');
                document.getElementById('tooltip-name').textContent = loc.name;
                document.getElementById('tooltip-description').textContent = loc.description;
                document.getElementById('tooltip-ndvi').textContent = `NDVI: ${loc.ndvi.toFixed(2)}`;
                document.getElementById('tooltip-category').textContent = getNDVICategory(loc.ndvi);
                tooltip.style.display = 'block';
            });

            marker.on('mouseout', function () {
                document.getElementById('pin-tooltip').style.display = 'none';
            });


            function goToGame(ndvi, index) {
                const ndviStr = ndvi.toFixed(2);
                window.location.href = `main.html?ndvi=${encodeURIComponent(ndviStr)}&area=${encodeURIComponent(index)}`;
            }

            qldLocations.forEach((loc, idx) => {
                const marker = L.marker(loc.coords, { icon: createCustomIcon(loc.ndvi) }).addTo(map);

                marker.on('click', function () {
                    goToGame(loc.ndvi, idx); 
                });
            });
        });
 