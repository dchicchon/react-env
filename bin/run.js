#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
const shell = require("shelljs");
const configFile = path.join(path.dirname(__filename), "../lib/config.json");
const srcDirectory = process.cwd();
console.log(`Running ${srcDirectory} at root`);
const rawData = fs.readFileSync(configFile);
const config = JSON.parse(rawData);
const root = config[config.current].root;
shell.cp("-R", process.cwd(), root + "/src");
shell.cd(root);
shell.exec("npm start");
