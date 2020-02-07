module.exports = function isMod(user, message) {
  const ConfigService = require("../src/config.js");
  let mod = message.member.roles.find("name", `${ConfigService.config.role.mod}`);
  let admin = message.member.roles.find("name", `${ConfigService.config.role.admin}`);
  let error = require("../modules/errorMod.js");
  try {
    if (!message.member.roles.has(mod.id)) {
      return false;
    } else {
      return true;
    }
  } catch {
    if (message.author.id == ConfigService.config.ownerid || message.member.roles.has(admin.id)) {
      return true;
    } else {
      let role = client.ConfigService.config.role.mod;
      error(`You are missing the \`${role}\` permission role.`, message);
    }
  }
};
