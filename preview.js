//Use this to append external data of a user to a ticket channel to give staff members more context about the user
//You can do and send anything you want here! This is all up to you to customize and send a message

const { info, error } = require("consola");
const fetch = require("node-fetch");

module.exports.preview = async function (creator, channel) {
  //creator is of type User
  //channel is of type TextChannel that is the ticket channel for the user

  /* ===Example=== 
    const request = await fetch(`https://api.example.com/data/${creator.id}`);
    const data = await request.json();
    channel.send(`Info about this user: ${data}`);
  */

  return;
};
