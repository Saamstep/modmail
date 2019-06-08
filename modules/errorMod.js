module.exports = function errorEvent(type, message) {
  message.channel.send(':no_entry_sign: | ' + type);
  message.channel.stopTyping(true);
};
