const drawRoute = (route) => {
    alert(JSON.stringify(route));
    $('#form_calc').remove();
    $('#container').html(JSON.stringify(route));
};

export { drawRoute };
