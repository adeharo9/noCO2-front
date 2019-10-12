
var map;

window.initMap = function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 8
    });
};

const drawRoute = (route) => {
    alert(JSON.stringify(route));
    $('#form_calc').hide();
    $('#map').show();
};

export { drawRoute };
