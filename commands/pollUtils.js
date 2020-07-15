const fs = require("fs");
const pollList = "./commands/pollList.json";
const Discord = module.require("discord.js");
const store = require(__dirname + "/pollUtils.js");
const emotes = ["\u0031\u20E3", "\u0032\u20E3", "\u0033\u20E3", "\u0034\u20E3", "\u0035\u20E3", "\u0036\u20E3", "\u0037\u20E3", "\u0038\u20E3", "\u0039\u20E3"];
const botchannelName = "bot test";

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

    fs.readFile(pollList, 'utf-8', function (err, data) {
        if (err) throw err



        let arrayOfObjects = JSON.parse(data)
        //case where all poll titles are printed for that channel
        if (num == null) {
            let mesCheck = "```Available polls \n# | name \n---------\n";
            for (let i = 0; i < arrayOfObjects.polls.length; i++) {
                if (arrayOfObjects.polls[i] != null) {
                    if (arrayOfObjects.polls[i].poll.channel === message.channel.id || (message.channel.name.replace("-", " ") || message.channel.name) == botchannelName) {
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

exports.update = async (reaction, user, action, bot) => {

    fs.readFile(pollList, 'utf-8', async function (err, data) {
        if (err) throw err

        let arrayOfObjects = JSON.parse(data);

        //check if the message is a poll and get its index
        let pollInd = -1;
        for (let step = 0; step < arrayOfObjects.polls.length; step++) {
            if (arrayOfObjects.polls[step] != null && reaction.message.id === arrayOfObjects.polls[step].id) {
                pollInd = step;
            }
        }

        if (pollInd != -1) {
            //make sure it is not an invalid reaction
            if (emotes.indexOf(reaction.emoji.name) != -1) {
                let total = 0;

                //go through all reactions
                for (let i = 0; i < arrayOfObjects.polls[pollInd].poll.votes.length; i++) {
                    //find the index of the user in that reaction
                    let ind = arrayOfObjects.polls[pollInd].poll.votes[i].indexOf(user.username);
                    //if it is a single vote poll and a person added a reaction remove their vote
                    if (ind != -1 && arrayOfObjects.polls[pollInd].poll.type === 0 && action === "+") {
                        arrayOfObjects.polls[pollInd].poll.votes[i].splice(ind, 1);
                        if (reaction.message.reactions.cache.get(emotes[i]).users.cache.has(user.id)) {
                            reaction.message.reactions.cache.get(emotes[i]).users.remove(user.id);
                        }
                    }
                    //if a user votes for i and his name is not there, add him
                    if (i === emotes.indexOf(reaction.emoji.name) && action === "+") {
                        if (arrayOfObjects.polls[pollInd].poll.votes[i].indexOf(user.username) == -1) {
                            arrayOfObjects.polls[pollInd].poll.votes[i].push(user.username);
                        }
                    }
                    //if a vote is removed, remove the vote
                    if (i === emotes.indexOf(reaction.emoji.name) && action === "-") {
                        if (arrayOfObjects.polls[pollInd].poll.votes[i].indexOf(user.username) != -1) {
                            arrayOfObjects.polls[pollInd].poll.votes[i].splice(ind, 1);
                        }
                    }
                    total += arrayOfObjects.polls[pollInd].poll.votes[i].length;
                }
                fs.writeFile(pollList, JSON.stringify(arrayOfObjects), 'utf-8', function (err) {
                    if (err) throw err
                    console.log(`Done updating poll ${pollInd}!`);
                    updatePollMessage(pollInd, reaction.message, bot);
                });
            }
            else {
                reaction.remove(user);
            }
        }
    })
}

exports.refresh = async (bot) => {

    fs.readFile(pollList, 'utf-8', async function (err, data) {
        if (err) throw err

        let arrayOfObjects = JSON.parse(data)

        await getUsers(arrayOfObjects, bot).then(async (arrayChanges) => {
  
            await fs.writeFile(pollList, JSON.stringify(arrayOfObjects), 'utf-8', async function (err) {
                if (err) throw err
                console.log(`Done refreshing polls!`);

                for (let step = 0; step < arrayChanges.length; step++) {
                    updatePollMessage(arrayChanges[step], null, bot);
                }
            });
        })
    })
}

async function getUsers(arrayOfObjects, bot) {

    let arrayChanges = [];
    //for every poll
    for (i = 0; i < arrayOfObjects.polls.length; i++) {
        let changedVotes_Users = []
        let additionsSingle = [];
        let additionsMultiple = [];
        let removedMultiple = [];
        if (arrayOfObjects.polls[i] != null) {

            await bot.channels.fetch(arrayOfObjects.polls[i].poll.channel).then(async channel => {

                await channel.messages.fetch(arrayOfObjects.polls[i].id).then(async message => {

                    //For every emoji reaction of a poll
                    for (let step = 0; step < message.reactions.cache.size; step++) {

                        let ids = [];

                        await message.reactions.cache.get(emotes[step]).users.fetch().then(async users => {

                            await users.array().forEach(async users => {
                                if (users.username != bot.user.username) {
                                    ids.push(users.username)
                                }

                            })
                            if (arrayOfObjects.polls[i].poll.votes[step] != ids) {
                                if (arrayChanges.indexOf(i) < 0) {
                                    arrayChanges.push(i);
                                }

                                //for single vote poll
                                //stuff found during refresh not in poll data
                                let newVotes = await ids.filter(x => !arrayOfObjects.polls[i].poll.votes[step].includes(x));

                                //array for each reaction new votes. If change has already been noted for a user, disregard it and keep the first one
                                let tempnewVotes = await newVotes.filter((el) => changedVotes_Users.indexOf(el) < 0);
                                additionsSingle.push(tempnewVotes)

                                //no duplicate array of users who changed their vote
                                changedVotes_Users = changedVotes_Users.concat(tempnewVotes);

                                //for multiple vote poll
                                //use single poll for additions
                                additionsMultiple.push(newVotes);
                                //find removals
                                let removedVotes = await arrayOfObjects.polls[i].poll.votes[step].filter(x => !ids.includes(x));
                                removedMultiple.push(removedVotes);
                            }
                        })

                    }
                    //Remove invalid reactions sync for single vote
                    if (arrayOfObjects.polls[i].poll.type == 0) {
                        //for every vote
                        for (let c = 0; c < arrayOfObjects.polls[i].poll.votes.length; c++) {
                            //compare with each name of the changed users
                            await changedVotes_Users.forEach(async userName => {
                                let user = await bot.users.cache.find(user => user.username === userName)
                                let userID = user.id;
                                if (message.reactions.cache.get(emotes[c]).users.cache.has(userID) && userID != message.guild.member(bot.user).id && !additionsSingle[c].includes(userName)) {
                                    message.reactions.cache.get(emotes[c]).users.remove(userID);
                                }
                            })
                        }
                    }
                })

            })

            //handle single vs multiple poll
            if (arrayOfObjects.polls[i].poll.type === 0) {
                //for single vote
                //purge/remove voted of people who changed. Then push all different votes found for this reaction
                for (let step = 0; step < additionsSingle.length; step++) {
                    arrayOfObjects.polls[i].poll.votes[step] = await arrayOfObjects.polls[i].poll.votes[step].filter((el) => !changedVotes_Users.includes(el));
                    arrayOfObjects.polls[i].poll.votes[step] = arrayOfObjects.polls[i].poll.votes[step].concat(additionsSingle[step]);
                }

            }
            else {
                for (let step = 0; step < additionsMultiple.length; step++) {
                    // console.log(arrayOfObjects.polls[i].poll.votes[step]);
                    // console.log(arrayOfObjects.polls[i].poll.votes[step]);
                    arrayOfObjects.polls[i].poll.votes[step] = await arrayOfObjects.polls[i].poll.votes[step].filter((el) => !removedMultiple[step].includes(el));
                    arrayOfObjects.polls[i].poll.votes[step] = arrayOfObjects.polls[i].poll.votes[step].concat(additionsMultiple[step]);
                }
            }
        }
    }
    return arrayChanges;
}

async function updatePollMessage(pollInd, message, bot) {
    fs.readFile(pollList, 'utf-8', async function (err, data) {
        if (err) throw err


        let arrayOfObjects = JSON.parse(data);


        if (message == null) {
            await bot.channels.fetch(arrayOfObjects.polls[pollInd].poll.channel).then(async channel => {

                await channel.messages.fetch(arrayOfObjects.polls[pollInd].id).then(async messageObj => {
                    message = messageObj
                })
            })

        }
        //array to hold percentage message
        let votes = [];
        let total = 0;
        let newPeople = [];
        for (let c = 0; c < arrayOfObjects.polls[pollInd].poll.votes.length; c++) {
            total += arrayOfObjects.polls[pollInd].poll.votes[c].length;
            for (let v=0; v<arrayOfObjects.polls[pollInd].poll.votes[c].length;v++){
                if (!newPeople.includes(arrayOfObjects.polls[pollInd].poll.votes[c][v])){
                    newPeople.push(arrayOfObjects.polls[pollInd].poll.votes[c][v]);
                }
            }
        }
        for (let i = 0; i < arrayOfObjects.polls[pollInd].poll.votes.length; i++) {
            //leave blank if no votes
            if (total == 0) {
                votes.push(" ");
            }
            else {
                //format so the number of + reflect the percentage
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
        //
        let noVotePeople = message.channel.members.size - newPeople.length - 1;
        
        //recreate whole message
        let mes = "```" + "\n" + "Poll by " + arrayOfObjects.polls[pollInd].poll.author + "\n" + arrayOfObjects.polls[pollInd].poll.title + ' ( ' + noVotePeople + " people haven't voted yet )"  + "\n";
        for (let i = 0; i < arrayOfObjects.polls[pollInd].poll.options.length; i++) {
            mes += arrayOfObjects.polls[pollInd].poll.options[i] + " " + votes[i] + "\n" + "---------" + "\n";
        }
        mes += "```";


        //save message in arrayofobjects
        arrayOfObjects.polls[pollInd].poll.mes = mes;

        message.edit(mes + arrayOfObjects.polls[pollInd].poll.description);

        fs.writeFile(pollList, JSON.stringify(arrayOfObjects), 'utf-8', function (err) {
            if (err) throw err
            console.log(`Updated Poll ${pollInd} in channel`);
        });
    })
}