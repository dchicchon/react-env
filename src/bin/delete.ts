#! /usr/bin/env node
import { Config } from '../interfaces/Types'
const path = require('path')
const fs = require("fs");
const configFile = path.join(path.dirname(__filename), "../lib/config.json");
const rawData = fs.readFileSync(configFile);
const config: Config = JSON.parse(rawData);
delete config.envs[config.current]
// Package updated config in config.json
const data = JSON.stringify(config);
fs.writeFile(configFile, data, "utf8", (err: Error) => {
    if (err) console.error(err);
});
