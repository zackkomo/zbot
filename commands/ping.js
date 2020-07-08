const Discord = module.require("discord.js")

module.exports.run = async (bot, message, args) => {
    //@ the user and say ping in the channel the message was sent
    message.channel.send("<@" + message.author.id + ">" + " Pong!");
}

module.exports.help = {
    name: "ping",
    description: "Description: Replies with Pong when called.\nUse: !ping"
}