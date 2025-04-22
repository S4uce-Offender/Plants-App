const gardenData = [
    {
        id: 1,
        name: '🌳 Garden #1',
        graphName: 'Garden #1 Temperature Graph',
        csvFile: 'temperature_data_day1.csv',
        temperatureData: [],
        hours: []
    },
    {
        id: 2,
        name: '🌳 Garden #2',
        graphName: 'Garden #2 Temperature Graph',
        csvFile: 'temperature_data_day2.csv',
        temperatureData: [],
        hours: []
    },
    {
        id: 3,
        name: '🌳 Garden #3',
        graphName: 'Garden #3 Temperature Graph',
        csvFile: 'temperature_data_day3.csv',
        temperatureData: [],
        hours: []
    }
];

createGardenInterfaces();

function createGardenInterfaces() {
    const container = document.getElementById('garden-container');

    gardenData.forEach(garden => {
        const mainDiv = document.createElement('div');
        mainDiv.className = 'maindiv';

        const infoDiv = document.createElement('div');
        infoDiv.className = 'infodiv';

        const text = document.createElement('p');
        text.className = 'gardennumbertext';
        text.textContent = garden.name;

        infoDiv.appendChild(text);

        const graphDiv = document.createElement('div');
        graphDiv.className = 'graphdiv';

        const canvas = document.createElement('canvas');
        canvas.id = `chart-${garden.id}`;
        canvas.className = 'chart';
        graphDiv.appendChild(canvas);

        mainDiv.appendChild(infoDiv);
        mainDiv.appendChild(graphDiv);
        container.appendChild(mainDiv);

        createChart(garden);
    });
}

async function createChart(garden) {
    // This creates a custom grey border for the data that looks like the border for klipper charts
    const customBorder = {
        id:'customBorder',
        afterDatasetsDraw(chart, args, pluginOptions) {
            const {ctx, chartArea: {top, bottom, left, right, width, height}} = chart;

            ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'rgba(66, 73, 74, 1)';

        const offset = ctx.lineWidth / 2;

        ctx.moveTo(left - offset, top - offset);
        ctx.lineTo(right + offset, top - offset);
        ctx.lineTo(right + offset, bottom + offset);
        ctx.lineTo(left - offset, bottom + offset);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
        }

    }
    await getData(garden);

    const chartId = `chart-${garden.id}`
    const ctx = document.getElementById(chartId);
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: garden.hours,
            datasets: [{
                label: garden.graphName,
                data: garden.temperatureData,
                borderWidth: 1
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false
                }
            },
            interaction: {
                mode: 'index',
                intersect: false
            },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    drawBorder: false,
                    ticks: {
                        font: {
                            weight: 'bold'
                        }
                    }
                },
                y: {
                    beginAtZero: false,
                    drawBorder: false,
                    ticks: {
                        font: {
                            weight: 'bold'
                        }
                    }
                }
            }
        },
        plugins: [customBorder]
    });
}

async function getData(garden) {
    const response = await fetch(garden.csvFile);
    const temperatureData = await response.text();

    const table = temperatureData.split('\n').slice(1);

    table.forEach(row => {
        const columns = row.split(',');
        const day = columns[0];
        const hour = columns[1];
        garden.hours.push(hour);
        const celciusTemperature = columns[2];
        garden.temperatureData.push(celciusTemperature);
        const farenheitTemperature = convertCelciusToFarenheit(celciusTemperature);
    });

    console.log(garden.hours, garden.temperatureData);   
}

function convertCelciusToFarenheit(temperature) {
    return Math.round(temperature * (9 / 5) + 32);
}
