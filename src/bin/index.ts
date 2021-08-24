#! /usr/bin/env node
import { Config } from '../interfaces/Types'
const path = require("path");
const fs = require("fs");
const configFile = path.join(path.dirname(__filename), "../lib/config.json");
const currentDirectory = process.cwd(); // directory where we run command
console.log(`Saving ${currentDirectory} as root`);
const rawData = fs.readFileSync(configFile);
const config: Config = JSON.parse(rawData); // get config
const env = config.envs[config.current]; // select current env
// get packages in current directory
const rootJSON = path.join(currentDirectory, "/package.json");
const rootFile = fs.readFileSync(rootJSON);

env.root = currentDirectory;
env.dependencies = JSON.parse(rootFile).dependencies;
env.devDependencies = JSON.parse(rootFile).devDependencies;

// Package updated config in config.json
const data = JSON.stringify(config);
fs.writeFile(configFile, data, "utf8", (err: Error) => {
    if (err) console.error(err);
});
