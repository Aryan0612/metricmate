# MetricMate

**MetricMate** is a Chrome extension that displays real-time system monitoring stats — CPU load, memory usage, disk space, and uptime — by connecting to a Node.js backend via WebSockets.

---

## Features

- Real-time system stats with live updates
- Simple and clean user interface in Chrome extension popup
- Backend fetches system metrics using Node.js modules
- WebSocket communication for efficient data streaming

---

## Installation

### Backend

1. Clone the repo  
   ```bash
   git clone https://github.com/Aryan0612/metricmate.git
   cd metricmate/backend

2. Install dependencies
```bash
npm install
node server.js

Chrome Extension
Open Chrome and go to chrome://extensions

Enable Developer mode (toggle top right)

Click Load unpacked and select the /extension folder from this repo

Open the extension icon and watch live system stats!

How It Works
Backend uses Node.js to gather system stats every second

Uses WebSockets (ws package) to send data to the extension in real time

Extension popup listens on the WebSocket and updates the UI instantly
