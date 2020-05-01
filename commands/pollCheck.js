const Discord = module.require("discord.js");
const store = require(__dirname + "/pollUtils.js");

module.exports.run = async (bot, message, args) => {
    store.check(args[0], message);   
    
}

module.exports.help = {
    name: "pollCheck",
    description: 'Checks a poll and renews it based on the number. Enter !pollCheck [number]. This will send a poll which will now take the votes"'
}