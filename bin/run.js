#! /usr/bin/env node
const fs = require("fs");
const path = require("path");
const shell = require("shelljs");
const configFile = path.join(path.dirname(__filename), "../lib/config.json");
const currentDirectory = process.cwd(); // hopefully a src directory
console.log(`Running ${currentDirectory} at root`);
// Lets read our config file
const rawData = fs.readFileSync(configFile);
const root = JSON.parse(rawData).root;
console.log(root);

// Copy src folder to our root
shell.cp("-R", process.cwd(), root+'/src');

// Change directory to our root
shell.cd(root);

// Run our Root React App
shell.exec("npm start");
