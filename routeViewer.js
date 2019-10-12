
var map;

window.initMap = function initMap() {
    /*map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 8
    });

    const infoWin = new google.maps.InfoWindow({content: "Hi", position: {lat: -34.397, lng: 150.644}});
    infoWin.open(map);
    const marker = new google.maps.Marker({position: {lat: -34.397, lng: 150.644}, map: map})*/
};

const drawRoute = (root) => {
    console.log(JSON.stringify(root));
    $('#form_calc').hide();
    $('#map').show();

    const startPoint = root.routes[0].legs[0].start_location;
    const endPoint = root.routes[0].legs[0].end_location;

    let points = polyline.decode(root.routes[0].overview_polyline.points);

    console.log(points);

    points = points.map(([a,b]) => {return {lat: a, lng: b}});

    console.log(points);

    const centerPoint = {lat: (startPoint.lat+endPoint.lat)/2, lng: (startPoint.lng+endPoint.lng)/2};

    map = new google.maps.Map(document.getElementById('map'), {
        center: centerPoint,
        zoom: 7.5
    });

    var flightPath = new google.maps.Polyline({
        path: points,
        geodesic: true,
        strokeColor: '#FF0000',
        strokeOpacity: 1.0,
        strokeWeight: 2
    });

    flightPath.setMap(map);
};

export { drawRoute };
