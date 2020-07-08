const Discord = module.require("discord.js")
const botConfigPath = "./config.json";
const store = require(__dirname + "/pollUtils.js");
const fs = require("fs");

module.exports.run = async (bot, message, args) => {
    //
    fs.readFile(botConfigPath, 'utf-8', function (err, data) {
        if (err) throw err

        let config = JSON.parse(data);

        config.botEnable = !config.botEnable;
        let en = config.botEnable;
        if (en){
            store.refresh(bot);
        }
        fs.writeFile(botConfigPath, JSON.stringify(config), 'utf-8', function (err) {
            if (err) throw err
            
            if (en){
                message.channel.send("Bot enabled");
                console.log("Bot enabled");
            }
            else{
                message.channel.send("Bot disabled");
                console.log("Bot disabled");
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