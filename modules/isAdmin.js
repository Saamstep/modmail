module.exports = function isAdmin(user, message, msg) {
  const ConfigService = require("../src/config.js");
  let admin = message.member.roles.find("name", `${ConfigService.config.role.admin}`);

  let error = require("../modules/errorMod.js");
  try {
    if (message.member.roles.has(admin.id)) {
      return true;
    } else {
      return false;
    }
  } catch {
    if (message.author.id == ConfigService.config.ownerid) {
      return true;
    } else {
      let role = ConfigService.config.role.admin;
      if (msg == true) {
        error(`You are missing the \`${role}\` permission role.`, message);
      }
    }
  }
};
