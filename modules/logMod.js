module.exports = function logEvent(event, reason, color, message, client) {
  const ConfigService = require("../src/config.js");

  let now = new Date();

  const embed = {
    color: color,
    footer: {
      icon_url: client.user.avatarURL,
      text: `ModMail Action Logger`,
      timestamp: Date.now()
    },
    author: {
      name: `${event}`,
      icon_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLL-4ewZu2ZdHdT3QV63N7SmhS9Qz_TQ4Bkh6b33GZNAh2g7Cc&s"
    },
    fields: [
      {
        name: "Reason",
        value: `${reason}`
      },
      {
        name: "Executed By",
        value: `${message.author}`
      }
    ]
  };

  let guild = client.guilds.get(`${ConfigService.config.guildID}`);
  let logchannel = guild.channels.find(n => n.name == `${ConfigService.config.channel.log}`);
  logchannel.send({ embed });
};
