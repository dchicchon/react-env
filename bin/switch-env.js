#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const configFile = path.join(path.dirname(__filename), "../lib/config.json");
const rawData = fs.readFileSync(configFile);
const config = JSON.parse(rawData);
const newEnv = process.argv[2];
config.current = newEnv;
if (!config.hasOwnProperty(newEnv)) {
    const env = {
        root: "",
        dependencies: "",
        devDependencies: "",
    };
    config[newEnv] = env;
}
const data = JSON.stringify(config);
fs.writeFile(configFile, data, "utf8", (err) => {
    if (err)
        console.error(err);
});
