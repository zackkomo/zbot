const Discord = module.require("discord.js");
const store = require(__dirname + "/pollUtils.js");

module.exports.run = async (bot, message, args) => {
    store.remove(args[0], message);   
    
}

module.exports.help = {
    name: "pollRemove",
    description: 'removes a poll based on the number. Enter !pollRemove [number]. To get number use !pollCheck "[title]"'
}