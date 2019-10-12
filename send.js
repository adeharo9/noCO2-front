import {drawRoute} from "./routeViewer.js";

$(document).ready(function() {
    
    $('#dropdown').on('change',function () {
        console.log($('#dropdown :selected').val());
        if($('#dropdown :selected').val() === "transit"){
            $('#waypoint').hide();
            $('#waypoints').children('input').remove();
        }else{
            $('#waypoint').show();
        }
    });
    
    $('#calculate').on('click',function(e){
        e.preventDefault();
        let origin = $('#origin').val();
        let destination = $('#destination').val();
        let typeVehicle = $('#dropdown :selected').val();
        // Waypoints
        let waypoints = "";
        let counter = 0;
        $('#waypoints').children('input').each(function () {
            let place = $( this ).val();
            if(counter==0){
                waypoints += place;
            } else {
                waypoints += "|" + place;
            }
            counter++;
        });
        // ******
        if(origin.length == 0 || destination.length == 0){
            alert("Some field/s is/are empty.");
        }else{
            let parameters = { origin: origin, destination: destination, mode: typeVehicle, waypoints: waypoints, key: "AIzaSyC3bQgaJnuDJpHWCDjQoJGHgDcUyPcVXCM" };
            $.get( "http://104.248.40.235:8080/emissions/", parameters, drawRoute);
        }
    });

    $('#waypoint').on('click',function(e){
        e.preventDefault();
        $('#waypoints').append("<input style='margin-top: 10px;margin-bottom: 10px' type='text' class='form-control' placeholder='Enter waypoint'>");
    });

    $('#contact').on('click',function(e){
        e.preventDefault();
        let name = $('#name').val();
        let surname = $('#surname').val();
        let email = $('#email').val();
        let message = $('#message').val();
        alert("Nombre: " + origin + " apellidos: " + surname + " email: " + email + " message: " + message);
        let parameters = { name: name, surname: surname, email: email, message: message };
        $.get( "http://104.248.40.235:8080/contact/", parameters, function(_) {
            $('#form_calc').remove();
            $('#container').html("<h2>Thank you for contacting with us, we will give you a response as soon as possible!</h2>");
        });
    });
});