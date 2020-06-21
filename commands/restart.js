const Discord = module.require("discord.js");
require('dotenv').config()
const token = process.env.CLIENT_TOKEN;
const fs = require("fs");


module.exports.run = async (bot, message, args) => {
    
        // send channel a message that you're resetting bot [optional]
        message.channel.send('Restarting...')
        .then(msg => client.destroy())
        .then(() => client.login(process.env.CLIENT_TOKEN));
    
}

module.exports.help = {
    name: "restart",
    description: "Description: Restarts the bot, if !restart is anywhere in the message it will force a restart.\nUse 1: !restart"
}