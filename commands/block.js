const { info } = require("consola");

module.exports = {
  name: "block",
  description: "Block and unblock a user from using ModMail.",
  perm: 1,
  args: ["@mention"],
  async execute(client, message, args, Tickets) {
    if (message.mentions.members.size == 1) {
      let target = message.mentions.members.first().id;
      if (client.settings.get("blockedUsers").includes(target)) {
        let users = client.settings.get("blockedUsers", target);
        client.settings.set(
          "blockedUsers",
          users.filter((u) => u != target)
        );
        message.channel.send(`Unblocked user ${target}`);
      } else {
        client.settings.push("blockedUsers", target);
        message.channel.send(`Blocked user ${target}`);
      }
    } else {
      return false;
    }
  },
};
