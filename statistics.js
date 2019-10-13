import { polylines } from "./routeViewer.js";

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

let someSelected = false;

const statistics = (json) =>
{
    let i = 0;
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
        $div.prop('data-i', i);
        $div.on('mouseenter', () =>
        {
            if (someSelected) { return; }

            let i = $div.prop('data-i');
            for (let j = 0; j < json.routes.length; ++j)
            {
                if (j === i) { continue; }

                for (const polyline of polylines[j])
                {
                    polyline.setVisible(false);
                }
            }
        });
        $div.on('mouseleave', () =>
        {
            if (someSelected) { return; }

            let i = $div.prop('data-i');
            for (let j = 0; j < json.routes.length; ++j)
            {
                if (j === i) { continue; }

                for (const polyline of polylines[j])
                {
                    polyline.setVisible(true);
                }
            }
        });
        $div.on('click', () =>
        {
            const selected = $div.prop('data-selected');
            if (!someSelected && (selected === undefined || selected === false))
            {
                $div.prop('data-selected', true);
                someSelected = true;
            }
            else if (someSelected && selected !== undefined && selected === true)
            {
                $div.prop('data-selected', false);
                someSelected = false;
            }
        });

        $('#statistics-container').append($div);

        ++i;
    }
};

export { statistics };
