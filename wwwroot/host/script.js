// Oppretter en forbindelse til SignalR-hubben
const connection = new signalR.HubConnectionBuilder()
    .withUrl("/voteHub")
    .build();

// Starter SignalR-forbindelsen og håndterer eventuelle feil
connection.start().catch(function (err) {
    console.error('Error establishing SignalR connection:', err.toString());
});

let currentSessionId = null;
let currentStep = 0;

// Funksjon for å starte en sesjon
document.getElementById('startSessionButton').addEventListener('click', startSession);

function startSession() {
    const sessionId = document.getElementById('session').value;
    if (!sessionId) {
        alert('Please select a session.');
        return;
    }
    currentSessionId = sessionId;
    currentStep = 0; // Nullstiller trinnnummer når en sesjon starter
    document.getElementById('loading').classList.add('active');
    
    fetch(`/api/Sessions/${sessionId}/start`, {
        method: 'POST'
    })
    .then(response => response.json())
    .then(data => {
        console.log('Session started:', data);
        // Åpner et nytt vindu for storskjermvisning
        window.open(`/session/bigscreen.html?sessionId=${sessionId}`, 'BigScreen', 'width=800,height=600');
    })
    .catch(error => {
        console.error('Error starting session:', error);
        alert('Failed to start session. Please try again.');
    })
    .finally(() => {
        document.getElementById('loading').classList.remove('active');
    });
}

// Funksjon for å gå til neste trinn i sesjonen
document.getElementById('nextStepButton').addEventListener('click', nextStep);

function nextStep() {
    if (currentSessionId) {
        currentStep++;
        console.log('Invoking NextStep:', currentSessionId, currentStep); // Logg for debugging
        document.getElementById('loading').classList.add('active');
        
        connection.invoke("NextStep", parseInt(currentSessionId), currentStep)
        .catch(function (err) {
            console.error('Error invoking NextStep:', err.toString());
        })
        .finally(() => {
            document.getElementById('loading').classList.remove('active');
        });
    } else {
        alert('Please start a session first.');
    }
}

// Henter sesjoner og fyller ut dropdown-menyen
fetch('/api/Sessions')
    .then(response => response.json())
    .then(data => {
        const sessionSelect = document.getElementById('session');
        data.forEach(session => {
            const option = document.createElement('option');
            option.value = session.sessionId;
            option.textContent = session.title;
            sessionSelect.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Error fetching sessions:', error);
        alert('Failed to load sessions. Please try again.');
    });
