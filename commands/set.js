const fs = require('fs');
const logEvent = require('../modules/logMod.js');
const consoleEvent = require('../modules/consoleMod.js');
const error = require('../modules/errorMod.js');
const ConfigService = require('../config.js');

exports.run = (client, message, args) => {
  let option = args[0];

  let isAdmin = require('../modules/isAdmin.js');
  if (isAdmin(message.author, message)) {
    switch (option) {
      case 'prefix':
        let newPrefix = args[1];
        ConfigService.setConfigProperty('prefix', newPrefix);
        message.channel.send(`New prefix is now \`${newPrefix}\``);
        logEvent(
          'New Prefix',
          `Prefix has been changed to **${newPrefix}**`,
          16776960,
          message
        );
        break;
      case 'log':
        let newLog = args[1];
        if (newLog.includes('#')) {
          return message.channel.send('Just write the name of the channel.');
        } else {
          ConfigService.setConfigProperty('log', newLog);
          message.channel.send(`Log channel changed to \`${newLog}\``);
          logEvent(
            'Log Channel Update',
            `Log Channel has been changed to **${newLog}**`,
            16776960,
            message,
            client
          );
        }
        break;
      case 'debug':
        let newDebug = args[1];
        if (newDebug == 'true') {
          ConfigService.setConfigProperty('debug', true);
          consoleEvent('Debug mode was enabled');
          message.channel.send('Debug mode enabled.');
          return;
        }
        if (newDebug == 'false') {
          ConfigService.setConfigProperty('debug', false);
          consoleEvent('Debug mode was disabled');
          message.channel.send(`Debug mode disabled.`);
          return;
        } else {
          return message.channel.send('Value must be true or false.', {
            code: 'asciidoc'
          });
        }
        break;
      case 'game':
        let newGame = args.join(' ').slice(5);
        if (newGame == null) {
          return message.channel.send(
            `${ConfigService.config.prefix}set game [Game Value]`,
            {
              code: 'asciidoc'
            }
          );
        }
        client.user.setPresence({ game: { name: `${newGame}`, type: 0 } });
        ConfigService.setConfigProperty('defaultGame', newGame);
        message.channel.send(
          'Updated the game status to: ' + '`' + newGame + '`'
        );
        logEvent(
          'Default Game Update',
          `Default Game has been changed to **${newGame}**`,
          16776960,
          message,
          client
        );
        break;
      case 'modmail':
        let newMail = args[1];
        if (newMail.includes('#')) {
          return message.channel.send('Please write the ID only');
        } else {
          ConfigService.setConfigProperty(
            client.ConfigService.config.channel.modmail,
            newMail
          );
          message.channel.send(`Log channel changed to \`${newMail}\``);
          logEvent(
            'Log Channel Update',
            `Log Channel has been changed to **${newMail}**`,
            16776960,
            message,
            client
          );
        }
        break;
      default:
        //usage
        message.channel.send(
          `['Bot_Settings']\n\n"You can edit these values with '${
            ConfigService.config.prefix
          }set [option] [new value]'\nOptions are the names in gold with with no spaces and no caps!\nEx: ?set log logger"` +
            `\n\n\n'General'\nPrefix: "${
              ConfigService.config.prefix
            }"\nGame: "${ConfigService.config.defaultGame}"\nDebug: "${
              ConfigService.config.debug
            }"\n'Channels'\nLog: "#${ConfigService.config.channel.log}"` +
            `\nModMail ID: "${ConfigService.config.channel.modmail}` +
            `"\n'Role'\nAdmin Role: "${ConfigService.config.role.admin}\"`,
          { code: 'ml' }
        );
    }
  }
};
exports.description = "Allows admins to change the bot's settings.";
