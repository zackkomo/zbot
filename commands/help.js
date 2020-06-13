const Discord = module.require("discord.js");
const fs = require("fs");


module.exports.run = async (bot, message, args) => {
    //default help
    if (args.length < 1) return message.channel.send("Ask about a command by sending !help [command name]. For a list of commands type !help commands");

    //more than 1 arguement
    if (args.length != 0) {
        fs.readdir(__dirname, (err, files) => {
            if (err) console.error(err);

            let jsfiles = [];
            let Commandfiles = files.filter(f => {
                if (f.endsWith("js") && ! f.includes("Utils")){
                    f = f.split(".");
                    jsfiles.push(f[0]);
                }
            });

            let cmdnames = "```Available commands: \n";

            jsfiles.forEach((f, i) => {
                let props = require(`./${f}`);
                if (props.help.name === args[0]) {
                    message.author.send("```" + "!" + args[0] + "\n" + props.help.description + "```");
                }
                cmdnames += props.help.name + "\n";
            })
            cmdnames += "```";
            if (args[0] === "commands"){
            message.author.send(cmdnames);
            }
        })
    }
}

module.exports.help = {
    name: "help",
    description: "Description: You can use this to get a list of all commands (use 1) or a description and use of a specific command. All messages will be through a direct message.\nUse 1: !help commands\nUse 2: !helo [command name]"
}