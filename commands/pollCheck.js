const Discord = module.require("discord.js");
const store = require(__dirname + "/pollUtils.js");

module.exports.run = async (bot, message, args) => {
    if (message.guild === null) return message.channel.send("Polls will not work in DMs");
    //use pollUtils check to access pollList.json and check on poll
    store.check(args[0], message);
}

module.exports.help = {
    name: "pollCheck",
    description: 'Description: You can check on polls. If no arguements are added'
    + '(use 1) then a list of available polls for the channel are posted. If you add'
    + ' a number after the command (use 2), then it will repost that specific poll'
    + ' and voting on the new post will be valid while voting on the older post will no'
    + ' longer work.\nUse 1: !pollcheck\nUse 2: !pollCheck [number]'
}