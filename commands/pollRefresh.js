const Discord = module.require("discord.js");
const store = require(__dirname + "/pollUtils.js");

module.exports.run = async (bot, message, args) => {
    store.refresh(bot);   
}

module.exports.help = {
    name: "pollRefresh",
    description: 'UNDER CONSTRUCTION .Recounts the votes on polls. Used when people vote while the bot was down. Enter !pollRefresh to use.'
}