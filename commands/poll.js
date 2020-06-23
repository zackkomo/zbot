const Discord = module.require("discord.js");
const fs = require("fs");
const store = require(__dirname + "/pollUtils.js");
const emotes = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];

module.exports.run = async (bot, message, args) => {
    
    let count = (message.content.match(/"/g) || []).length;
   
    let messageArr = (message.content.replace("\n","\\n").replace("\r","\\r")).split("\"");
    messageArr = messageArr.slice(1); //remove first token, the rest are args
    

    if (!(count >= 4 && count%2 == 0)){
        return message.channel.send("Missmatch arguements. You need at least the title between 2 double quotes, as well as at least one option between 2 double quotes");
    }
    
    messageArr = messageArr.filter(x => !(x === " " | x === ""));
    
    if (messageArr.length <= 1) return message.channel.send("There is no title or no options. You need at least 2 arguements.");
    if (messageArr.length > 11) return message.channel.send("There are too many options! The max is 10.");

    let title_g = messageArr.shift();
    
    let field = [];
    let mes = "```"+ "\n" +"Single vote poll by " + message.author.username + "\n" + title_g + "\n";
    

    for (let i = 0; i < messageArr.length; i++) {
        field.push( emotes[i] + "  " + messageArr[i]);
        mes += field[i] + "\n" + "---------" + "\n";
    }
    mes +=  "```";

    const pollmes = {
        type : 0,
        title: title_g,
        author: message.author.username,
        channel: message.channel.id,
        options: field,
        description: null,
        mes: mes,
        votes: []
    }

    store.add(pollmes, messageArr.length, message);
}

module.exports.help = {
    name: "poll",
    description: 'Description: Creates a poll where each persons last reaction counts as their only vote. You can use the reactions on the bottom to vote. A percentage of the vote distribution will be printed on the poll itself. If you want to reaccess the poll, use the !pollCheck [poll number] that is given to you when the poll is created.\nUse: !poll "tittle(can have spaces)" "Option1" "Option2" ...'
}