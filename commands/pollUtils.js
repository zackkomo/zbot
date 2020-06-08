const fs = require("fs");
const pollList = "./commands/pollList.json";
const Discord = module.require("discord.js");
const store = require(__dirname + "/pollUtils.js");
const emotes = ["\u0031\u20E3", "\u0032\u20E3", "\u0033\u20E3", "\u0034\u20E3", "\u0035\u20E3", "\u0036\u20E3", "\u0037\u20E3", "\u0038\u20E3", "\u0039\u20E3"];


exports.add = async (pollObj, num, message, op) => {

    let pollObject;
    fs.readFile(pollList, 'utf-8', function (err, data) {
        if (err) throw err

        let arrayOfObjects = JSON.parse(data)


        for (let ind = 0; ind < arrayOfObjects.polls.length; ind++) {
            if (arrayOfObjects.polls[ind] != null) {
                if (arrayOfObjects.polls[ind].poll.title == pollObj.title) {
                    return message.channel.send("There is already a poll with that tittle. To check it, use !pollCheck " + ind + " To remove it, use !pollRemove " + ind);
                }
            }
        }

        let pollNum = arrayOfObjects.polls.indexOf(null);
        if (pollNum == -1) {
            pollNum = arrayOfObjects.polls.length;
            arrayOfObjects.polls.push(null);
        }
        arrayOfObjects.pollCount += 1;

        pollObj.description = "To re-access this poll use the command !pollCheck " + pollNum;
        for (let set = 0; set < pollObj.options.length; set++) {
            pollObj.votes.push([]);
        }

        message.channel.send(pollObj.mes + pollObj.description).then(function (message) {
            for (let step = 0; step < num; step++) {
                message.react(emotes[step]);
            }
            pollObject = {
                "id": message.id,
                "poll": pollObj
            }
            arrayOfObjects.polls[pollNum] = pollObject;
            fs.writeFile(pollList, JSON.stringify(arrayOfObjects), 'utf-8', function (err) {
                if (err) throw err
                console.log(`Done adding poll ${pollNum}!`);

            });
        })
    })

}

exports.remove = async (num, message) => {

    fs.readFile(pollList, 'utf-8', function (err, data) {
        if (err) throw err


        let arrayOfObjects = JSON.parse(data)
        if (arrayOfObjects.polls.length <= num || num < 0) {
            return message.channel.send("There is no poll with that poll number");
        }
        else if (message.channel.id != arrayOfObjects.polls[num].poll.channel) {
            return message.channel.send("There is no poll in this channel with that poll number");
        }
        else {
            let id1 = arrayOfObjects.polls[num].id;
            let id2;
            let id3;
            message.reply(arrayOfObjects.polls[num].poll.mes + arrayOfObjects.polls[num].poll.description + "Are you sure you sure you wish to remove the above poll (Voting on this poll does not count. To check use !pollCheck [number]) ? You have 10 seconds to reply [y/n]")
                .then(message => { id2 = message.id });

            const filter = m => m.author.id === message.author.id;
            message.channel.awaitMessages(filter, { max: 1, time: 30000 }).then(collected => {
                if (collected.first().content === "n") return message.channel.send("Removal aborted.");
                id3 = collected.first().id;
                arrayOfObjects.polls[num] = null;
                arrayOfObjects.pollCount += -1;
                fs.writeFile(pollList, JSON.stringify(arrayOfObjects), 'utf-8', function (err) {
                    if (err) throw err
                    console.log(`Done Removing poll ${num}!`);
                    return message.channel.send(`Done Removing poll ${num}!`);
                })
            }).then(() => {
                message.channel.messages.fetch(id1)
                    .then(message => {
                        message.delete();

                    })
                message.channel.messages.fetch(id2)
                    .then(message => {
                        message.delete();

                    })
                message.channel.messages.fetch(id3)
                    .then(message => {
                        message.delete();

                    })
            })
        }
    })
}

exports.check = async (num, message) => {
    console.log(num)
    fs.readFile(pollList, 'utf-8', function (err, data) {
        if (err) throw err



        let arrayOfObjects = JSON.parse(data)
        if (num == null) {
            let mesCheck = "```Available polls \n# | name \n---------\n";
            for (let i = 0; i < arrayOfObjects.polls.length; i++) {
                if (arrayOfObjects.polls[i] != null) {
                    if (arrayOfObjects.polls[i].poll.channel === message.channel.id || message.channel.id != 557682790271942688) {
                        mesCheck += i + " |" + arrayOfObjects.polls[i].poll.title + "\n";
                    }

                }
            }
            mesCheck += "```";
            return message.channel.send(mesCheck);
        }
        else if ((num != null && arrayOfObjects.polls[num] == null)) {
            return message.channel.send("There is no poll with that poll number");
        }
        else if (message.channel.id != 557682790271942688 && message.channel.id != arrayOfObjects.polls[num].poll.channel) {
            return message.channel.send("There is no poll in this channel with that poll number");
        }
        else {
            let usrMes = message.id;
            let oldMes;
            message.channel.send(arrayOfObjects.polls[num].poll.mes + arrayOfObjects.polls[num].poll.description + " . This will now act as the new poll").then((message) => {
                oldMes = arrayOfObjects.polls[num].id;
                arrayOfObjects.polls[num].id = message.id;
                for (let step = 0; step < arrayOfObjects.polls[num].poll.options.length; step++) {
                    message.react(emotes[step]);
                }

                fs.writeFile(pollList, JSON.stringify(arrayOfObjects), 'utf-8', function (err) {
                    if (err) throw err
                    console.log(`Done updating poll ${num}!`);
                });
                message.channel.messages.fetch(usrMes)
                    .then(message => {
                        message.delete();

                    })
                message.channel.messages.fetch(oldMes)
                    .then(message => {
                        message.delete();
                    })
            });
        }
    })
}

exports.update = async (reaction, user, action) => {

    fs.readFile(pollList, 'utf-8', function (err, data) {
        if (err) throw err

        let arrayOfObjects = JSON.parse(data);

        let pollInd = -1;
        for (let step = 0; step < arrayOfObjects.polls.length; step++) {
            if (arrayOfObjects.polls[step] != null && reaction.message.id === arrayOfObjects.polls[step].id) {
                pollInd = step;
            }
        }

        if (pollInd != -1) {
            if (emotes.indexOf(reaction.emoji.name) != -1) {
                let total = 0;

                for (let i = 0; i < arrayOfObjects.polls[pollInd].poll.votes.length; i++) {
                    let ind = arrayOfObjects.polls[pollInd].poll.votes[i].indexOf(user.username);
                    if (ind != -1 && arrayOfObjects.polls[pollInd].poll.type === 0 && action === "+") {
                        arrayOfObjects.polls[pollInd].poll.votes[i].splice(ind, 1);
                    }
                    if (i === emotes.indexOf(reaction.emoji.name) && action === "+") {
                        if (arrayOfObjects.polls[pollInd].poll.votes[i].indexOf(user.username) == -1) {
                            arrayOfObjects.polls[pollInd].poll.votes[i].push(user.username);
                        }
                    }
                    if (i === emotes.indexOf(reaction.emoji.name) && action === "-") {
                        if (arrayOfObjects.polls[pollInd].poll.votes[i].indexOf(user.username) != -1) {
                            arrayOfObjects.polls[pollInd].poll.votes[i].splice(ind, 1);
                        }
                    }
                    total += arrayOfObjects.polls[pollInd].poll.votes[i].length;
                }

                let votes = [];
                for (let i = 0; i < arrayOfObjects.polls[pollInd].poll.votes.length; i++) {
                    if (total == 0) {
                        votes.push(" ");
                    }
                    else {
                        votes.push("[");
                        let k = 0;
                        while (k < arrayOfObjects.polls[pollInd].poll.votes[i].length / total * 10) {
                            votes[i] += "+";
                            k++;
                        }
                        while (k < 10) {
                            votes[i] += " ";
                            k++;
                        }
                        votes[i] += "] " + Math.trunc(arrayOfObjects.polls[pollInd].poll.votes[i].length / total * 100) + "%";
                    }
                }


                let mes = "```" + "\n" + "Poll by " + arrayOfObjects.polls[pollInd].poll.author + "\n" + arrayOfObjects.polls[pollInd].poll.title + "\n";


                for (let i = 0; i < arrayOfObjects.polls[pollInd].poll.options.length; i++) {
                    mes += arrayOfObjects.polls[pollInd].poll.options[i] + " " + votes[i] + "\n" + "---------" + "\n";
                }
                mes += "```";

                arrayOfObjects.polls[pollInd].poll.mes = mes;

                reaction.message.edit(mes + arrayOfObjects.polls[pollInd].poll.description);

                fs.writeFile(pollList, JSON.stringify(arrayOfObjects), 'utf-8', function (err) {
                    if (err) throw err
                    console.log(`Done updating poll ${pollInd}!`);
                });
            }
            else {
                reaction.remove(user);
            }
        }
    })
}

exports.refresh = async (message) => {

    fs.readFile(pollList, 'utf-8', function (err, data) {
        if (err) throw err


        let arrayOfObjects = JSON.parse(data)
        let ids = [];
        for (let i = 0; i < arrayOfObjects.pollCount + 1; i++) {
            if (message.channel.id === arrayOfObjects.polls[i].poll.channel) {

                ids.push(arrayOfObjects.polls[i].id);
            }
        }
        //ids.forEach((f , i) =>{
        message.channel.messages.fetch(ids[0]).then(message => {
            let x = message.reactions.cache.values();
            console.log();

        })

        //})
    })
}




