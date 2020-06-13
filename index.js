
const ignoreList = require("./nodemon.json");
require('dotenv').config()
const token = process.env.CLIENT_TOKEN;
const prefix = process.env.PREFIX;
const Discord = require("discord.js");
const fs = require("fs");
const pollList = "./commands/pollList.json";
const reminderList = "./commands/reminderList.json";
const store = require("./commands/pollUtils.js");
const emotes = ["\u0031\u20E3", "\u0032\u20E3", "\u0033\u20E3", "\u0034\u20E3", "\u0035\u20E3", "\u0036\u20E3", "\u0037\u20E3", "\u0038\u20E3", "\u0039\u20E3"];

//create bot object
const bot = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
bot.commands = new Discord.Collection();

//load all the files in commands folder
fs.readdir("./commands/", (err, files) => {
    if (err) console.error(err);
    
    //if pollList for saving polls doesn't exist, create it
    if (!files.includes("pollList.json")){
        let arrayOfObjects = {
            "polls" : [],
            "pollCount": -1
        }
        fs.writeFile(pollList, JSON.stringify(arrayOfObjects), 'utf-8', function (err) {
            if (err) throw err
            console.log(`Creating pollList.json`);
        });
    }

    //if reminderList for saving reminders doesn't exist, create it
    if (!files.includes("reminderList.json")){
        let arrayOfObjects = {
            "reminders" : [],
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
    console.log("Loading..");
    let numCom = 0;
    //print out available commands
    jsfiles.forEach((f, i) => {
        if (ignoreList.ignore.indexOf(f) == -1) {
            let props = require(`./commands/${f}`);
            console.log(`${i + 1}) ${f}`)
            bot.commands.set(props.help.name, props);
            numCom += 1;
        }
    })
    console.log(`Loaded ${numCom} commands.`);
})

//when bot starts
bot.on("ready", () => {
    console.log(`${bot.user.username} is ready!`);
    console.log(`Source directory: ${__dirname}`);
    checkReminders();
});

//when a message is sent
bot.on("message", async message => {
    //check for bot message and disregard
    if (message.author.bot) return;

    //Fun function
    if (message.content === "fd"){
        message.channel.send( "Fuck you Doug");
        message.delete();
    }

    //Check if message is a command and parse it to the command file(starts with PREFIX)
    let messageArr = message.content.split(" ");
    let command = messageArr[0]; //save first token
    let args = messageArr.slice(1); //remove first token, the rest are args
    if (!command.startsWith(prefix)) return;

    //get command name and if it is valid run it
    let cmd = bot.commands.get(command.slice(prefix.length));
    if (cmd) cmd.run(bot, message, args);
});

//when someone adds a reaction
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
    //update the poll
    store.update(reaction, user, "+");
});

//when someone removes a reaction
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
    //update the poll
    store.update(reaction, user, "-");
});

//placeholder
function checkPolls(){
    return;
}

//placeholder
function checkReminders(){
    fs.readFile(reminderList, 'utf-8', function (err, data) {
        if (err) throw err
        let arrayOfObjects = JSON.parse(data)
        
        let reminderNum = -1;
        let badRem = [];
        for (let i = 0; i < arrayOfObjects.reminders.length; i++){
            let now = Date.now();
            if (arrayOfObjects.reminders[i].start + arrayOfObjects.reminders[i].length < now){
                let channel = bot.channels.cache.get(arrayOfObjects.reminders[i].channel);
                channel.send("<@" + arrayOfObjects.reminders[i].author + ">" + " I was offline and didn't remind you: " + arrayOfObjects.reminders[i].reminderMes );
            }
            badRem.push(i);
        }

        for (let step = 0; step<badRem.length; step ++){
            console.log("here")
            arrayOfObjects.reminders.splice(step);
        }
        
        if (badRem.length > 0){
        fs.writeFile(reminderList, JSON.stringify(arrayOfObjects), 'utf-8', function (err) {
            if (err) throw err
            console.log(`Done removing bad reminders!`);
        });
    }
    })
}

//Log in the bot
console.log("token is " + process.env.CLIENT_TOKEN)
bot.login(token);