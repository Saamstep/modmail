const config = require("../config.json");
module.exports = {
  isAdmin: function (message, msg) {
    let admin = message.guild.roles.cache.find((a) => a.id == config.role.admin || a.name === `${config.role.admin}`);
    if (message.member.roles.cache.has(admin.id)) {
      return true;
    } else {
      if (msg) message.say("Invalid permissions, you must be an admin!");
      return false;
    }
  },
  isMod: function (message, msg) {
    // console.log(message.)
    let mod = message.guild.roles.cache.find((n) => n.id == config.role.mod || n.name == `${config.role.mod}`);
    let admin = message.guild.roles.cache.find((n) => n.id == config.role.admin || n.name == `${config.role.admin}`);
    if (message.member.roles.cache.has(admin.id) || message.member.roles.cache.has(mod.id)) {
      return true;
    } else {
      if (msg) message.say("Invalid permissions, you must be a mod!");
      return false;
    }
  },
};
