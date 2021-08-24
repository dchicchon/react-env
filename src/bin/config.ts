#! /usr/bin/env node
import { Config } from '../interfaces/Types'
const path = require('path')
const fs = require("fs");
// const path = require("path");
const configFile = path.join(path.dirname(__filename), "../lib/config.json");
const rawData = fs.readFileSync(configFile);
const config: Config = JSON.parse(rawData);
const env = config.envs[config.current];
const flag: string = process.argv[2];
// Check for flags
if (flag) {
  // check the flag
  switch (flag) {
    case "-envs":
      let list = Object.keys(config).filter((key) => key !== "current");
      console.log("List of envs");
      list.forEach((env) => console.log(env));
      break;
  }
} else {
  console.log(`${config.current} config`);
  console.log(env);
}
