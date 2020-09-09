module.exports = function error(content, message) {
  return message.say({ embed: { title: "Error", color: 13632027, description: content } }).then((msg) => {
    return;
  });
};
