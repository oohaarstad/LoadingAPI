let scenarioCount = 0;

// Funksjon for å legge til et nytt scenario
function addScenario() {
    scenarioCount++;
    const scenarioDiv = document.createElement('div');
    scenarioDiv.id = `scenario${scenarioCount}`;
    scenarioDiv.innerHTML = `
        <h3>Scenario ${scenarioCount}</h3>
        <label for="scenarioTitle${scenarioCount}">Title:</label>
        <input type="text" id="scenarioTitle${scenarioCount}" name="scenarioTitle${scenarioCount}" required>
        <div id="options${scenarioCount}">
            <label>Options:</label>
            <input type="text" name="option${scenarioCount}[]" required>
            <input type="text" name="option${scenarioCount}[]" required>
        </div>
        <button type="button" onclick="addOption(${scenarioCount})">Add Option</button>
    `;
    document.getElementById('scenarios').appendChild(scenarioDiv);
}

// Funksjon for å legge til et nytt alternativ i et scenario
function addOption(scenarioId) {
    const optionsDiv = document.getElementById(`options${scenarioId}`);
    const input = document.createElement('input');
    input.type = 'text';
    input.name = `option${scenarioId}[]`;
    input.required = true;
    optionsDiv.appendChild(input);
}

// Lytter til skjemaets submit-hendelse
document.getElementById('createForm').addEventListener('submit', function(event) {
    event.preventDefault();
    // Vis lastemelding
    document.getElementById('loading').classList.add('active');

    // Samler data og sender den til serveren
    const formData = new FormData(event.target);
    const data = {
        title: formData.get('title'),
        scenarios: []
    };

    // Samler scenarier og deres alternativer
    for (let i = 1; i <= scenarioCount; i++) {
        const scenarioTitle = formData.get(`scenarioTitle${i}`);
        const options = formData.getAll(`option${i}[]`);
        data.scenarios.push({ title: scenarioTitle, options: options });
    }

    // Sender dataen til serveren som en POST-forespørsel
    fetch('/api/Sessions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(result => {
        console.log('Show created:', result);
        alert('Show created successfully!');
        // Omadresserer eller oppdaterer siden for å vise den nye sesjonen
        window.location.reload();
    })
    .catch(error => {
        console.error('Error creating show:', error);
        alert('Failed to create show. Please try again.');
    })
    .finally(() => {
        // Skjul lastemelding
        document.getElementById('loading').classList.remove('active');
    });
});
