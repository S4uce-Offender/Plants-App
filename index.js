const gardenData = [
    {
      id: 1,
      name: 'Garden #1',
      csvFile: 'temperature_data_day1.csv',
      temperatureData: [],
      hours: []
    },
    {
      id: 2,
      name: 'Garden #2',
      csvFile: 'temperature_data_day2.csv',
      temperatureData: [],
      hours: []
    },
    {
      id: 3,
      name: 'Garden #3',
      csvFile: 'temperature_data_day3.csv',
      temperatureData: [],
      hours: []
    }
  ];



async function createChart(garden) {
    await getData(garden);
    const ctx = document.getElementById('chart');
    const chart = new Chart(ctx, {
        type: 'line',
        temperatureData: {
            labels: xlabels,
            datasets: [{
                label: 'Recorded Temperature',
                temperatureData: temperatureData,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
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

        console.log(day, hour, celciusTemperature, farenheitTemperature);
    });
}

function convertCelciusToFarenheit(temperature) {
    return Math.round(temperature * (9 / 5) + 32);
}

