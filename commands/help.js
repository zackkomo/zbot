const Discord = module.require("discord.js");
const fs = require("fs");


module.exports.run = async (bot, message, args) => {
    if (args.length < 1) return message.channel.send("Ask about a command by sending !help [command name]. For a list of commands type !help commands");

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

            console.log(jsfiles);
            let cmdnames = "```Available commands: \n";

            jsfiles.forEach((f, i) => {
                let props = require(`./${f}`);
                if (props.help.name === args[0]) {
                    message.author.send("```" + " !" + args[0] + " " + props.help.description + "```");
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
    description: "provides a description and example of command"
}