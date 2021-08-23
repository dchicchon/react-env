const fs = require("fs");
const path = require("path");
const configFile = path.join(path.dirname(__filename), "../lib/config.json");
const rawData = fs.readFileSync(configFile);
const root = JSON.parse(rawData).root;
console.log(`Current Root: ${root}`);
