
const ignoreList = require("./ignore.json");
require('dotenv').config()
const token = process.env.CLIENT_TOKEN;
const prefix = process.env.PREFIX;
const Discord = require("discord.js");
const fs = require("fs");
const pollList = "./commands/pollList.json";
const store = require("./commands/pollUtils.js");
const emotes = ["\u0031\u20E3", "\u0032\u20E3", "\u0033\u20E3", "\u0034\u20E3", "\u0035\u20E3", "\u0036\u20E3", "\u0037\u20E3", "\u0038\u20E3", "\u0039\u20E3"];

const bot = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
bot.commands = new Discord.Collection();


fs.readdir("./commands/", (err, files) => {
    if (err) console.error(err);

    let jsfiles = files.filter(f => f.split(".").pop() === "js");
    if (jsfiles.length <= 0) {
        console.log("There are no commands do load");
        return;
    }


    console.log("Loading..");
    jsfiles.forEach((f, i) => {
        if (ignoreList.ignore.indexOf(f) > -1) {
            jsfiles.splice(jsfiles.indexOf(f));

        }
        else {
            let props = require(`./commands/${f}`);
            console.log(`${i + 1}) ${f}`)
            bot.commands.set(props.help.name, props);
        }
    })

    console.log(`Loaded ${jsfiles.length} commands.`);
})

bot.on("ready", () => {
    console.log(`${bot.user.username} is ready!`);
    console.log(`Source directory: ${__dirname}`);
    store.refresh();
});

bot.on("message", async message => {
    if (message.author.bot) return;

    let messageArr = message.content.split(" ");
    let command = messageArr[0]; //save first token
    let args = messageArr.slice(1); //remove first token, the rest are args

    if (!command.startsWith(prefix)) return;

    let cmd = bot.commands.get(command.slice(prefix.length));
    if (cmd) cmd.run(bot, message, args);
});


bot.on('messageReactionAdd', async (reaction, user) => {
    if (user.username === bot.user.username) return;  
    // When we receive a reaction we check if the reaction is partial or not
    if (reaction.partial) {
        // If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
        try {
            await reaction.fetch();
        } catch (error) {
            console.log('Something went wrong when fetching the message: ', error);
            // Return as `reaction.message.author` may be undefined/null
            return;
        }
    }
    
    if (emotes.indexOf(reaction.emoji.name) != -1) {
        store.update(reaction, user, "+");
    }
});

bot.on('messageReactionRemove', async (reaction, user) => {
    if (user.username === bot.user.username) return;
    // When we receive a reaction we check if the reaction is partial or not
    if (reaction.partial) {
        // If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
        try {
            await reaction.fetch();
        } catch (error) {
            console.log('Something went wrong when fetching the message: ', error);
            // Return as `reaction.message.author` may be undefined/null
            return;
        }
    }
 
    if (emotes.indexOf(reaction.emoji.name) != -1) {
        store.update(reaction, user, "-");
    }
});
console.log("token is " + process.env.CLIENT_TOKEN)
bot.login(token);


