#! /usr/bin/env node

import chalk from "chalk";

const { root, run, config, uninstallEnv, installEnv, switchEnv, deleteEnv } = require('./commands')
// Run all commands by here
const command = process.argv[2]
switch (command) {
    case 'root':
        root()
        break;
    case 'run':
        run()
        break;
    case 'config':
        config()
        break;
    case 'uninstall':
        uninstallEnv()
        break
    case 'switch':
        switchEnv()
        break;
    case 'install':
        installEnv()
        break;
    case 'delete':
        deleteEnv()
        break;
    default:
        console.log(
            chalk.underline.cyan(`\nReact-Env: Creating Multiple React Environments\n\n`) +
            chalk.cyan(
                `Try one of the following commands:\n` +
                chalk.green(`root`) + `: sets current environment root \n` +
                chalk.green(`run`) + `: runs the current src directory \n` +
                chalk.green(`config [-envs]`) + ` : prints out the current environment config \n` +
                chalk.green(`install [-dev] [packages]`) + `: installs packages to current environment \n` +
                chalk.green(`uninstall [-all] [packages]`) + `: uninstalls packages in current environment \n` +
                chalk.green(`delete [envs]`) + `: delete an environment \n`
            )
        )
        break;
}