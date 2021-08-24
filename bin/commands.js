#! /usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const shelljs_1 = __importDefault(require("shelljs"));
const path_1 = __importDefault(require("path"));
const chalk_1 = __importDefault(require("chalk"));
const configFile = path_1.default.join(path_1.default.dirname(__filename), "../lib/config.json");
const root = () => {
    const currentDirectory = process.cwd();
    console.log(chalk_1.default.cyan(`Saving ${currentDirectory} as root`));
    const rawData = fs_1.default.readFileSync(configFile);
    const config = JSON.parse(rawData.toString());
    const env = config.envs[config.current];
    const rootJSON = path_1.default.join(currentDirectory, "/package.json");
    const rootFile = fs_1.default.readFileSync(rootJSON);
    env.root = currentDirectory;
    env.dependencies = JSON.parse(rootFile.toString()).dependencies;
    env.devDependencies = JSON.parse(rootFile.toString()).devDependencies;
    const data = JSON.stringify(config);
    fs_1.default.writeFile(configFile, data, "utf8", (err) => {
        if (err)
            console.error(err);
    });
};
const run = () => {
    const srcDirectory = process.cwd();
    console.log(chalk_1.default.cyan(`Running ${srcDirectory} at root`));
    const rawData = fs_1.default.readFileSync(configFile);
    const config = JSON.parse(rawData.toString());
    const root = config.envs[config.current].root;
    shelljs_1.default.cp("-R", process.cwd(), root + "/src");
    shelljs_1.default.cd(root);
    shelljs_1.default.exec("npm start");
};
const config = () => {
    const rawData = fs_1.default.readFileSync(configFile);
    const config = JSON.parse(rawData.toString());
    const env = config.envs[config.current];
    const flag = process.argv[3];
    if (flag) {
        switch (flag) {
            case "-envs":
                let list = Object.keys(config.envs).filter((key) => key !== "current");
                console.log(chalk_1.default.cyan("List of envs"));
                list.forEach((env) => console.log(chalk_1.default.cyan(env)));
                break;
        }
    }
    else {
        console.log(chalk_1.default.cyan(`Current Config: ${config.current}`));
        console.log(env);
    }
};
const uninstallEnv = () => {
    const rawData = fs_1.default.readFileSync(configFile);
    const config = JSON.parse(rawData.toString());
    const env = config.envs[config.current];
    shelljs_1.default.cd(env.root);
    if (process.argv.length === 3) {
        console.log(chalk_1.default.cyan("Please specify what you would like to uninstall. Use -all to delete all, or simply list packages to delete"));
    }
    else if (process.argv[3] === '-all') {
        console.log(chalk_1.default.cyan("Uninstalling all packages"));
        for (let i = 0; i < Object.keys(env.dependencies).length; i++) {
            const dep = Object.keys(env.dependencies)[i];
            console.log(chalk_1.default.cyan(`Uninstalling package ${dep}`));
            shelljs_1.default.exec(`npm uninstall ${dep}`);
        }
        for (let i = 0; i < Object.keys(env.devDependencies).length; i++) {
            const dep = Object.keys(env.devDependencies)[i];
            console.log(chalk_1.default.cyan(`Uninstalling package ${dep}`));
            shelljs_1.default.exec(`npm uninstall ${dep}`);
        }
        env.dependencies = {};
        env.devDependencies = {};
        const data = JSON.stringify(config);
        fs_1.default.writeFile(configFile, data, "utf8", (err) => {
            if (err)
                console.error(err);
        });
    }
    else {
        for (let i = 3; i < process.argv.length; i++) {
            try {
                console.log(chalk_1.default.cyan(`Uninstalling package ${process.argv[i]}`));
                shelljs_1.default.exec(`npm uninstall ${process.argv[i]}`);
                env.dependencies[process.argv[i]] ? delete env.dependencies[process.argv[i]] : delete env.devDependencies[process.argv[i]];
            }
            catch (error) {
                console.error(error);
            }
        }
        const data = JSON.stringify(config);
        fs_1.default.writeFile(configFile, data, "utf8", (err) => {
            if (err)
                console.error(err);
        });
    }
};
const installEnv = () => {
    const rawData = fs_1.default.readFileSync(configFile);
    const config = JSON.parse(rawData.toString());
    const env = config.envs[config.current];
    shelljs_1.default.cd(env.root);
    const flag = process.argv[3];
    if (env.root === '') {
        console.log(chalk_1.default.cyan("You must root an reach app before installing any dependencies"));
        return;
    }
    if (process.argv.length === 3) {
        console.log(chalk_1.default.cyan("Installing Environment Packages"));
        for (const dep in env.dependencies) {
            console.log(chalk_1.default.cyan(`Installing ${dep}`));
            shelljs_1.default.exec(`npm install ${dep}`);
        }
        for (const dep in env.devDependencies) {
            console.log(chalk_1.default.cyan(`Installing ${dep}`));
            shelljs_1.default.exec(`npm install ${dep} --save-dev`);
        }
    }
    else if (flag === "-dev") {
        for (let i = 4; i < process.argv.length; i++) {
            let dep = process.argv[i];
            console.log(chalk_1.default.cyan(`Installing Package ${dep} in dev`));
            try {
                shelljs_1.default.exec(`npm install ${dep} --save-dev`);
                env.dependencies[dep] && delete env.dependencies[dep];
            }
            catch (error) {
                console.error(error);
            }
        }
        const rootJSON = path_1.default.join(process.cwd(), "/package.json");
        const rootFile = fs_1.default.readFileSync(rootJSON);
        env.devDependencies = JSON.parse(rootFile.toString()).devDependencies;
        const data = JSON.stringify(config);
        fs_1.default.writeFile(configFile, data, "utf8", (err) => {
            if (err)
                console.error(err);
        });
    }
    else {
        for (let i = 3; i < process.argv.length; i++) {
            let dep = process.argv[i];
            console.log(chalk_1.default.cyan(`Installing Package ${dep}`));
            try {
                shelljs_1.default.exec(`npm install ${dep}`);
                env.devDependencies[dep] && delete env.devDependencies[dep];
            }
            catch (error) {
                console.error(error);
            }
        }
        const rootJSON = path_1.default.join(process.cwd(), "/package.json");
        const rootFile = fs_1.default.readFileSync(rootJSON);
        env.dependencies = JSON.parse(rootFile.toString()).dependencies;
        const data = JSON.stringify(config);
        fs_1.default.writeFile(configFile, data, "utf8", (err) => {
            if (err)
                console.error(err);
        });
    }
};
const switchEnv = () => {
    const newEnv = process.argv[3];
    const rawData = fs_1.default.readFileSync(configFile);
    const config = JSON.parse(rawData.toString());
    if (config.current === newEnv) {
        console.log(chalk_1.default.cyan(`Already on environment:${newEnv}`));
        return;
    }
    if (config.envs[newEnv] === undefined) {
        console.log(chalk_1.default.cyan(`Creating new environment:${newEnv}`));
        const env = {
            root: "",
            dependencies: {},
            devDependencies: {},
        };
        config.envs[newEnv] = env;
    }
    else {
        console.log(chalk_1.default.cyan(`Switching to environment: ${newEnv}`));
    }
    config.current = newEnv;
    const data = JSON.stringify(config);
    fs_1.default.writeFile(configFile, data, "utf8", (err) => {
        if (err)
            console.error(err);
    });
};
const deleteEnv = () => {
    if (process.argv.length === 3) {
        console.log(chalk_1.default.cyan("You must input envs to delete"));
        return;
    }
    const rawData = fs_1.default.readFileSync(configFile);
    const config = JSON.parse(rawData.toString());
    if (Object.keys(config.envs).length === 0) {
        console.log(chalk_1.default.cyan("No environments detected in config"));
    }
    for (let i = 3; i < process.argv.length; i++) {
        const env = process.argv[i];
        console.log(chalk_1.default.cyan(`Deleting environment: ${env}`));
        if (config.envs[env]) {
            delete config.envs[env];
            if (config.current === env)
                config.current = '';
        }
        else {
            console.log(chalk_1.default.cyan('Environment not found. Skipping...'));
            continue;
        }
    }
    const data = JSON.stringify(config);
    fs_1.default.writeFile(configFile, data, "utf8", (err) => {
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
