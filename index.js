const gardenData = [
    {
        id: 1,
        name: '🌳 Garden #1',
        graphName: 'Garden #1 Temperature Graph',
        csvFile: 'temperature_data_day1.csv',
        hours: [],
        celciusTemperatureData: [],
        farenheitTemperatureData: [],
        humidityData: [],
        waterLevelData: [],
        sunlightData: [],
        waterPumpStatusData: [],
        graphStartIndex: 0,
        graphEndIndex: 0
    },
    {
        id: 2,
        name: '🌳 Garden #2',
        graphName: 'Garden #2 Temperature Graph',
        csvFile: 'temperature_data_day2.csv',
        hours: [],
        celciusTemperatureData: [],
        farenheitTemperatureData: [],
        humidityData: [],
        waterLevelData: [],
        sunlightData: [],
        waterPumpStatusData: [],
        graphStartIndex: 0,
        graphEndIndex: 0
    },
    {
        id: 3,
        name: '🌳 Garden #3',
        graphName: 'Garden #3 Temperature Graph',
        csvFile: 'temperature_data_day3.csv',
        hours: [],
        celciusTemperatureData: [],
        farenheitTemperatureData: [],
        humidityData: [],
        waterLevelData: [],
        sunlightData: [],
        waterPumpStatusData: [],
        graphStartIndex: 0,
        graphEndIndex: 0
    }
];

createGardenInterfaces();

async function createGardenInterfaces() {
    const container = document.getElementById('garden-container');

    // There will be three divs each with their own data
    for(const garden of gardenData){
        await getData(garden);

        const mainDiv = document.createElement('div');
        mainDiv.className = 'maindiv';

        // The info div will contain all of the most up-to-date information about the garden
        const infoDiv = document.createElement('div');
        infoDiv.className = 'infodiv';

        const text = document.createElement('p');
        text.className = 'gardennumbertext';
        text.textContent = garden.name;

        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'buttonscontainer';

        const topButtonsContainer = document.createElement('div');
        topButtonsContainer.className = 'topbuttonscontainer';

        const bottomButtonsContainer = document.createElement('div');
        bottomButtonsContainer.className = 'bottombuttonscontainer';

        const temperatureButton = document.createElement('button');
        temperatureButton.id = `temperaturebutton`;
        temperatureButton.className = 'infobutton';
        temperatureButton.classList.add('celcius'); // Default to Celcius
        temperatureButton.classList.add('active'); // Set as active by default
        const temperatureText = document.createElement('p');
        temperatureText.textContent = 'Temperature';

        const humidityButton = document.createElement('button');
        humidityButton.id = `humiditybutton`;
        humidityButton.className = 'infobutton';
        const humidityText = document.createElement('p');
        humidityText.textContent = 'Humidity';

        const waterLevelButton = document.createElement('button');
        waterLevelButton.id = `waterlevelbutton`;
        waterLevelButton.className = 'infobutton';
        const waterLevelText = document.createElement('p');
        waterLevelText.textContent = 'Water Level';

        const sunlightButton = document.createElement('button');
        sunlightButton.id = `sunlightbutton`;
        sunlightButton.className = 'infobutton';
        const sunlightText = document.createElement('p');
        sunlightText.textContent = 'Sunlight';

        const waterPumpButton = document.createElement('button');
        waterPumpButton.id = `waterpumpbutton`;
        waterPumpButton.className = 'infobutton';
        const waterPumpText = document.createElement('p');
        waterPumpText.textContent = 'Water Pump Status';

        const lastIndexOfData = garden.celciusTemperatureData.length - 1;

        const latestTemperatureData = document.createElement('p');
        latestTemperatureData.className = 'data';
        latestTemperatureData.textContent = String(garden.celciusTemperatureData[lastIndexOfData]);
        const latestHumidityData = document.createElement('p');
        latestHumidityData.className = 'data';
        latestHumidityData.textContent = `${garden.humidityData[lastIndexOfData]}%`
        const latestWaterLevelData = document.createElement('p');
        latestWaterLevelData.className = 'data';
        latestWaterLevelData.textContent = `${garden.waterLevelData[lastIndexOfData]}%`
        const latestSunlightData = document.createElement('p');
        latestSunlightData.className = 'data';
        latestSunlightData.textContent = garden.sunlightData[lastIndexOfData];
        const latestWaterPumpData = document.createElement('p');
        latestWaterPumpData.className = 'data';
        latestWaterPumpData.textContent = garden.waterPumpStatusData[lastIndexOfData];

        infoDiv.appendChild(text);
        infoDiv.appendChild(buttonsContainer);

        buttonsContainer.appendChild(topButtonsContainer);
        buttonsContainer.appendChild(bottomButtonsContainer);

        topButtonsContainer.appendChild(temperatureButton);
        topButtonsContainer.appendChild(humidityButton);
        topButtonsContainer.appendChild(waterLevelButton);

        bottomButtonsContainer.appendChild(sunlightButton);
        bottomButtonsContainer.appendChild(waterPumpButton);

        temperatureButton.appendChild(latestTemperatureData);
        temperatureButton.appendChild(temperatureText);
        humidityButton.appendChild(latestHumidityData);
        humidityButton.appendChild(humidityText);
        waterLevelButton.appendChild(latestWaterLevelData);
        waterLevelButton.appendChild(waterLevelText);
        sunlightButton.appendChild(latestSunlightData);
        sunlightButton.appendChild(sunlightText);
        waterPumpButton.appendChild(latestWaterPumpData);
        waterPumpButton.appendChild(waterPumpText);

        const graphDiv = document.createElement('div');
        graphDiv.className = 'graphdiv';

        const canvas = document.createElement('canvas');
        canvas.id = `chart-${garden.id}`;
        canvas.className = 'chart';

        temperatureButton.addEventListener('click', function () {
            if (!this.classList.contains('active')) {
                toggleButton(this);
                const update = updateGraph(garden.hours, garden.celciusTemperatureData, garden.id, 'blue');
                update();
            }
            else if(this.classList.contains('celcius')) {
                this.classList.remove('celcius');
                this.classList.add('farenheit');
                latestTemperatureData.textContent = String(garden.farenheitTemperatureData[garden.farenheitTemperatureData.length - 1]);
                const update = updateGraph(garden.hours, garden.farenheitTemperatureData, garden.id, 'red');
                update();
            }
            else {
                this.classList.remove('farenheit');
                this.classList.add('celcius');
                latestTemperatureData.textContent = String(garden.celciusTemperatureData[garden.celciusTemperatureData.length - 1]);
                const update = updateGraph(garden.hours, garden.celciusTemperatureData, garden.id, 'blue');
                update();
            }
        });

        humidityButton.addEventListener('click', function () {
            if (!this.classList.contains('active')) {
                toggleButton(this);
                const update = updateGraph(garden.hours, garden.humidityData, garden.id, 'rgba(128, 128, 128, 1)');
                update();
            }
        });

        waterLevelButton.addEventListener('click', function () {
            if (!this.classList.contains('active')) {
                toggleButton(this);
                const update = updateGraph(garden.hours, garden.waterLevelData, garden.id, 'rgba(144, 215, 245, 1)');
                update();
            }
        });

        sunlightButton.addEventListener('click', function () {
            if (!this.classList.contains('active')) {
                toggleButton(this);
                const update = updateGraph(garden.hours, garden.sunlightData, garden.id, 'orange');
                update();
            }
        });

        graphDiv.appendChild(canvas);

        mainDiv.appendChild(infoDiv);
        mainDiv.appendChild(graphDiv);
        container.appendChild(mainDiv);

        await createChart(garden);
    }
}

function toggleButton(button) {
    const activeButtons = document.querySelectorAll('.infobutton.active');
    activeButtons.forEach(activeButton => {
        if (activeButton !== button) {
            activeButton.classList.remove('active');
        }
    });
    button.classList.toggle('active');
}

// This function uses the data given from the async call to getData() in order to create the chart
async function createChart(garden) {
    // This creates a custom grey border for the data that looks like the border for klipper charts
    const customBorder = {
        id: 'customBorder',
        afterDatasetsDraw(chart, args, pluginOptions) {
            const { ctx, chartArea: { top, bottom, left, right, width, height } } = chart;

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

    const chartId = `chart-${garden.id}`
    const ctx = document.getElementById(chartId);
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: garden.hours.slice(garden.graphStartIndex, garden.graphEndIndex),
            datasets: [{
                label: garden.graphName,
                data: garden.celciusTemperatureData.slice(garden.graphStartIndex, garden.graphEndIndex),
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

function updateGraph(newLabels, newData, canvasId, color) {
    return function() {
        const chartId = `chart-${canvasId}`;
        const chart = Chart.getChart(chartId);
        if (chart) {
            chart.data.labels = newLabels;
            chart.data.datasets[0].data = newData;
            chart.data.datasets[0].backgroundColor = color;
            chart.data.datasets[0].borderColor = color;
            chart.update();
        }
    }
}

async function getData(garden) {
    const response = await fetch(garden.csvFile);
    const data = await response.text();

    const table = data.split('\n').slice(1);

    table.forEach(row => {
        const columns = row.split(',');
        const day = columns[0];
        const hour = columns[1];
        garden.hours.push(hour);
        const celciusTemperature = columns[2];
        garden.celciusTemperatureData.push(celciusTemperature);
        const farenheitTemperature = convertCelciusToFarenheit(celciusTemperature);
        garden.farenheitTemperatureData.push(farenheitTemperature);
        const humidity = columns[3];
        garden.humidityData.push(humidity);
        const waterLevel = columns[4];
        garden.waterLevelData.push(waterLevel);
        const sunlight = columns[5];
        garden.sunlightData.push(sunlight);
        const waterPumpStatus = columns[6];
        garden.waterPumpStatusData.push(waterPumpStatus);
    });

    garden.graphStartIndex = garden.celciusTemperatureData.length - 8;
    garden.graphEndIndex = garden.celciusTemperatureData.length;

    console.log(garden.hours, garden.celciusTemperatureData, garden.farenheitTemperatureData, 
                garden.humidityData, garden.waterLevelData, garden.sunlightData, 
                garden.waterPumpStatusData);
}

function convertCelciusToFarenheit(temperature) {
    return Math.round(temperature * (9 / 5) + 32);
}
