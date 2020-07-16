const Discord = module.require("discord.js")
const botConfigPath = "./config.json";
const store = require(__dirname + "/pollUtils.js");
const fs = require("fs");

module.exports.run = async (bot, message, args) => {
    //
    fs.readFile(botConfigPath, 'utf-8', function (err, data) {
        if (err) throw err

        let config = JSON.parse(data);

        config.debug = !config.debug;
        let en = config.debug;
        
        fs.writeFile(botConfigPath, JSON.stringify(config), 'utf-8', function (err) {
            if (err) throw err
            
            if (en){
                message.channel.send("Debug_mode enabled");
                console.log("Debug_mode enabled");
            }
            else{
                message.channel.send("Debug_mode disabled");
                console.log("Debug_mode disabled");
            }
        });
    })
}

module.exports.help = {
    name: "toggleDebug",
    description: "Dev feature"
}