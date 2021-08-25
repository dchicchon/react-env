#! /usr/bin/env node
import { Config } from '../interfaces/Types'
import fs from 'fs'
import shell from 'shelljs'
import path from 'path'
import chalk from 'chalk';

const configFile = path.join(path.dirname(__filename), "../lib/config.json");

const root = () => {

    // Maybe somewhere here we can tell the package json in our root
    // to watch for our source folder

    const currentDirectory = process.cwd(); // directory where we run command
    console.log(chalk.cyan(`Saving ${currentDirectory} as root`));

    // get current env 
    const rawData = fs.readFileSync(configFile);
    const config: Config = JSON.parse(rawData.toString());
    const env = config.envs[config.current];

    // get packages in current directory
    const rootJSON = path.join(currentDirectory, "/package.json");
    const rootFile = fs.readFileSync(rootJSON);

    // setup keys in environment
    env.root = currentDirectory;
    env.dependencies = JSON.parse(rootFile.toString()).dependencies;
    env.devDependencies = JSON.parse(rootFile.toString()).devDependencies;

    // Package updated config in config.json
    const data = JSON.stringify(config);
    fs.writeFile(configFile, data, "utf8", (err) => {
        if (err) console.error(err);
    });

}

const src = () => {
    const newSource = process.cwd()
    console.log(chalk.cyan(`Sourcing ${newSource}`))
    const rawData = fs.readFileSync(configFile);
    const config: Config = JSON.parse(rawData.toString());
    const env = config.envs[config.current]
    env.src = newSource
    const data = JSON.stringify(config);
    fs.writeFile(configFile, data, "utf8", (err) => {
        if (err) console.error(err);
    });

}

const run = () => {
    // Lets read our config file
    const rawData = fs.readFileSync(configFile);
    const config: Config = JSON.parse(rawData.toString());
    const { src } = config.envs[config.current]
    const { root } = config.envs[config.current];
    console.log(chalk.cyan(`Running source:${src} at root:${root}`));

    // Lets use npm watch to check if anything changes in our 'src' directory
    // this is the biggest issue with the package

    // Copy src folder to our root folder and place it into a folder called '/src'
    // Maybe I don't have to do this later on, try making a reference to our source in our root
    shell.cp("-R", src, root + "/src");
    shell.cd(root);
    shell.exec("npm run start");
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
                console.log(chalk.cyan("List of envs"));
                list.forEach((env) => console.log(chalk.cyan(env)));
                break;
        }
    } else {
        console.log(chalk.cyan(`Current Config: ${config.current}`));
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
        console.log(chalk.cyan("Please specify what you would like to uninstall. Use -all to delete all, or simply list packages to delete"))
        // uninstall everything in root env
    }
    else if (process.argv[3] === '-all') {
        console.log(chalk.cyan("Uninstalling all packages"))
        // look at config to see what to uninstall
        for (let i = 0; i < Object.keys(env.dependencies).length; i++) {
            const dep = Object.keys(env.dependencies)[i]
            console.log(chalk.cyan(`Uninstalling package ${dep}`))
            shell.exec(`npm uninstall ${dep}`)
        }
        for (let i = 0; i < Object.keys(env.devDependencies).length; i++) {
            const dep = Object.keys(env.devDependencies)[i]
            console.log(chalk.cyan(`Uninstalling package ${dep}`))
            shell.exec(`npm uninstall ${dep}`)
        }

        env.dependencies = {}
        env.devDependencies = {}
        const data = JSON.stringify(config);
        fs.writeFile(configFile, data, "utf8", (err) => {
            if (err) console.error(err);
        });

    }
    else {
        // only install these packages
        for (let i = 3; i < process.argv.length; i++) {
            try {
                console.log(chalk.cyan(`Uninstalling package ${process.argv[i]}`))
                shell.exec(`npm uninstall ${process.argv[i]}`)
                env.dependencies[process.argv[i]] ? delete env.dependencies[process.argv[i]] : delete env.devDependencies[process.argv[i]]
            } catch (error) {
                console.error(error)
            }
        }

        // Make sure to add all packages here
        const data = JSON.stringify(config);
        fs.writeFile(configFile, data, "utf8", (err) => {
            if (err) console.error(err);
        });
    }


}

const installEnv = () => {
    // Install to root
    const rawData = fs.readFileSync(configFile);
    const config: Config = JSON.parse(rawData.toString());
    const env = config.envs[config.current];
    shell.cd(env.root); // navigate to root to install items there
    const flag: string = process.argv[3];
    if (env.root === '') {
        console.log(chalk.cyan("You must root an reach app before installing any dependencies"))
        return
    }
    if (process.argv.length === 3) {
        console.log(chalk.cyan("Installing Environment Packages"))
        // install both dependencies and devDependencies from config -> root
        for (const dep in env.dependencies) {
            console.log(chalk.cyan(`Installing ${dep}`))
            shell.exec(`npm install ${dep}`);
        }
        for (const dep in env.devDependencies) {
            console.log(chalk.cyan(`Installing ${dep}`))
            shell.exec(`npm install ${dep} --save-dev`);
        }
    } else if (flag === "-dev") {
        for (let i = 4; i < process.argv.length; i++) {
            let dep = process.argv[i];
            console.log(chalk.cyan(`Installing Package ${dep} in dev`))
            try {
                shell.exec(`npm install ${dep} --save-dev`);
                env.dependencies[dep] && delete env.dependencies[dep]
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
            console.log(chalk.cyan(`Installing Package ${dep}`))
            try {
                shell.exec(`npm install ${dep}`);
                env.devDependencies[dep] && delete env.devDependencies[dep]
            } catch (error) {
                console.error(error);
            }
        }
        const rootJSON = path.join(process.cwd(), "/package.json");
        const rootFile = fs.readFileSync(rootJSON);
        env.dependencies = JSON.parse(rootFile.toString()).dependencies;
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
        console.log(chalk.cyan(`Already on environment:${newEnv}`))
        return
    }
    // If the env we switched to is not in our config.envs, create a new env
    if (config.envs[newEnv] === undefined) {
        console.log(chalk.cyan(`Creating new environment:${newEnv}`))
        const env = {
            root: "",
            src: "",
            dependencies: {},
            devDependencies: {},
        };
        config.envs[newEnv] = env
    } else {
        console.log(chalk.cyan(`Switching to environment: ${newEnv}`))
    }
    config.current = newEnv
    const data = JSON.stringify(config);
    fs.writeFile(configFile, data, "utf8", (err) => {
        if (err) console.error(err);
    });

}

const deleteEnv = () => {
    if (process.argv.length === 3) {
        console.log(chalk.cyan("You must input envs to delete"))
        return
    }
    const rawData = fs.readFileSync(configFile);
    const config: Config = JSON.parse(rawData.toString());
    if (Object.keys(config.envs).length === 0) {
        console.log(chalk.cyan("No environments detected in config"))
    }
    for (let i = 3; i < process.argv.length; i++) {
        const env: string = process.argv[i];
        console.log(chalk.cyan(`Deleting environment: ${env}`))
        if (config.envs[env]) {
            delete config.envs[env]
            if (config.current === env) config.current = ''
        } else {
            console.log(chalk.cyan('Environment not found. Skipping...'))
            continue
        }
    }
    const data = JSON.stringify(config);
    fs.writeFile(configFile, data, "utf8", (err) => {
        if (err) console.error(err);
    });
}

const reset = () => {
    console.log(chalk.cyan("Resetting Config"))
    // get current env 
    const rawData = fs.readFileSync(configFile);
    const config: Config = JSON.parse(rawData.toString());

    // Remove all other configs
    for (const env in config.envs) {
        delete config.envs[env]
    }
    config.current = 'base'
    config.envs["base"] = {
        root: '',
        src: '',
        dependencies: {},
        devDependencies: {}
    }

    // Package updated config in config.j
    const data = JSON.stringify(config);
    fs.writeFile(configFile, data, "utf8", (err) => {
        if (err) console.error(err);
    });
}

module.exports = {
    root,
    run,
    src,
    config,
    installEnv,
    uninstallEnv,
    switchEnv,
    deleteEnv,
    reset
}