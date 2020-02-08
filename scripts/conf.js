/* 
=================
VARS
==================
*/
const fs = require("fs");
const CONFIG_PATH = "./tst.json";
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

console.log(`\n\nYModmail Config Generator`.blue + "\n\n");

/* 
=================
FUNCTIONS
==================
*/

async function askForOverwrite() {
  const question1 = () => {
    return new Promise((resolve, reject) => {
      rl.question(`A config file already exists at \'${CONFIG_PATH}\' override the current config file?`.blue + `\n* NOTE: THIS IS IRREVERSABLE`.red.bold + `\n[Y]es or [N]o\n`.blue, answer => {
        // console.log(`Thank you for your valuable feedback: ${answer}`);
        switch (answer) {
          case "Y":
            createConf();
            break;
          case "N":
            rl.close();
            break;
          default:
            askForOverwrite();
        }
        resolve();
      });
    });
  };
  await question1();
}

async function createConf() {
  console.log("Grabbing config from https://github.com/Saamstep/modmail/master/example.config.json...".green);
  const exampleconf = await fetch("https://raw.githubusercontent.com/Saamstep/modmail/master/example.config.json");
  const data = await exampleconf.json();
  const setToken = () => {
    return new Promise((resolve, reject) => {
      rl.question("Paste the client ID of the bot user from https://discordapp.com/developers/applications/\n".blue, answer => {
        data.token = answer;
        resolve();
      });
    });
  };
  const setOwner = () => {
    return new Promise((resolve, reject) => {
      rl.question("Paste the owner ID of the user\n".blue, answer => {
        data.ownerid = answer;
        resolve();
      });
    });
  };
  await setToken();
  await setOwner();
  console.log("Creating config file...".green);
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(data, null, 2));
  rl.close();
}

// function modifyProps() {
//   const conf = require("../tst.json");
//   for (i in conf) {
//     console.log(i);
//   }
// }

/* 
=================
LOGIC
==================
*/

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
  console.log("Done!".green);
  process.exit(0);
});
