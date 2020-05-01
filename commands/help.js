const Discord = module.require("discord.js");
const fs = require("fs");


module.exports.run = async (bot, message, args) => {
    if(args.length <1) return message.channel.send("Ask about a command by sending !help [command name]. For a list of commands type !help commands");
    
    fs.readdir(__dirname, (err,files) =>{
        if (err) console.error(err);
        
        
        let jsfiles = files.filter(f => f.split(".").pop() === "js");
        let cmdnames = "Available commands: \n";

        jsfiles.forEach((f,i) => {
        let props = require(`./${f}`);
            if(props.help.name === args[0]){
                message.channel.send("!"+args[0] + " " + props.help.description);
            }
            cmdnames += props.help.name + "\n";
        })

        message.channel.send(cmdnames);
        
    })
}

module.exports.help = {
    name: "help",
    description: "provides a description and example of command"
}