const fs = require("fs");
const colors = require("colors");
const CONFIG_PATH = "./config.json";

const failAndExit = () => {
  console.error("config.js: Error loading Nano config file. Please make a config.json at the root directory and try again.".underline.red);
  process.exit(1);
};

// Singleton structure in JS
var ConfigService = (function() {
  var data;
  try {
    data = fs.readFileSync(CONFIG_PATH);
  } catch (e) {
    failAndExit();
  }

  if (data) {
    this.config = JSON.parse(data);
  } else {
    failAndExit();
  }

  this.setConfigProperty = (property, value) => {
    console.log(`Attempting to change config property "${property}" to "${value}"`);
    console.log(`Value before ${this.config[property]}`);

    if (this.config) {
      this.config[property] = value;
    } else {
      console.error("No config.json loaded into memory");
    }

    console.log(`Value after ${this.config[property]}`);

    fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), err => console.error);
  };

  return this;
})();

module.exports = ConfigService;
