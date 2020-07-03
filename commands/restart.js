const Discord = module.require("discord.js");
require('dotenv').config()
const token = process.env.CLIENT_TOKEN;
const fs = require("fs");


module.exports.run = async (bot, message, args) => {
    
        // send channel a message that you're resetting bot [optional]
        message.channel.send('Restarting...')
        .then(msg => bot.destroy())
        .then(() => bot.login(process.env.CLIENT_TOKEN));
        bot.on("ready", () => {
            console.log(`${bot.user.username} is ready!`);
            console.log(`Source directory: ${__dirname}`);
            checkReminders();
            checkPolls();
        });
    
}

module.exports.help = {
    name: "restart",
    description: "Description: Restarts the bot, if !restart is anywhere in the message it will force a restart.\nUse 1: !restart"
}