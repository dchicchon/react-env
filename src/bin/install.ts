#! /usr/bin/env node
import { Config } from '../interfaces/Types'
const fs = require("fs");
const shell = require("shelljs");
const path = require("path");
const configFile = path.join(path.dirname(__filename), "../lib/config.json");

// Install to root
const rawData = fs.readFileSync(configFile);
const config: Config = JSON.parse(rawData);
const env = config.envs[config.current];
shell.cd(env.root); // navigate to root to install items there
const flag: string = process.argv[2];
if (process.argv.length === 2) {
    // install both dependencies and devDependencies from config -> root
    for (const dep in env.dependencies) {
        shell.exec(`npm install ${dep}`);
    }
    for (const dep in env.devDependencies) {
        shell.exec(`npm install ${dep} --save-dev`);
    }
} else if (flag === "-dev") {
    for (let i = 3; i < process.argv.length; i++) {
        let dep = process.argv[i];
        try {
            shell.exec(`npm install ${dep} --save-dev`);
        } catch (error) {
            console.error(error);
        }
    }
    const rootJSON = path.join(process.cwd(), "/package.json");
    const rootFile = fs.readFileSync(rootJSON);
    env.devDependencies = JSON.parse(rootFile).devDependencies;
    const data = JSON.stringify(config);
    fs.writeFile(configFile, data, "utf8", (err: Error) => {
        if (err) console.error(err);
    });
} else {
    for (let i = 2; i < process.argv.length; i++) {
        let dep = process.argv[i];
        try {
            shell.exec(`npm install ${dep}`);
            // Add it to config
        } catch (error) {
            console.error(error);
        }
    }
    const rootJSON = path.join(process.cwd(), "/package.json");
    const rootFile = fs.readFileSync(rootJSON);
    env.devDependencies = JSON.parse(rootFile).dependencies;
    const data = JSON.stringify(config);
    fs.writeFile(configFile, data, "utf8", (err: Error) => {
        if (err) console.error(err);
    });
}
