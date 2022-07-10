module.exports = {
  name: "help",
  description: "This message!",
  perm: 0,
  execute(client, message, args) {
    message.react("📩");
    let cmdList = "";
    let permLevel = message.member.roles.cache.some((role) => client.settings.get("writeAccess").includes(role.id)) ? 1 : 0;
    client.commands.forEach((cmd) => {
      let b = "";
      for (a in cmd.args) {
        b += `[${cmd.args[a]}] `;
      }

      if (cmd.perm == permLevel || permLevel == 1) cmdList += `${cmd.name}: ${cmd.description}\nUsage: ${client.settings.get("prefix")}${cmd.name} ${b}\n\n`;
    });
    const embed = {
      title: "Command List",
      description: `\`\`\`\n${cmdList}\`\`\``,
      footer: {
        icon_url: client.user.avatarURL(),
        text: "Do not DM commands.",
      },
    };
    message.author.send({ embeds: [embed] });
  },
};
