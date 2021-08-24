# React env

Use Create React App only once! Then you are able to get any `src` folder and run it on a root React App.

# Installation

`npm i -g @dchicchon/react-env`

# Usage

Setting Root Directory for React App

```console
// 'run this in the desired root of the react app'
react-env-root;
```

Running `src` folder in root

```console
// 'run this in desired `src` folder to run in root'
react-env-run;
```

Checking current config
```console
// this will check your current environment config
react-env-config
// use flag -envs to list envs
react-env-config -envs
```

Install dependencies to your root react app from anywhere
```console
// have root install the dependencies in the current env
react-env-install

// install dependencies
react-env-install axios

// use flag -dev to install devDependencies
react-env-install -dev axios
```

Switch or create a new environment
```console
// if 'test' does not exist, it will create a new environment
react-env-switch test
```

# Packages Used

[ShellJS](https://github.com/shelljs/shelljs) - Shell commands
