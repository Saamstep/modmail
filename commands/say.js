exports.run = (client, message, args) => {
  message.channel.startTyping(1);
  function sender() {
    message.delete(0);
    let msgSender = args.join(' ');
    message.channel.send(msgSender);
    message.channel.stopTyping(true);
  }
  const ConfigService = require('../config.js');
  let isAdmin = require('../modules/isAdmin.js');
  if (isAdmin(message.author, message)) {
    if (args[0] == null) {
      return message.channel.send(
        `${ConfigService.config.prefix}say [message]`,
        { code: 'asciidoc' }
      );
    } else {
      return sender();
    }
  }
};

exports.description = 'Allows admins to send a message as the bot.';
