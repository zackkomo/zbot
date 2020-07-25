const Discord = module.require("discord.js");
const fs = require("fs");
const store = require(__dirname + "/pollUtils.js");
const emotes = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];

module.exports.run = async (bot, message, args) => {
    if (message.guild === null) return message.channel.send("Polls will not work in DMs");
    
    //get the number of arguements between the "
    let count = (message.content.match(/"/g) || []).length;
    //make sure if there are special characters to make them part of the string
    let messageArr = (message.content.replace("\n","\\n").replace("\r","\\r")).split("\"");
    //remove first token, the rest are args
    messageArr = messageArr.slice(1);
    
    //makes sure there is at least a title and that the quotations dont missmatch
    if (!(count >= 4 && count%2 == 0)){
        return message.channel.send("Missmatch arguements. You need at least the title between 2 double quotes, as well as at least one option between 2 double quotes");
    }
    
    //clears out all spaces and blanks created by slicing
    messageArr = messageArr.filter((x) =>{
        return x.replace(/\s/g, '')
      });
      
    //stops if there is not enough arguements, at least a title and an option
    if (messageArr.length <= 1) return message.channel.send("There is no title or no options. You need at least 2 arguements.");
    //stops if there are too many arguements, a max of 10
    if (messageArr.length > 11) return message.channel.send("There are too many options! The max is 10.");
    
    //Define the title
    let title_g = messageArr.shift();
    
    //start compiling message sent to channel
    let mes = "```"+ "\n" +"Single vote poll by " + message.author.username + "\n" + title_g + "\n";
    //start compiling array of votes sent to channel
    let field = [];
    
    //add each vote to the vote field, and to the message
    for (let i = 0; i < messageArr.length; i++) {
        field.push( emotes[i] + "  " + messageArr[i]);
        mes += field[i] + "\n" + "---------" + "\n";
    }
    //stop compiling message sent to channel
    mes +=  "```";

    //create poll object
    const pollmes = {
        //type: 0 for single vote, 1 for multiple votes
        type : 0,
        title: title_g,
        author: message.author.username,
        channel: message.channel.id,
        guild: message.guild.id,
        options: field,
        //description set later
        description: null,
        mes: mes,
        votes: []
    }

    //use pollUtil add to add the poll
    store.add(pollmes, messageArr.length, message);
}

module.exports.help = {
    name: "poll",
    description: "Description: Creates a poll where each persons last reaction counts"
    + " as their only vote. You can use the reactions on the bottom to vote."
    + " A percentage of the vote distribution will be printed on the poll itself."
    + " If you want to reaccess the poll, use the !pollCheck [poll number] that is given"
    + ' to you when the poll is created.\nUse: !poll "title(can have spaces)" "Option1" "Option2" ...'
}