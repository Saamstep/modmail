<p align="center">
<img src="https://i.imgur.com/pRPIDxV.png" alt="drawing" width="200"/>
</p>

# ModMail 

![Maintenance](https://img.shields.io/maintenance/yes/2022?style=plastic)
![GitHub package.json version](https://img.shields.io/github/package-json/v/saamstep/modmail)
![GitHub repo size](https://img.shields.io/github/repo-size/saamstep/modmail)
![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/saamstep/modmail/discord.js)
![Discord Support](https://img.shields.io/discord/602225388034457610?label=Discord%20Support&labelColor=FFFFF&style=plastic&logo=Discord&link=http://samstep.net/devcord&link=http://samstep.net/devcord)

# 1. Features
* Per user ticket channels
* Leave notes for other staff members in ticket channels (not visible by ticket users)
* Set status messages for tickets
* Assign tickets directly to staff members
* Block users from using ModMail
* Status/HUD channel to view all open tickets
* Separate the hud channel into a backend/admin only server
* Easily close tickets by deleting ticket channels with Discord or use the built in command
* Log ticket contents after the ticket is closed for security and safety

# 2. Commands
> Where [p] is prefix
```
alldata: Dump all data to console
Usage: [p]alldata 

block: Block and unblock a user from using ModMail.
Usage: [p]block [@mention] 

delete: Remove ticket by user ID in database.
Usage: [p]delete 

help: This message!
Usage: [p]help 

ping: See bot response time. Ping!
Usage: [p]ping 
```

# 3. Ticket Channel Commands
> Where [p] is prefix
```
close: Close the ticket with an attached reason, this method sends a message to the user notifying them their ticket has been closed.
Usage: [p]close [reason string]

note: Leave a little message/note in the ticket channel for other staff members to see
Usage: [p]note [note string]
You can also prefix a message in the ticket channel with # to send a note (Example: "# Hello world")

status: Update ticket status message to quickly view the progress of a ticket
Usage: [p]status [new status string]

data: Sends all ticket data stored in DB into the ticket channel
Usage: [p]data

assign: Assign a ticket to a specific staff member and DM notify them of the ticket
Usage: [p]assign [@mention]
```

# 4. Requirements
* Tested on [Node.JS v16.6.0](https://node.js.org) (npm 7.19.1)
* Made and tested with DiscordJS v13.6
* **File system access is required**
* [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

# 5. Config Files Setup
## Setting up settings.json
* Fill in all the following fields, currently commands to edit these fields do not exist. Restarting should not be required if you edit any of these files whilst the bot is running. 
* All channels are IDs and __NOT channel names__
* Do not edit the `lock` or `blockedUsers` value.
* `readAccess` and `writeAccess` will only be set once the Category is FIRST created, if you want to edit the permissions of the category use the "Edit Channel" feature built into Discord.
* If you plan to send logs to ONE guild leave `logtoStaff` as `false`, if you are going to use the second guild, set `logtoStaff` to `true`.
```json
{
  "prefix": "$", //Utility prefix
  "lock": false,
  "primaryGuild": { //This is the server that will accept DMS from users
    "id": "", 
    "logChannel": "", //Log ticket activity here
    "categoryID": "" //The ID of the category to put ModMail tickets, automatically created on startup if it does not exist.
  },
  "staffGuild": { //Your backend guild (optional), leave blank if not using
    "id": "", 
    "logChannel": "", //Log ticket activity here
    "hudChannel": "" //The chanel ID to use as the HUD
  },
  "logToStaff": false,
  "readAccess": [""], //Give roles or users access to read messages (use IDS)
  "writeAccess": [""], //Give roles or users access to read and send messages (use IDS)
  "blockedUsers": [""],
  "messages": {
    "ticketCreated": "We have created a new ticket for you! We will get back to regarding your inquiry as soon as possible.",
    "ticketClosed": "Your ticket has been closed! Thank you for reaching out to us and have a good day.",
    "blocked": "You have been blocked from direct messaging ModMail.",
    "locked": "ModMail is currently locked from accepting direct messages."
  }
}
```

## .env File Setup
* Token is your Discord bot developer token
* Set `DB_USER` and `DB_PASSWORD` to something secure and keep it safe.
```
TOKEN=
DB_USER=
DB_PASSWORD=
```

# 6. Installation
1. Clone the repository `git clone https://github.com/Saamstep/modmail.git`
2. Change your working directory `cd modmail/`
3. Install NPM modules `npm install --save`
4. Copy the example config file and **edit it accordingly** `cp example.config.json config.json`
5. Copy the example env file and **edit it accordingly** `cp example.env .env` 
6. Run the bot with `node .` OR use [pm2](https://pm2.io) to keep it alive (See PM2 section)
7. Invite your bot using my [Invite Generator](https://samstep.net/invite-generator.html). You need your client ID which is found in your [Developer Portal](https://discord.com/developers/applications)

# 7. Examples
## Status/HUD Channel
![hud channel example image](https://i.imgur.com/1uzfkoT.png)

## Notes
![note example](https://i.imgur.com/wc3HlmN.png)

# Last Notes
PM2 has not been tested yet.