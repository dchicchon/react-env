#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require('path');
const fs = require("fs");
const configFile = path.join(path.dirname(__filename), '../lib/config.json');
const rawData = fs.readFileSync(configFile);
const config = JSON.parse(rawData);
const env = config.envs[config.current];
const flag = process.argv[2];
if (flag) {
    switch (flag) {
        case "-envs":
            let list = Object.keys(config.envs).filter((key) => key !== "current");
            console.log("List of envs");
            list.forEach((env) => console.log(env));
            break;
    }
}
else {
    console.log(`${config.current} config`);
    console.log(env);
}
