import {drawRoute} from "./routeViewer.js";
import { statistics } from "./statistics.js";

$(document).ready(function() {
    
    $('#dropdown').on('change',function () {
        if($('#dropdown :selected').val() === "transit"){
            $('#waypoint').hide();
            $('#waypoints').children('input').remove();
            $('#remove_waypoint').remove();
        }else{
            $('#waypoint').show();
        }
    });
    $('#time_select').on('change', function () {
        if($('#time_select :selected').val() === "nothing")
        {
            $('#desired_time').hide();
        }
    });

    $('#time_select').on('change', function () {
        if($('#time_select :selected').val() !== "nothing")
        {
            $('#desired_time').show();
        }
    });

    $('#calculate').on('click',function(e){
        e.preventDefault();
        let origin = $('#origin').val();
        let destination = $('#destination').val();
        let typeVehicle = $('#dropdown :selected').val();
        let emission_index = $('#dropdown_emission :selected').val();
        // WAYPOINTS
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

        // ALTERNATIVES
        let alternatives = false;
        if( $('#alternatives').prop('checked') ) {
            alternatives = true;
        }
        // ******

        // TIME
        let nothing = false;
        let departure = true;
        if($('#time_select :selected').val() == "nothing"){
            nothing = true;
        }else if($('#time_select :selected').val() == "arrival"){
            departure = false;
        }
        let fechaMili = new Date($('#time_local').val()).getTime();
        // *****
        if(origin.length == 0 || destination.length == 0){
            alert("Some field/s is/are empty.");
        }else{
            let parameters;
            if(departure && !nothing){
                parameters = { origin: origin, destination: destination, mode: typeVehicle, emission_index: emission_index, waypoints: waypoints, alternatives: alternatives, departure_time: fechaMili/1000, key: "AIzaSyC3bQgaJnuDJpHWCDjQoJGHgDcUyPcVXCM" };
            }else if(!departure && !nothing){
                parameters = { origin: origin, destination: destination, mode: typeVehicle, emission_index: emission_index, waypoints: waypoints, alternatives: alternatives, arrival_time: fechaMili/1000, key: "AIzaSyC3bQgaJnuDJpHWCDjQoJGHgDcUyPcVXCM" };
            }else{
                parameters = { origin: origin, destination: destination, mode: typeVehicle, emission_index: emission_index, waypoints: waypoints, alternatives: alternatives, key: "AIzaSyC3bQgaJnuDJpHWCDjQoJGHgDcUyPcVXCM" };
            }
            $.get( "http://104.248.40.235:8080/emissions/", parameters, (json) =>
            {
                statistics(json);
                drawRoute(json);
            });
        }
    });

    $('#waypoint').on('click',function(e){
        e.preventDefault();

        const $input = $('<input style=\'margin-top: 10px;\' type=\'text\' class=\'form-control col-md-8\' placeholder=\'Enter waypoint\'>');
        const $button = $('<div class="col-md-3"><button style=\"margin-top: 10px;color: white;background-color: #1b1e21\" class=\"btn btn-default\" name=\"remove_waypoint\">Remove waypoint</button></div>');
        const $div = $('<div class=\'row\'>');

        $div.append($input);
        $div.append($button);

        $('#waypoints').append($div);
        $button.on('click', function (e) {
            e.preventDefault();
            $(this).parent().remove();
        });
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