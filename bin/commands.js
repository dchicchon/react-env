#! /usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const shell = __importStar(require("shelljs"));
const path = __importStar(require("path"));
const configFile = path.join(path.dirname(__filename), "../lib/config.json");
const root = () => {
    const currentDirectory = process.cwd();
    console.log(`Saving ${currentDirectory} as root`);
    const rawData = fs.readFileSync(configFile);
    const config = JSON.parse(rawData.toString());
    const env = config.envs[config.current];
    const rootJSON = path.join(currentDirectory, "/package.json");
    const rootFile = fs.readFileSync(rootJSON);
    env.root = currentDirectory;
    env.dependencies = JSON.parse(rootFile.toString()).dependencies;
    env.devDependencies = JSON.parse(rootFile.toString()).devDependencies;
    const data = JSON.stringify(config);
    fs.writeFile(configFile, data, "utf8", (err) => {
        if (err)
            console.error(err);
    });
};
const run = () => {
    const srcDirectory = process.cwd();
    console.log(`Running ${srcDirectory} at root`);
    const rawData = fs.readFileSync(configFile);
    const config = JSON.parse(rawData.toString());
    const root = config.envs[config.current].root;
    shell.cp("-R", process.cwd(), root + "/src");
    shell.cd(root);
    shell.exec("npm start");
};
const config = () => {
    const rawData = fs.readFileSync(configFile);
    const config = JSON.parse(rawData.toString());
    const env = config.envs[config.current];
    const flag = process.argv[3];
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
        console.log(`Current Config: ${config.current}`);
        console.log(env);
    }
};
const uninstallEnv = () => {
    const rawData = fs.readFileSync(configFile);
    const config = JSON.parse(rawData.toString());
    const env = config.envs[config.current];
    shell.cd(env.root);
    if (process.argv.length === 3) {
        console.log("Please specify what you would like to uninstall. Use -all to delete all, or simply list packages to delete");
    }
    else if (process.argv[5] === '-all') {
        console.log("Uninstalling all packages");
        shell.exec('for package in `ls node_modules`; do npm uninstall $package; done;');
    }
    else {
        for (let i = 4; i < process.argv.length; i++) {
            console.log(`Uninstalling package ${process.argv[i]}`);
            shell.exec(`npm i uninstall ${process.argv[i]}`);
        }
    }
};
const installEnv = () => {
    console.log("Installing Environment Packages");
    const rawData = fs.readFileSync(configFile);
    const config = JSON.parse(rawData.toString());
    const env = config.envs[config.current];
    shell.cd(env.root);
    const flag = process.argv[3];
    if (process.argv.length === 3) {
        for (const dep in env.dependencies) {
            shell.exec(`npm install ${dep}`);
        }
        for (const dep in env.devDependencies) {
            shell.exec(`npm install ${dep} --save-dev`);
        }
    }
    else if (flag === "-dev") {
        for (let i = 4; i < process.argv.length; i++) {
            let dep = process.argv[i];
            try {
                shell.exec(`npm install ${dep} --save-dev`);
            }
            catch (error) {
                console.error(error);
            }
        }
        const rootJSON = path.join(process.cwd(), "/package.json");
        const rootFile = fs.readFileSync(rootJSON);
        env.devDependencies = JSON.parse(rootFile.toString()).devDependencies;
        const data = JSON.stringify(config);
        fs.writeFile(configFile, data, "utf8", (err) => {
            if (err)
                console.error(err);
        });
    }
    else {
        for (let i = 3; i < process.argv.length; i++) {
            let dep = process.argv[i];
            try {
                shell.exec(`npm install ${dep}`);
            }
            catch (error) {
                console.error(error);
            }
        }
        const rootJSON = path.join(process.cwd(), "/package.json");
        const rootFile = fs.readFileSync(rootJSON);
        env.devDependencies = JSON.parse(rootFile.toString()).dependencies;
        const data = JSON.stringify(config);
        fs.writeFile(configFile, data, "utf8", (err) => {
            if (err)
                console.error(err);
        });
    }
};
const switchEnv = () => {
    const newEnv = process.argv[3];
    const rawData = fs.readFileSync(configFile);
    const config = JSON.parse(rawData.toString());
    if (config.current === newEnv) {
        console.log(`Already on environment:${newEnv} `);
        return;
    }
    if (config.envs[newEnv] === undefined) {
        console.log(`Creating new environment:${newEnv}`);
        const env = {
            root: "",
            dependencies: "",
            devDependencies: "",
        };
        config.envs[newEnv] = env;
    }
    else {
        console.log(`Switching to environment: ${newEnv}`);
    }
    const data = JSON.stringify(config);
    fs.writeFile(configFile, data, "utf8", (err) => {
        if (err)
            console.error(err);
    });
};
const deleteEnv = () => {
    const env = process.argv[3];
    console.log(`Deleting Environment: ${env}`);
    const rawData = fs.readFileSync(configFile);
    const config = JSON.parse(rawData.toString());
    if (config.current === env)
        config.current = '';
    delete config.envs[env];
    if (Object.keys(config.envs).length === 0)
        console.log("No envs detected in config.json. To create a new env, use switch command.");
    const data = JSON.stringify(config);
    fs.writeFile(configFile, data, "utf8", (err) => {
        if (err)
            console.error(err);
    });
};
module.exports = {
    root,
    run,
    config,
    installEnv,
    uninstallEnv,
    switchEnv,
    deleteEnv
};
