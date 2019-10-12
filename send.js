import {drawRoute} from "./routeViewer.js";

$(document).ready(function() {
    
    $('#dropdown').on('change',function () {
        console.log($('#dropdown :selected').val());
        if($('#dropdown :selected').val() === "transit"){
            $('#waypoint').hide();
            $('#waypoints').children('input').remove();
            $('#remove_waypoint').remove();
        }else{
            $('#waypoint').show();
        }
    });
    $('#nothing').click(function () {
        $('#desired_time').hide()
    });

    $('.timeArrDep').click(function () {
        $('#desired_time').show()
    });

    $('#calculate').on('click',function(e){
        e.preventDefault();
        let origin = $('#origin').val();
        let destination = $('#destination').val();
        let typeVehicle = $('#dropdown :selected').val();
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
        if($('input:radio[name=time_radio]:checked').val() == "nothing"){
            nothing = true;
        }else if($('input:radio[name=time_radio]:checked').val() == "arrival"){
            departure = false
        }
        let fechaMili = new Date($('#time_local').val()).getTime();
        // *****
        if(origin.length == 0 || destination.length == 0){
            alert("Some field/s is/are empty.");
        }else{
            let parameters;
            if(departure && !nothing){
                parameters = { origin: origin, destination: destination, mode: typeVehicle, waypoints: waypoints, alternatives: alternatives, departure_time: fechaMili/1000, key: "AIzaSyC3bQgaJnuDJpHWCDjQoJGHgDcUyPcVXCM" };
            }else if(!departure && !nothing){
                parameters = { origin: origin, destination: destination, mode: typeVehicle, waypoints: waypoints, alternatives: alternatives, arrival_time: fechaMili/1000, key: "AIzaSyC3bQgaJnuDJpHWCDjQoJGHgDcUyPcVXCM" };
            }else{
                parameters = { origin: origin, destination: destination, mode: typeVehicle, waypoints: waypoints, alternatives: alternatives, key: "AIzaSyC3bQgaJnuDJpHWCDjQoJGHgDcUyPcVXCM" };
            }
            $.get( "http://104.248.40.235:8080/emissions/", parameters, drawRoute);
        }
    });

    $('#waypoint').on('click',function(e){
        e.preventDefault();
        $('#waypoints').append("<input style='margin-top: 10px;margin-bottom: 10px' type='text' class='form-control' placeholder='Enter waypoint'>");
        if($('#waypoints').children().length > 0 && !$('#remove_waypoint').length){
            $('#waypoint').after("<button style=\"color: white;margin-left:15px;background-color: #1b1e21\" class=\"btn btn-default\" id=\"remove_waypoint\">Remove waypoint</button>")
            $('#remove_waypoint').on('click', function (e) {
                e.preventDefault();
                $('#waypoints').children().last().remove();
                if($('#waypoints').children().length == 0){
                    $('#remove_waypoint').remove();
                }
            });
        }
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