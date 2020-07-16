const Discord = module.require("discord.js");
const store = require(__dirname + "/pollUtils.js");

module.exports.run = async (bot, message, args) => {
    if (message.guild === null) return message.channel.send("Polls will not work in DMs");
    //use pollUtils refresh to refresh polls
    store.refresh(bot);   
}

module.exports.help = {
    name: "pollRefresh",
    description: 'Refreshed the polls the bot has saved. It will go through all the saved'
    + ' polls and compare with the poll in Discord to update the votes. This process runs'
    + ' every time the bot restarts. If there are issues with poll vote counting, use this'
    + ' command. \nUse: !pollRefresh'
}