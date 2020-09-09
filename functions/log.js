module.exports = function log(title, content, color, message) {
  return message.guild.channels.cache
    .find((ch) => ch.id == this.config.channel.log || ch.name == this.config.channel.log)
    .send({
      embed: {
        description: content,
        color: color,
        timestamp: Date.now(),
        footer: {
          icon_url: `${this.user.avatarURL()}`,
          text: `${this.user.username} - Logs`,
        },
        author: {
          name: title,
          icon_url: "https://samstep.net/bots/assets/log.png",
        },
        fields: [
          {
            name: "Ran By",
            value: `${message.author}`,
          },
        ],
      },
    });
};
