module.exports = function isOwner(message, msg) {
  const ConfigService = require('../src/config.js');

  let error = require('../modules/errorMod.js');
  if (message.author.id == ConfigService.config.ownerid) {
    return true;
  } else {
    if (msg == true) {
      return error(`You are not the owner!`, message);
    }
  }
};
