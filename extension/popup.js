let cpuData = [];
let memData = [];
const MAX_POINTS = 20;

const cpuCtx = document.getElementById('cpuChart').getContext('2d');
const memCtx = document.getElementById('memChart').getContext('2d');

const cpuChart = new Chart(cpuCtx, {
  type: 'line',
  data: {
    labels: Array(MAX_POINTS).fill(''),
    datasets: [{
      label: 'CPU Load',
      data: [],
      borderColor: 'blue',
      fill: false,
      tension: 0.1,
    }]
  },
  options: { animation: false, scales: { y: { min: 0 } } }
});

const memChart = new Chart(memCtx, {
  type: 'line',
  data: {
    labels: Array(MAX_POINTS).fill(''),
    datasets: [{
      label: 'Memory Usage (%)',
      data: [],
      borderColor: 'green',
      fill: false,
      tension: 0.1,
    }]
  },
  options: { animation: false, scales: { y: { min: 0, max: 100 } } }
});

let ws;
const serverSelect = document.getElementById('serverSelect');
const alertsDiv = document.getElementById('alerts');

function addAlert(message) {
  alertsDiv.innerHTML = `<p class="alert">${message}</p>`;
}

function clearAlert() {
  alertsDiv.innerHTML = '';
}

function updateCharts(cpuLoad, usedMem) {
  if (cpuData.length >= MAX_POINTS) {
    cpuData.shift();
    memData.shift();
  }
  cpuData.push(cpuLoad);
  memData.push(usedMem);

  cpuChart.data.datasets[0].data = cpuData;
  memChart.data.datasets[0].data = memData;

  cpuChart.update();
  memChart.update();
}

function connectWebSocket(url) {
  if (ws) ws.close();

  ws = new WebSocket(url);

  ws.onopen = () => {
    clearAlert();
    console.log('Connected to ' + url);
  };

  ws.onerror = () => {
    addAlert('Error connecting to server');
  };

  ws.onclose = () => {
    addAlert('Disconnected from server');
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    document.getElementById('diskUsed').textContent = data.diskUsed ?? '-';
    document.getElementById('uptime').textContent = data.uptime ?? '-';

    const cpuLoad = parseFloat(data.cpuLoad);
    const usedMem = parseFloat(data.usedMem);

    document.getElementById('cpuLoad').textContent = cpuLoad;
    document.getElementById('usedMem').textContent = usedMem;

    updateCharts(cpuLoad, usedMem);

    // Alerts for high usage
    if (usedMem > 80) addAlert('Warning: High Memory Usage!');
    else if (cpuLoad > 2.0) addAlert('Warning: High CPU Load!');
    else clearAlert();
  };
}

serverSelect.addEventListener('change', (e) => {
  connectWebSocket(e.target.value);
});

// Connect initially to default server
connectWebSocket(serverSelect.value);