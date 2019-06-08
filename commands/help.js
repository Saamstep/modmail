exports.run = (client, message, args) => {
  const CommandList = require('../commandList.js');

  const embed = {
    description:
      'Hello! I am ModMail. I am a safe way for you to message Discord server staff. For more info I have direct messaged you a list of commands.',
    color: 3398293,
    author: {
      name: 'ModMail',
      icon_url: `${client.user.avatarURL}`
    },
    fields: [
      {
        name: 'Usage',
        value:
          'Just direct message me any concerns and a staff member will respond when convenient.'
      },
      {
        name: 'Prefix',
        value: `\`${client.ConfigService.config.prefix}\``
      }
    ]
  };
  message.channel.send({ embed });
  message.author.send(CommandList.helpString());
};
