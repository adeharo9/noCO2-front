
var map;

var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
function addMarker(location, labelIndex) {
    // Add the marker at the clicked location, and add the next-available label
    // from the array of alphabetical characters.
    new google.maps.Marker({
        position: location,
        label: labels[labelIndex % labels.length],
        map: map
    });
}

let globalRoot;
let texInfoEmissions;
let polylines = [];

const drawRoute = (root) => {
    globalRoot = root;
    $('#form_calc').hide();
    const $map = $('#map-container').show();

    console.log(root)

    texInfoEmissions = new google.maps.InfoWindow();

    map = new google.maps.Map(document.getElementById('map'));

    let bounding = {
        northeast: {
            lat: -99999999,
            lng: -99999999
        },
        southwest: {
            lat: 99999999,
            lng: 99999999
        }
    };
    for (const route of root.routes)
    {
        if (route.bounds.northeast.lat > bounding.northeast.lat)
        {
            bounding.northeast.lat = route.bounds.northeast.lat;
        }
        if (route.bounds.northeast.lng > bounding.northeast.lng)
        {
            bounding.northeast.lng = route.bounds.northeast.lng;
        }
        if (route.bounds.southwest.lat < bounding.southwest.lat)
        {
            bounding.southwest.lat = route.bounds.southwest.lat;
        }
        if (route.bounds.southwest.lng < bounding.southwest.lng)
        {
            bounding.southwest.lng = route.bounds.southwest.lng;
        }
    }

    const bounds = new google.maps.LatLngBounds(bounding.southwest, bounding.northeast);
    map.fitBounds(bounds);

    let i = 0;

    for (const route of root.routes)
    {
        polylines.push([]);
        var labelIndex = 0;

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

        addMarker(route.legs[0].start_location, labelIndex);
        ++labelIndex;

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

                redLevel = redLevel.toString(16).padStart(2, "0");
                greenLevel = greenLevel.toString(16).padStart(2, "0");

                var flightPath = new google.maps.Polyline({
                    path: points,
                    strokeColor: `#${redLevel}${greenLevel}00`,
                    strokeOpacity: 1.0,
                    strokeWeight: 5
                });
                let transitDetails = step.transit_details;
                if (transitDetails !== undefined) {
                    let line = transitDetails.line;
                    if (line !== undefined) {
                        let vehicle = line.vehicle;
                        if (vehicle !== undefined) {
                            let icon = vehicle.icon;
                            if (icon !== undefined) {
                                flightPath.iconUrl = icon;
                            }
                        }
                    }
                }
                flightPath.emission = step.emissions.co2;
                flightPath.addListener("mouseover", polyLineMouseOver);
                flightPath.addListener("mouseout", polyLineMouseOut);
                flightPath.setMap(map);
                polylines[i].push(flightPath);
            }

            addMarker(leg.end_location, labelIndex);
            ++labelIndex;
        }
        ++i;
    }
};

function polyLineMouseOver(event) {
    if (this.iconUrl !== undefined) {
        const $image = $("<img>").prop("src", this.iconUrl);
        const $div = $("<div>");
        $div.append($image);
        $div.append(this.emission.toFixed(4) + "g CO2");
        texInfoEmissions.setContent($div[0]);
    }
    else {
        texInfoEmissions.setContent(this.emission.toFixed(4) + "g CO2");
    }
    texInfoEmissions.setPosition(event.latLng);
    texInfoEmissions.open(map);
}

function polyLineMouseOut(event) {
    texInfoEmissions.close();
}

export { drawRoute, polylines };
