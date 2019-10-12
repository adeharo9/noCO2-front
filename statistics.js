const template = `
<div class="statistics-box">
    <b>Total distance:</b>
    <div name="total-distance"></div>
    <b>Total time:</b>
    <div name="total-time"></div>
    <b>Total CO2 emissions:</b>
    <div name="total-co2-emissions"></div>
</div>
`;

const statistics = (json) =>
{
    for(const route of json.routes)
    {
        const $div = $(template);

        let totalDistance = 0;
        let totalTime = 0;
        for (const leg of route.legs)
        {
            totalDistance += leg.distance.value;
            totalTime += leg.duration.value;
        }

        totalDistance /= 1000;  /* km */
        totalTime /= 60;    /* min */

        $div.find('div[name=total-distance]').text(`${totalDistance.toPrecision(5)} km`);
        $div.find('div[name=total-time]').text(`${totalTime.toPrecision(5)} min`);
        $div.find('div[name=total-co2-emissions]').text(`${route.emissions.co2.toPrecision(5)} g CO2`);
        $('#statistics-container').append($div);
    }
};

export { statistics };
