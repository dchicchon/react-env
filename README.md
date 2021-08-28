# React env

Use Create React App only once! Then you are able to get any `src` folder and run it on a root React App.

# Installation

```console
npm i -g @dchicchon/react-env
```

# Packages Used

[Craco](https://www.npmjs.com/package/@craco/craco) - Utilized to override Create React App's default Webpack and Babel configuration.

[ShellJS](https://github.com/shelljs/shelljs) - Shell commands

[Chalk](https://www.npmjs.com/package/chalk) - Coloring console logs

# Developed With

[TypeScript](https://www.typescriptlang.org/)

# Config Setup

This is an example of what an environment's configuration will look like

```js
{
  "current": "base",
  "envs": {
    "base": {
       // selected react root of application
      "root": "C:\\Users\\danie\\Desktop\\Code\\JS\\npm_packages\\react-test",
       // selected source to run app
      "source": "C:\\Users\\danie\\Desktop\\Code\\JS\\npm_packages\\source\\src",
      "dependencies": {
        "@craco/craco": "6.2.0",
        "@testing-library/jest-dom": "^5.14.1",
        "@testing-library/react": "^11.2.7",
        "@testing-library/user-event": "^12.8.3",
        "react": "^17.0.2",
        "react-dom": "^17.0.2",
        "react-scripts": "^4.0.3",
        "web-vitals": "^1.1.2"
      },
      "devDependencies": {
        "axios": "^0.21.1",
        "express": "^4.17.1",
        "nodemon": "^2.0.12"
      }
    }
  }
}
```

# Usage

### Setting Root and Source Directories

`Be sure to be in the directory in order to set root and source directories`
Also be sure to have a src directory with an index.js in the `root` directory. There doesn't have to be anything
in there, but the app will complain if nothing is there.

```
react-env root // setting root
react-env source // setting source
```

Running `source` folder in root

```
// run this in desired `src` folder to run in root
react-env run;
```

Checking current config

```
// this will check your current environment config
react-env config
// use flag -envs to list envs
react-env config -envs
```

Install dependencies to your root react app from anywhere

```
// have root install the dependencies in the current env
react-env install

// install dependencies
react-env install axios

// use flag -dev to install devDependencies
react-env install -dev axios
```

Switch or create a new environment

```
// if 'test' does not exist, it will create a new environment
react-env switch test
```

Uninstall dependencies from env

```
react-env uninstall
```

Delete environments in config

```
react-env delete test
```
