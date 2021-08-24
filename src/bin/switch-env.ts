#! /usr/bin/env node
import { Config } from '../interfaces/Types'
const path = require("path");
const fs = require("fs");
const configFile = path.join(path.dirname(__filename), "../lib/config.json");
const rawData = fs.readFileSync(configFile);
const config: Config = JSON.parse(rawData);
const newEnv: string = process.argv[2];
config.current = newEnv;
// If the env we switched to is not in our config.envs, create a new env
if (config.envs.newEnv === undefined) {
    const env = {
        root: "",
        dependencies: "",
        devDependencies: "",
    };
    config.envs[newEnv] = env;
}
const data = JSON.stringify(config);
fs.writeFile(configFile, data, "utf8", (err: Error) => {
    if (err) console.error(err);
});
