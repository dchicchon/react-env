#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const configFile = path.join(path.dirname(__filename), "../lib/config.json");
const currentDirectory = process.cwd();
console.log(`Saving ${currentDirectory} as root`);
const rawData = fs.readFileSync(configFile);
const config = JSON.parse(rawData);
const env = config[config.current];
const rootJSON = path.join(currentDirectory, "/package.json");
const rootFile = fs.readFileSync(rootJSON);
env.root = currentDirectory;
env.dependencies = JSON.parse(rootFile).dependencies;
env.devDependencies = JSON.parse(rootFile).devDependencies;
const data = JSON.stringify(config);
fs.writeFile(configFile, data, "utf8", (err) => {
    if (err)
        console.error(err);
});
