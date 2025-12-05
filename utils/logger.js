const fs = require('fs');
const path = require('path');

const logDirectory = path.join(__dirname, '..', 'logs');

// Ensure log directory exists
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory);
}

const logFilePath = path.join(logDirectory, 'app.log');

const logger = {
    log: (message) => {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] ${message}\n`;
        fs.appendFileSync(logFilePath, logMessage);
        console.log(logMessage.trim());
    }
};

module.exports = logger;