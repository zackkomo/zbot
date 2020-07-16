const Discord = module.require("discord.js");
const store = require(__dirname + "/pollUtils.js");

module.exports.run = async (bot, message, args) => {
    if (message.guild === null) return message.channel.send("Polls will not work in DMs");
    //use pollUtils remove to delete poll from memory
    store.remove(args[0], message);   
}

module.exports.help = {
    name: "pollRemove",
    description: 'Description: Removes a poll based on the poll number following the command.'
    + 'When you enter the command, it will show you the poll you are trying to remove and prompt'
    + ' you for a confirmation (y for yes and n for no). To remind yourself of the poll number,'
    + ' use !pollCheck.\nUse : !pollRemove [poll number]'
}