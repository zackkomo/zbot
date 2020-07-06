const Discord = module.require("discord.js");
const fs = require("fs");


module.exports.run = async (bot, message, args) => {

    let count = (message.content.match(/"/g) || []).length;

    let messageArr = (message.content.replace("\n", "\\n").replace("\r", "\\r")).split("\"");
    messageArr = messageArr.slice(1); //remove first token, the rest are args

    if (!count >= 2 || count % 2 != 0) {
        message.author.send("Missmatch arguements. You need at least the title between 2 double quotes");
        return message.delete();
    }

    messageArr = messageArr.filter(x => !(x === " " | x === ""));

    if (messageArr.length > 11) {
        message.author.send("There are too many arguements! The max is 10.");
        return message.delete();
    }

    let server = message.guild;
    let user = message.author.username;
    let title = messageArr.shift();


    server.channels.create("Personal Text Channels", {type : 'category'}).
    
    // let category = server.channels.cache.find(c => c.name == "Personal Text Channels" && c.type == "category"),
    //     channel = server.channels.cache.find(c => c.name == "general" && c.type == "text");

    // if (!!category){
    //     console.log("In")
    //     await server.channels.create("Personal Text Channels", {type : "category"})
    // }

    // if (category && channel) channel.setParent(category.id);
    // else console.error(`One of the channels is missing:\nCategory: ${!!category}\nChannel: ${!!channel}`);
    
    // // find(async c => {
    //     console.log("in for " + c)
    //     return (c.name === "Personal Text Channels" && c.type === "category");
    // });
    console.log(category);



    // if (category && channel) channel.setParent(category.id);
    // else console.error(`One of the channels is missing:\nCategory: ${!!category}\nChannel: ${!!channel}`);
    // console.log(server.channels.cache)


    // let permissions = [{
    //     id: message.guild.id,
    //     deny: ['VIEW_CHANNEL'],
    // },
    // {
    //     id: message.guild.member(bot.user).id,
    //     allow: ['VIEW_CHANNEL'],
    // },
    // {
    //     id: message.author.id,
    //     allow: ['VIEW_CHANNEL'],
    // }
    // ];

    // let re = /\s|<|>|!|@/g;

    // for (let i = 0; i < messageArr.length; i++) {
    //     if (!message.guild.member(messageArr[i].replace(re, ""))) {
    //         message.author.send("One of the users provided does not exist, try again");
    //         return message.delete();
    //     }

    //     permissions.push({
    //         id: messageArr[i].replace(re, ""),
    //         allow: ['VIEW_CHANNEL']
    //     })

    // }
    // let options = {
    //     type: "type",
    //     permissionOverwrites: permissions
    // }

    // let newChannel = server.channels.create(title, options).catch(err => {
    //     console.log(err);
    //     message.author.send(err.message);
    //     return message.delete();
    // })
    //message.delete();
}

module.exports.help = {
    name: "channel",
    description: 'Description: Creates a new channel with listed people. If just a title is provided you will be the only one in the channel (along with the server owner).' +
        '\nUse : !channel "[title]" "@user" "@user"'
}