module.exports = function isAdmin(user, message, msg) {
  const ConfigService = require('../config.js');
  let admin = message.member.roles.find(
    'name',
    `${ConfigService.config.adminrolename}`
  );

  let error = require('../modules/errorMod.js');
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
      let role = ConfigService.config.adminrolename;
      if (msg == true) {
        error(`You are missing the \`${role}\` permission role.`, message);
      }
    }
  }
};
