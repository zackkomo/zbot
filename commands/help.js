const Discord = module.require("discord.js");
const fs = require("fs");


module.exports.run = async (bot, message, args) => {
    //default help
    if (args.length < 1) return message.channel.send("Ask about a command by sending !help [command name]. For a list of commands type !help commands");

    //more than 1 arguement
    if (args.length != 0) {
        //get the filenames in "commands" folder
        fs.readdir(__dirname, (err, files) => {
            if (err) console.error(err);

            let jsfiles = [];

            //ignore the jsons and remove the .js from the valid ones
            let count = 0;
            let arrChangeLine = []
            let Commandfiles = files.filter(f => {
                if (f.endsWith("js") && !f.includes("Utils")) {
                    f = f.split(".");
                    jsfiles.push(f[0]);
                    if (count%2 == 0){
                        arrChangeLine.push("|   ")
                    }
                    else{
                        arrChangeLine.push("\n")
                    }
                    count++;
                }
            });

         
            let cmdnames = "```Available commands: \n";

            //for each valid command
            jsfiles.forEach((f, i) => {
                //set path to js
                let props = require(`./${f}`);
                //find the command the user wanted through the name property in the help module
                if (props.help.name === args[0]) {
                    //send the description to the user
                    message.author.send("```" + "!" + args[0] + "\n" + props.help.description + "```");
                }
                //compile list of available commands
                cmdnames += props.help.name.padEnd(15, ' ') + arrChangeLine[i];
            })
            cmdnames += "```";
            //if the arguement was commands, send the list of commands
            if (args[0] === "commands") {
                message.author.send(cmdnames);
            }
        })
    }
}

module.exports.help = {
    name: "help",
    description: "Description: You can use this to get a list of all commands (use 1)"
    + " or a description and use of a specific command. All messages will be through a"
    + " direct message.\nUse 1: !help commands\nUse 2: !help [command name]"
}