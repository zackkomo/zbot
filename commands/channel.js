const Discord = module.require("discord.js");
const fs = require("fs");
const minimumPermissions = ["VIEW_CHANNEL", "SEND_MESSAGES", "MANAGE_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "READ_MESSAGE_HISTORY"];


module.exports.run = async (bot, message, args) => {
    if (message.guild === null) return message.channel.send("You cannot make a channel here");

    //get the number of arguements between the "
    let count = (message.content.match(/"/g) || []).length;

    //make sure if there are special characters to make them part of the string
    let messageArr = (message.content.replace("\n", "\\n").replace("\r", "\\r")).split("\"");

    //remove first token, the rest are the args
    messageArr = messageArr.slice(1); 

    //makes sure there is at least a title and that the quotations dont missmatch
    if (!count >= 2 || count % 2 != 0) {
        message.author.send("Missmatch arguements. You need at least the title between 2 double quotes");
        return message.delete();
    }

    //clears out all spaces and blanks created by slicing
    messageArr = messageArr.filter(x => !(x === " " | x === ""));

    //limits the number of people to 10
    if (messageArr.length > 11) {
        message.author.send("There are too many arguements! The max is 10.");
        return message.delete();
    }

    //Define the server, user and title
    let server = message.guild;
    let user = message.author.username;
    let title = messageArr.shift();


    //Deal with putting channel in a category
    let catID;
    //if the "Personal Text Channels" already exists get the id
    let tempCategory = await server.channels.cache.some(c => {
        if (c.name === "Personal Text Channels" && c.type == "category"){
         catID =  c.id;
        }
        return c.name === "Personal Text Channels" && c.type == "category";
    });
    //if it doesn't exist, create it and get the id
    if (!tempCategory){
        await server.channels.create("Personal Text Channels", { type: 'category' }).then(async c =>{
            catID = c.id;
        });
    }
    
    //set up default permissions
    let permissions = [
    //clear everyone from the channel
    {
        id: message.guild.id,
        deny: ['VIEW_CHANNEL'],
    },
    //add the bot
    {
        id: message.guild.member(bot.user).id,
        allow: minimumPermissions,
    },
    //add the command user
    {
        id: message.author.id,
        allow: minimumPermissions,
    }
    ];

    //create regex to deal with "@[username]" returned as "<@[user id]>"
    let re = /\s|<|>|!|@/g;

    //Go through given users to add to channel
    for (let i = 0; i < messageArr.length; i++) {
        //clear out unwanted characters parsed from Discord API
        if (!message.guild.member(messageArr[i].replace(re, ""))) {
            //if someone is invalid, exit
            message.author.send("One of the users provided does not exist, try again");
            return message.delete();
        }
        
        //add valid user to the permissions
        permissions.push({
            id: messageArr[i].replace(re, ""),
            allow: ['VIEW_CHANNEL']
        })

    }

    //set the channel options
    let options = {
        type: "type",
        permissionOverwrites: permissions
    }

    //create the channel
    let newChannel = server.channels.create(title, options).then(channel => {
        //put the channel in the category
        channel.setParent(catID);
    })
    .catch(err => {
        console.log(err);
        message.author.send(err.message);
        return message.delete();
    })
    //delete command message
    message.delete();
}

module.exports.help = {
    name: "channel",
    description: 'Description: Creates a new channel with listed people. If just a title is provided you will be the only one in the channel (along with the server owner and the bot).' +
        '\nUse : !channel "[title]" "@user" "@user"'
}