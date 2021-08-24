#! /usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require('path');
const fs = require("fs");
console.log("Begin config.ts");
const fileExists = async (filePath) => {
    await fs.promises
        .stat(filePath)
        .catch((e) => false);
};
const createConfig = async (filePath) => {
    console.log("Creating new config file...");
    const config = {
        current: 'base',
        envs: {
            base: {
                root: '',
                dependencies: {},
                devDependencies: {}
            }
        }
    };
    await fs.writeFile(filePath, config);
    return filePath;
};
console.log("Getting File Path");
const filePath = path.join(path.dirname(__filename), '../lib/config.json');
console.log(filePath);
const configFile = fileExists(filePath) ? filePath : createConfig(filePath);
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
