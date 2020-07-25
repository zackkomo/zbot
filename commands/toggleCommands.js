const Discord = module.require("discord.js")
const botConfigPath = "./config.json";
const fs = require("fs");

module.exports.run = async (bot, message, args) => {
    //
    if (message.guild === null &&  message.author.username !== "zackkomo") {return message.channel.send("You do not have access to this command here");}
    fs.readFile(botConfigPath, 'utf-8', function (err, data) {
        if (err) throw err

        let config = JSON.parse(data);

        config.commandEnable = !config.commandEnable;
        let en = config.commandEnable;
        fs.writeFile(botConfigPath, JSON.stringify(config), 'utf-8', function (err) {
            if (err) throw err
            console.log(`Commands enabled ${en}`);
            if (en){
                message.channel.send("Commands enabled");
            }
            else{
                message.channel.send("Commands disabled");
            }
        });
    })
}

module.exports.help = {
    name: "toggleCommands",
    description: "Toggles between commands being accepted and not being accepted. This will not stop active"
    + " features of the bot from working. For example, voting on polls is still available and reminder notifications"
    + " will still be sent. The only commands that will work are !toggleBot and !toggleCommands \nUse: !toggleCommands"
}