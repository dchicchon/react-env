#! /usr/bin/env node
import { Config } from '../interfaces/Types'
import * as fs from 'fs'
import * as shell from 'shelljs'
import * as path from 'path'

const configFile = path.join(path.dirname(__filename), "../lib/config.json");

const root = () => {
    const currentDirectory = process.cwd(); // directory where we run command
    console.log(`Saving ${currentDirectory} as root`);
    const rawData = fs.readFileSync(configFile);
    const config: Config = JSON.parse(rawData.toString()); // get config
    const env = config.envs[config.current]; // select current env
    // get packages in current directory
    const rootJSON = path.join(currentDirectory, "/package.json");
    const rootFile = fs.readFileSync(rootJSON);

    env.root = currentDirectory;
    env.dependencies = JSON.parse(rootFile.toString()).dependencies;
    env.devDependencies = JSON.parse(rootFile.toString()).devDependencies;

    // Package updated config in config.json
    const data = JSON.stringify(config);
    fs.writeFile(configFile, data, "utf8", (err) => {
        if (err) console.error(err);
    });

}

const run = () => {
    const srcDirectory = process.cwd(); // hopefully a src directory
    console.log(`Running ${srcDirectory} at root`);
    // Lets read our config file
    const rawData = fs.readFileSync(configFile);
    const config: Config = JSON.parse(rawData.toString());
    const root = config.envs[config.current].root;

    // Lets use npm watch to check if anything changes in our 'src' directory

    // Copy src folder to our root folder and place it into a folder called '/src'
    shell.cp("-R", process.cwd(), root + "/src");
    // Change directory to our root
    shell.cd(root);
    // Run our Root React App
    shell.exec("npm start");


}

const config = () => {
    const rawData = fs.readFileSync(configFile);
    const config: Config = JSON.parse(rawData.toString());
    const env = config.envs[config.current];
    const flag: string = process.argv[3];
    // Check for flags
    if (flag) {
        // check the flag
        switch (flag) {
            case "-envs":
                let list = Object.keys(config.envs).filter((key) => key !== "current");
                console.log("List of envs");
                list.forEach((env) => console.log(env));
                break;
        }
    } else {
        console.log(`Current Config: ${config.current}`);
        console.log(env);
    }

}

const uninstallEnv = () => {
    const rawData = fs.readFileSync(configFile);
    const config: Config = JSON.parse(rawData.toString());
    const env = config.envs[config.current];
    shell.cd(env.root); // navigate to root to uninstall items there
    // Dont need to worry about flag, just see how many args there are
    if (process.argv.length === 3) {
        console.log("Please specify what you would like to uninstall. Use -all to delete all, or simply list packages to delete")
        // uninstall everything in root env
    }
    else if (process.argv[5] === '-all') {
        console.log("Uninstalling all packages")
        shell.exec('for package in `ls node_modules`; do npm uninstall $package; done;')

    }
    else {
        // only install these packages
        for (let i = 4; i < process.argv.length; i++) {
            console.log(`Uninstalling package ${process.argv[i]}`)
            shell.exec(`npm i uninstall ${process.argv[i]}`)
        }
    }


}

const installEnv = () => {
    // Install to root
    console.log("Installing Environment Packages")
    const rawData = fs.readFileSync(configFile);
    const config: Config = JSON.parse(rawData.toString());
    const env = config.envs[config.current];
    shell.cd(env.root); // navigate to root to install items there
    const flag: string = process.argv[3];
    if (process.argv.length === 3) {
        // install both dependencies and devDependencies from config -> root
        for (const dep in env.dependencies) {
            shell.exec(`npm install ${dep}`);
        }
        for (const dep in env.devDependencies) {
            shell.exec(`npm install ${dep} --save-dev`);
        }
    } else if (flag === "-dev") {
        for (let i = 4; i < process.argv.length; i++) {
            let dep = process.argv[i];
            try {
                shell.exec(`npm install ${dep} --save-dev`);
            } catch (error) {
                console.error(error);
            }
        }
        const rootJSON = path.join(process.cwd(), "/package.json");
        const rootFile = fs.readFileSync(rootJSON);
        env.devDependencies = JSON.parse(rootFile.toString()).devDependencies;
        const data = JSON.stringify(config);
        fs.writeFile(configFile, data, "utf8", (err) => {
            if (err) console.error(err);
        });
    } else {
        for (let i = 3; i < process.argv.length; i++) {
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
        env.devDependencies = JSON.parse(rootFile.toString()).dependencies;
        const data = JSON.stringify(config);
        fs.writeFile(configFile, data, "utf8", (err) => {
            if (err) console.error(err);
        });
    }

}

const switchEnv = () => {
    const newEnv: string = process.argv[3];

    const rawData = fs.readFileSync(configFile);
    const config: Config = JSON.parse(rawData.toString());
    if (config.current === newEnv) {
        console.log(`Already on environment:${newEnv} `)
        return
    }
    // If the env we switched to is not in our config.envs, create a new env
    if (config.envs[newEnv] === undefined) {
        console.log(`Creating new environment:${newEnv}`)
        const env = {
            root: "",
            dependencies: "",
            devDependencies: "",
        };
        config.envs[newEnv] = env;
    } else {
        console.log(`Switching to environment: ${newEnv}`)
    }
    const data = JSON.stringify(config);
    fs.writeFile(configFile, data, "utf8", (err) => {
        if (err) console.error(err);
    });

}

const deleteEnv = () => {
    const env: string = process.argv[3];
    console.log(`Deleting Environment: ${env}`)
    const rawData = fs.readFileSync(configFile);
    const config: Config = JSON.parse(rawData.toString());
    if (config.current === env) config.current = ''
    delete config.envs[env]
    if (Object.keys(config.envs).length === 0) console.log("No envs detected in config.json. To create a new env, use switch command.")
    const data = JSON.stringify(config);
    fs.writeFile(configFile, data, "utf8", (err) => {
        if (err) console.error(err);
    });
}

module.exports = {
    root,
    run,
    config,
    installEnv,
    uninstallEnv,
    switchEnv,
    deleteEnv
}