const API_KEY = 'TU_API_KEY';

// Inicializar mapa
const map = L.map('map').setView([40.4168, -3.7038], 6);
const baseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 });
baseLayer.addTo(map);

// Crear una capa de radar
let radarLayer = null;

// Cambiar capa de radar
function updateLayer(layerType, opacity) {
    if (radarLayer) map.removeLayer(radarLayer);
    radarLayer = L.tileLayer(`https://tile.openweathermap.org/map/${layerType}/{z}/{x}/{y}.png?appid=${API_KEY}`, {
        opacity: opacity,
    });
    radarLayer.addTo(map);
}

// Manejar cambios en los controles
document.getElementById('layerSelect').addEventListener('change', (e) => {
    const layerType = e.target.value;
    const opacity = document.getElementById('opacityRange').value;
    updateLayer(layerType, opacity);
});

document.getElementById('opacityRange').addEventListener('input', (e) => {
    const opacity = e.target.value;
    const layerType = document.getElementById('layerSelect').value;
    updateLayer(layerType, opacity);
});

// Datos iniciales
updateLayer('precipitation_new', 0.5);

// Gráfico de datos históricos con Chart.js
async function fetchWeatherData() {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=40.4168&lon=-3.7038&appid=${API_KEY}`);
    const data = await response.json();
    return data;
}

fetchWeatherData().then((data) => {
    const labels = data.list.map((item) => item.dt_txt);
    const precipitation = data.list.map((item) => item.rain ? item.rain['3h'] || 0 : 0);

    const ctx = document.getElementById('weatherChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'Precipitación (mm)',
                    data: precipitation,
                    borderColor: 'blue',
                    fill: true,
                },
            ],
        },
    });
});
