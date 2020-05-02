const Discord = module.require("discord.js");
const store = require(__dirname + "/pollUtils.js");

module.exports.run = async (bot, message, args) => {
    store.refresh(message);   
}

module.exports.help = {
    name: "pollRefresh",
    description: 'Recounts the votes on polls. Used when people vote while the bot was down. Enter !pollRefresh to use.'
}