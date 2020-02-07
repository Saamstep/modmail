module.exports = function consoleEvent(event) {
  const ConfigService = require('../src/config.js');

  var dateFormat = require('dateformat');
  let now = new Date();
  let timeFormat = dateFormat(now);

  console.log('[LOG] ' + '[' + timeFormat + '] ' + event);
};
