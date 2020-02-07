exports.run = (client, message, args) => {
  message.channel.startTyping(1);
  function sender() {
    message.delete(0);
    let msgSender = args.join(' ');
    message.channel.send(msgSender);
    message.channel.stopTyping(true);
  }

  let isAdmin = require('../modules/isAdmin.js');
  if (isAdmin(message.author, message)) {
    if (args[0] == null) {
      return message.channel.send(
        `${client.ConfigService.config.prefix}say [message]`,
        { code: 'asciidoc' }
      );
    } else {
      return sender();
    }
  }
};

exports.cmd = {
  enabled: true,
  category: 'Utility',
  level: 3,
  description: 'Send messages as the bot'
};
