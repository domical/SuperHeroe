$(document).ready(function() {
    $('.search-form').on('submit', function(event) {
        event.preventDefault();
        const heroId = $('.hero-id').val();

        // Validar que el ID sea un número
        if (!/^\d+$/.test(heroId)) {
            alert('Por favor, ingresa un número válido.');
            return;
        }

        // Consultar la API
        fetchHeroData(heroId);
    });
});

function fetchHeroData(heroId) {
    const accessToken = '4905856019427443'; // Reemplaza con tu token de acceso si es necesario
    const apiUrl = `https://www.superheroapi.com/api.php/${accessToken}/${heroId}`;

    $.ajax({
        url: apiUrl,
        method: 'GET',
        success: function(data) {
            // Verificar si se recibió un héroe válido
            if (data && data.id) {
                renderHeroInfo(data);
                renderPowerStats(data.powerstats);
            } else {
                alert('Héroe no encontrado. Asegúrate de que el ID sea correcto.');
            }
        },
        error: function() {
            alert('Error al buscar el superhéroe. Asegúrate de que el ID sea correcto.');
        }
    });
}

function renderHeroInfo(hero) {
    const cardHtml = `
        <div class="col-md-4 hero-card">
            <div class="card">
                <img src="${hero.image.url}" class="card-img-top" alt="${hero.name}">
                <div class="card-body">
                    <h5 class="card-title">${hero.name}</h5>
                    <p class="card-text">Nombre real: ${hero.biography['full-name'] || 'N/A'}</p>
                    <p class="card-text">Publicador: ${hero.biography.publisher || 'N/A'}</p>
                    <p class="card-text">Ocupación: ${hero.work.occupation || 'N/A'}</p>
                    <p class="card-text">Primera aparición: ${hero.biography['first-appearance'] || 'N/A'}</p>
                    <p class="card-text">Altura: ${hero.appearance.height.join(', ') || 'N/A'}</p>
                    <p class="card-text">Peso: ${hero.appearance.weight.join(', ') || 'N/A'}</p>
                    <p class="card-text">Alias: ${hero.biography.aliases.join(', ') || 'N/A'}</p>
                </div>
            </div>
        </div>
    `;
    $('.hero-info').html(cardHtml);
}

function renderPowerStats(powerstats) {
    // Verifica que powerstats tenga datos válidos
    if (!powerstats) {
        alert('No se pudieron obtener las estadísticas de poder.');
        return;
    }

    const chartData = [
        { label: "Inteligencia", y: parseInt(powerstats.intelligence) },
        { label: "Fuerza", y: parseInt(powerstats.strength) },
        { label: "Velocidad", y: parseInt(powerstats.speed) },
        { label: "Durabilidad", y: parseInt(powerstats.durability) },
        { label: "Poder", y: parseInt(powerstats.power) },
        { label: "Combate", y: parseInt(powerstats.combat) }
    ];

    const chart = new CanvasJS.Chart("chart-container", {
        theme: "light2",
        animationEnabled: true,
        title: {
            text: "Estadísticas de Poder del SuperHéroe"
        },
        data: [{
            type: "pie",
            showInLegend: true,
            toolTipContent: "<b>{label}</b>: {y} ",
            dataPoints: chartData
        }]
    });

    // Asegúrate de que el contenedor esté visible y tenga tamaño
    chart.render();
}