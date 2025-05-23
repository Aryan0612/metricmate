const os = require('os');
const WebSocket = require('ws');
const checkDiskSpace = require('check-disk-space').default;
const path = os.platform() === 'win32' ? 'c:' : '/';

const wss = new WebSocket.Server({ port: 8080 });

console.log('WebSocket server started on ws://localhost:8080');

async function getDiskUsage() {
  try {
    const { free, size } = await checkDiskSpace(path);
    const used = ((size - free) / size) * 100;
    return used.toFixed(1);
  } catch (e) {
    return null;
  }
}

function formatUptime(seconds) {
  const d = Math.floor(seconds / (3600*24));
  const h = Math.floor((seconds % (3600*24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${d}d ${h}h ${m}m`;
}

async function getSystemStats() {
  const diskUsed = await getDiskUsage();

  return {
    cpuLoad: os.loadavg()[0].toFixed(2),
    totalMem: (os.totalmem() / (1024 ** 3)).toFixed(2),
    freeMem: (os.freemem() / (1024 ** 3)).toFixed(2),
    usedMem: ((os.totalmem() - os.freemem()) / os.totalmem() * 100).toFixed(1),
    uptime: formatUptime(os.uptime()),
    diskUsed,
  };
}

wss.on('connection', (ws) => {
  console.log('Client connected');

  const sendStats = async () => {
    if (ws.readyState === WebSocket.OPEN) {
      const stats = await getSystemStats();
      ws.send(JSON.stringify(stats));
    }
  };

  const interval = setInterval(sendStats, 2000);

  ws.on('close', () => {
    clearInterval(interval);
    console.log('Client disconnected');
  });
});