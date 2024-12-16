const fs = require("fs");
const path = require("path");
const chokidar = require("chokidar");

// Setup logging
const logFile = path.join(__dirname, "../../logs/server_watch.log");
const logStream = fs.createWriteStream(logFile, { flags: "a" });
const logDir = path.join(__dirname, "../../logs");

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

function logEvent(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp}: ${message}\n`;
  logStream.write(logMessage);
  console.log(logMessage.trim());
}

const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

const watchFiles = () => {
  const watcher = chokidar.watch(["**/*.js", "**/*.json"], {
    ignored: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/.git/**",
      "**/logs/**",
    ],
    persistent: true,
    ignoreInitial: true,
    atomic: true,
    awaitWriteFinish: {
      stabilityThreshold: 2000,
      pollInterval: 100,
    },
  });

  // Handle file changes with debouncing
  const handleFileChange = debounce((event, path) => {
    logEvent(`File ${event} - ${path}`);
    if (path.endsWith(".js")) {
      logEvent("JavaScript file changed - Consider restarting the server");
    }
  }, 1000);

  // Add event listeners
  watcher
    .on("add", (path) => handleFileChange("added", path))
    .on("change", (path) => handleFileChange("changed", path))
    .on("unlink", (path) => handleFileChange("deleted", path));

  // Error handling
  watcher.on("error", (error) => {
    logEvent(`Watcher error: ${error}`);
  });

  return watcher;
};

// Cleanup function
const cleanup = () => {
  logEvent("Server shutting down...");
  logStream.end();
};

// Handle process termination
process.on("SIGINT", () => {
  cleanup();
  process.exit();
});

process.on("SIGTERM", () => {
  cleanup();
  process.exit();
});

module.exports = {
  watchFiles,
  logEvent,
  cleanup,
};
