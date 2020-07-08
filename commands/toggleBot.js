const Discord = module.require("discord.js")
const botConfigPath = "./config.json";
const fs = require("fs");

module.exports.run = async (bot, message, args) => {
    //
    fs.readFile(botConfigPath, 'utf-8', function (err, data) {
        if (err) throw err

        let config = JSON.parse(data);

        config.botEnable = !config.botEnable;
        let en = config.botEnable;
        fs.writeFile(botConfigPath, JSON.stringify(config), 'utf-8', function (err) {
            if (err) throw err
            console.log(`Bot enabled ${en}`);
            if (en){
                message.channel.send("Bot enabled");
            }
            else{
                message.channel.send("Bot disabled");
            }
        });
    })
}

module.exports.help = {
    name: "toggleBot",
    description: "Toggles between the bot being on and off. This will stop active"
    + " features of the bot from working. For example, voting on polls will not update" 
    + " the poll and reminder notifications will not send. The only command that will work"
    + " is !toggleBot. \nUse: !toggleCommands"
}