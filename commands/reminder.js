const Discord = module.require("discord.js");
const reminderList = "./commands/reminderList.json";
const fs = require("fs");


module.exports.run = async (bot, message, args) => {

    let messageArr = (message.content.replace("\n", "\\n").replace("\r", "\\r")).split("\"");
    if (messageArr.length != 3) return message.channel.send('The syntax should be !Reminder [time function] "[Reminder text]. For more help use !help reminder"');
    messageArr = messageArr.filter(x => !(x === " " | x === ""));

    let reminder = messageArr[messageArr.length - 1];

    let time = messageArr[0].split(" ");
    time = time.filter(x => !(x === " " | x === ""));
    if (messageArr.length != 2) return message.channel.send('The syntax should be !Reminder [time function] "[Reminder text]. For more help use !help reminder"');
    time = time[1];


    fs.readFile(reminderList, 'utf-8', function (err, data) {
        if (err) throw err
        let arrayOfObjects = JSON.parse(data)

        let reminderNum = arrayOfObjects.reminders.indexOf(null);
        if (reminderNum == -1) {
            reminderNum = arrayOfObjects.reminders.length;
            arrayOfObjects.reminders.push(null);
        }

     
    function reminderFunc() {
        message.reply("\n**REMINDER:**\n" + reminder);
        fs.readFile(reminderList, 'utf-8', function (err, data) {
            if (err) throw err
            let arrayOfObjects = JSON.parse(data)
            arrayOfObjects.reminders.splice(reminderNum);
            fs.writeFile(reminderList, JSON.stringify(arrayOfObjects), 'utf-8', function (err) {
                if (err) throw err
                console.log(`Done removing reminder ${reminderNum}!`);
            });
        })
    }

    let start = Date.now();
    let msDelay;
    switch (time.slice(-1)) {
        case 's': {
            msDelay = time.slice(0, -1) * 1000;
            message.channel.send("Your reminder has been set. I will remind you in " + time.slice(0, -1) + " seconds.");
            setTimeout(reminderFunc, msDelay);
            break;
        }
        case 'm': {
            msDelay = time.slice(0, -1) * 60000;
            message.channel.send("Your reminder has been set. I will remind you in " + time.slice(0, -1) + " minutes.");
            setTimeout(reminderFunc, msDelay);
            break;
        }
        case 'h': {
            msDelay = time.slice(0, -1) * 3600000;
            message.channel.send("Your reminder has been set. I will remind you in " + time.slice(0, -1) + " hours.");
            setTimeout(reminderFunc, msDelay);
            break;
        }
        case 'd': {
            msDelay = time.slice(0, -1) * 86400000;
            message.channel.send("Your reminder has been set. I will remind you in " + time.slice(0, -1) + " days.");
            setTimeout(reminderFunc, msDelay);
            break;
        }
        default: {
            message.channel.send('The syntax should be !Reminder [time function] "[Reminder text]. For more help use !help reminder"');
        }
    }

    
    

        arrayOfObjects.reminders[reminderNum] = {
            "channel": message.channel.id,
            "author": message.author.id,
            "reminderMes": reminder,
            "start": start,
            "length": msDelay
        }
        fs.writeFile(reminderList, JSON.stringify(arrayOfObjects), 'utf-8', function (err) {
            if (err) throw err
            console.log(`Done adding reminder ${reminderNum}!`);
        });
    })

    


}



module.exports.help = {
    name: "reminder",
    description: 'Description: Sets a reminder that messages you in the channel you initated the command. The syntax for the time is [number][identifier]. For example, if you want 2 minutes => 2m, for 5 hours => 5h. The 4 modes are s,m,h,d for seconds, minutes, hours, days.\nUse: !reminder [number][identifier] "title" i.e. !reminder 2s "test"'
}