
const ignoreList = require("./nodemon.json");
const botConfigPath = "./config.json";
require('dotenv').config()
const token = process.env.CLIENT_TOKEN;
const prefix = process.env.PREFIX;
const Discord = require("discord.js");
const fs = require("fs");
const pollList = "./commands/pollList.json";
const reminderList = "./commands/reminderList.json";
const store = require("./commands/pollUtils.js");
const emotes = ["\u0031\u20E3", "\u0032\u20E3", "\u0033\u20E3", "\u0034\u20E3", "\u0035\u20E3", "\u0036\u20E3", "\u0037\u20E3", "\u0038\u20E3", "\u0039\u20E3"];
const minimumPermissions = ["VIEW_CHANNEL", "SEND_MESSAGES", "MANAGE_MESSAGES", "EMBED_LINKS", "ATTACH_FILES", "READ_MESSAGE_HISTORY"];
const botchannelName = "bot test";

//helper methods
//on startup refresh polls
function checkPolls() {
    store.refresh(bot);
    return;
}

//WIP for reminders, semi works
function checkReminders() {
    fs.readFile(reminderList, 'utf-8', function (err, data) {
        if (err) throw err
        let arrayOfObjects = JSON.parse(data)

        let reminderNum = -1;
        let badRem = [];
        for (let i = 0; i < arrayOfObjects.reminders.length; i++) {
            let now = Date.now();
            if (arrayOfObjects.reminders[i].start + arrayOfObjects.reminders[i].length < now) {
                let channel = bot.channels.cache.get(arrayOfObjects.reminders[i].channel);
                channel.send("<@" + arrayOfObjects.reminders[i].author + ">" + " I was offline and didn't remind you: " + arrayOfObjects.reminders[i].reminderMes);
            }
            badRem.push(i);
        }

        for (let step = 0; step < badRem.length; step++) {
            console.log("here")
            arrayOfObjects.reminders.splice(step);
        }

        if (badRem.length > 0) {
            fs.writeFile(reminderList, JSON.stringify(arrayOfObjects), 'utf-8', function (err) {
                if (err) throw err
                console.log(`Done removing bad reminders!`);
            });
        }
    })
}

//check if commands are enabled
async function commandsEnabled() {
    let en = null;
    let rawContent = fs.readFileSync(botConfigPath);
    let config = JSON.parse(rawContent);
    return config.commandEnable;
}

//check if bot is enabled
async function botEnabled() {
    let en = null;
    let rawContent = fs.readFileSync(botConfigPath);
    let config = JSON.parse(rawContent);
    return config.botEnable;
}

//check if bot is enabled
async function debugEnabled() {
    let en = null;
    let rawContent = fs.readFileSync(botConfigPath);
    let config = JSON.parse(rawContent);
    return config.debug;
}

//make sure bot test channel exists
async function createBotTest(bot) {
    
    let guildArr = await bot.guilds.cache.array();

    for (let i = 0; i < guildArr.length; i++) {

        //Define the server, user and title
        let server = guildArr[i];
        let title = botchannelName;

        let exists = await server.channels.cache.some(c => {
            return (c.name.replace("-", " ") || c.name) === botchannelName && c.type == "text";
        });

        if (!exists) {

            //Deal with putting channel in a category
            let catID;
            //if the "Personal Text Channels" already exists get the id
            let tempCategory = server.channels.cache.some(c => {
                if (c.name === "Personal Text Channels" && c.type == "category") {
                    catID = c.id;
                }
                return c.name === "Personal Text Channels" && c.type == "category";
            });
            //if it doesn't exist, create it and get the id
            if (!tempCategory) {
                server.channels.create("Personal Text Channels", { type: 'category' }).then(async c => {
                    catID = c.id;
                });
            }

            //set up default permissions
            let permissions = [
                //clear everyone from the channel
                {
                    id: guildArr[i].id,
                    deny: ['VIEW_CHANNEL'],
                },
                //add the bot
                {
                    id: guildArr[i].member(bot.user).id,
                    allow: minimumPermissions,
                },
                //add the command user
                {
                    id: guildArr[i].ownerID,
                    allow: minimumPermissions,
                }
            ];

            //set the channel options
            let options = {
                type: "type",
                permissionOverwrites: permissions
            }

            //create the channel
            let newChannel = server.channels.create(title, options).then(channel => {
                //put the channel in the category
                channel.setParent(catID);
                channel.send("In this channel everything will be visible if checked. If you want more people to have access, you will need to add them");
            })
                .catch(err => {
                    console.log(err);
                    message.author.send(err.message);
                    return message.delete();
                })
        }
    }
}

//get bottest channel
async function getBotTestID(message){
    let server = message.guild
    //Deal with putting channel in a category
    let catID;
    //if the "Personal Text Channels" already exists get the id
    let tempCategory = await server.channels.cache.some(c => {
        if ((c.name.replace("-", " ")|| c.name) === botchannelName && c.type == "text") {
            catID = c.id;
        }
        return (c.name.replace("-", " ")|| c.name) === botchannelName && c.type == "text";
    });
    return catID;
}

//create bot object
const bot = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
bot.commands = new Discord.Collection();

//on launch
//load all the files in commands folder
fs.readdir("./commands/", (err, files) => {
    if (err) console.error(err);

    //if pollList for saving polls doesn't exist, create it
    if (!files.includes("pollList.json")) {
        let arrayOfObjects = {
            "polls": [],
            "pollCount": -1
        }
        fs.writeFile(pollList, JSON.stringify(arrayOfObjects), 'utf-8', function (err) {
            if (err) throw err
            console.log(`Creating pollList.json`);
        });
    }

    //if reminderList for saving reminders doesn't exist, create it
    if (!files.includes("reminderList.json")) {
        let arrayOfObjects = {
            "reminders": [],
        }
        fs.writeFile(reminderList, JSON.stringify(arrayOfObjects), 'utf-8', function (err) {
            if (err) throw err
            console.log(`Creating ReminderList.json`);
        });
    }

    //filter files that are js files to get the name of all commands
    let jsfiles = files.filter(f => f.split(".").pop() === "js");
    if (jsfiles.length <= 0) {
        console.log("There are no commands do load");
        return;
    }
    console.log("Loading Commands..");
    let numCom = 0;
    //print out available commands
    jsfiles.forEach((f, i) => {
        if (ignoreList.ignore.indexOf(f) == -1) {
            let props = require(`./commands/${f}`);
            console.log(`${numCom + 1}) ${f}`)
            bot.commands.set(props.help.name, props);
            numCom += 1;
        }
    })
    console.log(`Loaded ${numCom} commands.`);
})

//on bot startup
bot.on("ready", () => {
    console.log(`${bot.user.username} is ready!`);
    checkReminders();
    checkPolls();
    createBotTest(bot);
});

//when a message is sent
bot.on("message", async message => {
    let botEn = await botEnabled();
    botEn = botEn || message.content === "!toggleBot";

    if (botEn) {
        //check for bot message and disregard
        if (message.author.bot) return;

        //Check if commands are enabled
        let comEnabled = await commandsEnabled();
        comEnabled = comEnabled || message.content === "!toggleCommands" || message.content === "!toggleBot";

        if (comEnabled && botEn) {

            //Check if message is a command and parse it to the command file(starts with PREFIX)
            let messageArr = message.content.split(" ");
            let command = messageArr[0]; //save first token
            let args = messageArr.slice(1); //remove first token, the rest are args
            if (!command.startsWith(prefix)) return;

            //get command name and if it is valid run it
            let cmd = bot.commands.get(command.slice(prefix.length));
            if (cmd) {
                try{
                cmd.run(bot, message, args);
                }
                catch (e){
                    let id = await getBotTestID(message)
                    bot.channels.fetch(id).then( c =>{
                        c.send(e)
                    })
                    console.log(e);
                }
            }
        }
        else {
            message.channel.send("<@" + message.author.id + ">" + " Commands are disabled.");
        }
    }
});

//when someone adds a reaction
bot.on('messageReactionAdd', async (reaction, user) => {
    let botEn = await botEnabled();

    if (botEn) {
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
        //update the poll
        store.update(reaction, user, "+", bot);
    }
});

//when someone removes a reaction
bot.on('messageReactionRemove', async (reaction, user) => {
    let botEn = await botEnabled();

    if (botEn) {
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
        //update the poll
        store.update(reaction, user, "-", bot);
    }
});

//Log in the bot
if (typeof process.env.CLIENT_TOKEN === 'undefined'){
    console.log("No token found")
}
else{
console.log("Bot is logging in with token")
bot.login(token);
}

