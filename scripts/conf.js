/* 
=================
VARS
==================
*/
const fs = require("fs");
const CONFIG_PATH = "./config.json";
const colors = require("colors");
const fetch = require("node-fetch");
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

/* 
=================
Start
==================
*/

console.log(`\n\n\n\n\nModmail Config Generator`.blue);

/* 
=================
FUNCTIONS
==================
*/

function askForOverwrite() {
  rl.question("Config file already exists. Overwrite? [Y]/[N]\n".red, function(response) {
    switch (response) {
      case "Y":
        createConf();
        break;
      case "N":
        rl.close();
        break;
      default:
        askForOverwrite();
    }
  });
}

async function createConf() {
  const exampleconf = await fetch("https://raw.githubusercontent.com/Saamstep/modmail/master/example.config.json");
  const data = await exampleconf.text();
  console.log("Overwriting...".red);
  fs.writeFileSync("tst.json", data);
  modifyProps();
}

function modifyProps() {
  const conf = require("../tst.json");
  for (i in conf) {
    console.log(i);
  }
}

/* 
=================
LOGIC
==================
*/

// createConf();
// modifyProps();
fs.access(CONFIG_PATH, fs.constants.F_OK, err => {
  if (err == null) {
    //already exists
    askForOverwrite();
  } else {
    //create
    console.log("Config file does not exists. Creating new file...".green);
  }
});

rl.on("close", function() {
  console.log("Readline closed");
  process.exit(0);
});
