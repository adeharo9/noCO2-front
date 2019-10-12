
var map;

window.initMap = function initMap() {
};

var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
var labelIndex = 0;
function addMarker(location) {
    // Add the marker at the clicked location, and add the next-available label
    // from the array of alphabetical characters.
    new google.maps.Marker({
        position: location,
        label: labels[labelIndex++ % labels.length],
        map: map
    });
}

const drawRoute = (root) => {
    console.log(JSON.stringify(root));
    $('#form_calc').hide();
    const $map = $('#map').show();

    const route = root.routes[0];

    map = new google.maps.Map(document.getElementById('map'));
    const bounds = new google.maps.LatLngBounds(route.bounds.southwest, route.bounds.northeast);
    map.fitBounds(bounds);

    let minEmission = 99999999;
    let maxEmission = -1;

    for (const leg of route.legs) {
        for (const step of leg.steps) {
            const emissions = step.emissions.co2;

            if (emissions < minEmission) {
                minEmission = emissions;
            }
            if (emissions > maxEmission) {
                maxEmission = emissions;
            }
        }
    }

    addMarker(route.legs[0].start_location);

    for (const leg of route.legs) {
        for (const step of leg.steps) {
            let points = polyline.decode(step.polyline.points);

            points = points.map(([a, b]) => {
                return {lat: a, lng: b}
            });

            const rateEmissions = Math.floor((step.emissions.co2-minEmission)/(maxEmission-minEmission)*255);

            let redLevel;
            let greenLevel;
            if (rateEmissions < 128) {
                redLevel = 2*rateEmissions;
                greenLevel = 255;
            }
            else {
                redLevel = 255;
                greenLevel = (255 - rateEmissions)*2;
            }

            console.log(rateEmissions);
            redLevel = redLevel.toString(16).padStart(2, "0");
            greenLevel = greenLevel.toString(16).padStart(2, "0");
            console.log(redLevel);

            var flightPath = new google.maps.Polyline({
                path: points,
                geodesic: true,
                strokeColor: `#${redLevel}${greenLevel}00`,
                strokeOpacity: 1.0,
                strokeWeight: 2
            });

            flightPath.setMap(map);
        }

        addMarker(leg.end_location);
    }
};

export { drawRoute };