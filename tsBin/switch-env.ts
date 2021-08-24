#! /usr/bin/env node
import { Config } from '../interfaces/Types'
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
fs.writeFile(configFile, data, "utf8", (err: Error) => {
    if (err) console.error(err);
});
