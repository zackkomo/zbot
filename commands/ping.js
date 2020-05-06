const Discord = module.require("discord.js")

module.exports.run = async (bot, message, args) => {
    
    message.channel.send("<@" + message.author.id + ">" + " Pong!");
}

module.exports.help = {
    name: "ping",
    description: "Description: Replies with Pong when called.\nUse: !ping"
}