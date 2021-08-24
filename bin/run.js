#! /usr/bin/env node
const fs = require("fs");
const path = require("path");
const shell = require("shelljs");
const configFile = path.join(path.dirname(__filename), "../lib/config.json");
const srcDirectory = process.cwd(); // hopefully a src directory
console.log(`Running ${srcDirectory} at root`);
// Lets read our config file
const rawData = fs.readFileSync(configFile);
const config = JSON.parse(rawData);
const root = config[config.current].root;

// Lets use npm watch to check if anything changes in our 'src' directory

// Copy src folder to our root folder and place it into a folder called '/src'
shell.cp("-R", process.cwd(), root + "/src");

// Change directory to our root
shell.cd(root);
// Run our Root React App
shell.exec("npm start");

// check for flag -watch
