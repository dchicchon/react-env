#! /usr/bin/env node
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
            `\nReact Env: Creating Multiple React Environments\n\n` +
            `Please Try one of the following commands:\n` +
            `root: sets current environment root \n` +
            `run: runs the current src directory \n` +
            `config: prints out the current environment config \n` +
            `install: installs packages to current environment \n` +
            `uninstall: uninstalls packages in current environment \n` +
            `delete: sets current environment root \n`

        )
        break;
}