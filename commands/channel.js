const Discord = module.require("discord.js");
const fs = require("fs");


module.exports.run = async (bot, message, args) => {
    
    let count = (message.content.match(/"/g) || []).length;
   
    let messageArr = (message.content.replace("\n","\\n").replace("\r","\\r")).split("\"");
    messageArr = messageArr.slice(1); //remove first token, the rest are args
    
    if (!count >= 2){
        return message.channel.send("Missmatch arguements. You need at least the title between 2 double quotes");
    }
    
    messageArr = messageArr.filter(x => !(x === " " | x === ""));
    
    if (messageArr.length > 11) return message.channel.send("There are too many arguements! The max is 10.");

    let server = message.guild;
    let user = message.author.username;
    let title = messageArr.shift();

    let options = {
        type : title
    }

    server.channels.create(title);

}

module.exports.help = {
    name: "channel",
    description: ""
}