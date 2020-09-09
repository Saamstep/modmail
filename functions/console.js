const chalk = require("chalk");
module.exports = {
  log: function (prefix, msg) {
    console.log(chalk.magenta(`[${prefix}] `) + chalk.cyan(msg));
  },
  error: function (prefix, msg) {
    console.log(chalk.red(`[${prefix}] `) + chalk.red.bold(msg));
  },
  line: function () {
    console.log(chalk.blue.strikethrough("+================================+"));
  },
  title: function (title) {
    console.log(chalk.magenta.bold(title));
  },
};
