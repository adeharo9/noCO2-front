$(document).ready(function() {
    $('#calculate').on('click',function(e){
        e.preventDefault();
        let origin = $('#origin').val();
        let destination = $('#destination').val();
        alert("Origen: " + origin + " Destination: " + destination);
            let parameters = { origin: origin, destination: destination };
            $.get( "http://104.248.40.235/emissions/", parameters, function(data) {
                alert(JSON.stringify(data));
                $('#form_calc').remove();
                $('#container').html(JSON.stringify(data));
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
        $.get( "http://104.248.40.235/contact/", parameters, function(data) {
            alert(JSON.stringify(data));
            $('#form_calc').remove();
            $('#container').html("<h2>Thank you for contacting with us, we will give you a response as soon as possible!</h2>");
        });
    });
});