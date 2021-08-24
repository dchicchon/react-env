#! /usr/bin/env node
var fs = require("fs");
var path = require("path");
var Config = require("../interfaces/Config").Config;
var configFile = path.join(path.dirname(__filename), "../lib/config.json");
var rawData = fs.readFileSync(configFile);
var config = JSON.parse(rawData);
var env = config[config.current];
var flag = process.argv[2];
// Check for flags
if (flag) {
    // check the flag
    switch (flag) {
        case "-envs":
            var list = Object.keys(config).filter(function (key) { return key !== "current"; });
            console.log("List of envs");
            list.forEach(function (env) { return console.log(env); });
            break;
    }
}
else {
    console.log(config.current + " config");
    console.log(env);
}
