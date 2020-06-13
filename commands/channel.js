const Discord = module.require("discord.js");
const fs = require("fs");


module.exports.run = async (bot, message, args) => {

    let count = (message.content.match(/"/g) || []).length;

    let messageArr = (message.content.replace("\n", "\\n").replace("\r", "\\r")).split("\"");
    messageArr = messageArr.slice(1); //remove first token, the rest are args

    if (!count >= 2 || count%2 != 0) {
        return message.channel.send("Missmatch arguements. You need at least the title between 2 double quotes");
    }

    messageArr = messageArr.filter(x => !(x === " " | x === ""));

    if (messageArr.length > 11) return message.channel.send("There are too many arguements! The max is 10.");

    let server = message.guild;
    let user = message.author.username;
    let title = messageArr.shift();



    let permissions = [{
        id: message.guild.id,
        deny: ['VIEW_CHANNEL'],
    },
    {
        id: message.guild.member(bot.user).id,
        allow: ['VIEW_CHANNEL'],
    },
    {
        id: message.author.id,
        allow: ['VIEW_CHANNEL'],
    }
    ];

    let re = /\s|<|>|!|@/g;

    for (let i = 0; i < messageArr.length; i++) {
        if (!message.guild.member(messageArr[i].replace(re, ""))) {
            return message.channel.send("One of the users provided does not exist, try again");
        }
       
        permissions.push({
            id: messageArr[i].replace(re, ""),
            allow: ['VIEW_CHANNEL']
        })

    }
    let options = {
        type: "text",
        permissionOverwrites: permissions
    }

    let newChannel = server.channels.create(title, options).catch(err => {
        console.log(err);
    return message.channel.send(err.message);
})
    
}

module.exports.help = {
    name: "channel",
    description: 'Description: Creates a new channel with listed people. If just a title is provided you will be the only one in the channel (along with the server owner).' +
        '\nUse : !channel "[title]" "@user" "@user"'
}