const ConfigService = require("./config.js");
var commandList = (function() {
  this.commands = {};

  this.addCommand = (command, isCustom, description) => {
    this.commands[command] = {
      isCustom: isCustom,
      description: description
    };
  };

  this.helpString = () => {
    var msg = "";
    for (command in this.commands) {
      msg += `${ConfigService.config.prefix}${command} - ${this.commands[command].isCustom ? "[Custom Command]" : this.commands[command].description}\n`;
    }
    return `\`\`\`${msg}\`\`\``;
  };

  return this;
})();

module.exports = commandList;
