#! /usr/bin/env node
const path = require("path");
const fs = require("fs");
const configFile = path.join(path.dirname(__filename), "../lib/config.json");
const currentDirectory = process.cwd(); // directory where we run command
console.log("Root");
console.log(`Saving ${currentDirectory} as root`);
console.log(configFile);

const options = {
  root: currentDirectory,
};
const data = JSON.stringify(options);

fs.writeFile(configFile, data, "utf8", (err) => {
  if (err) console.error(err);
});
// Now we will write our currentDirectory to a txt file that will be stored here
// const stream = fs.createWriteStream(root);
// stream.once("open", function (fd) {
//   stream.write(currentDirectory);
//   stream.end();
// });

// Check if this is a react app
