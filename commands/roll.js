const Discord = module.require("discord.js")
const botConfigPath = "./config.json";
const store = require(__dirname + "/pollUtils.js");
const fs = require("fs");

module.exports.run = async (bot, message, args) => {

    //make sure if there are special characters to make them part of the string
    let messageArr = (message.content.replace("\n","\\n").replace("\r","\\r")).split(" ");
    //remove first token, the rest are args
    messageArr = messageArr.slice(1);

    if (messageArr.length != 2) return message.channel.send("Too many or too few arguements");
    
    if (isNaN(messageArr[0]) || isNaN(messageArr[1])){
        return message.channel.send("Please provide numbers");
    }

    let num1 = messageArr[0];
    let num2 = messageArr[1];
    let rn = 0;
    let rng = Math.random();

    if (num1 > num2){
        rn = +Math.floor(rng * (num1 - num2 + 1)) + +num2;
        
    }
    else{
        rn = +Math.floor(rng * (num2 - num1 + 1)) + +num1;
    }
    message.channel.send("You rolled a " + rn);
    
   
}

module.exports.help = {
    name: "roll",
    description: "Returns a random number between two provided numbers."
    + "  The numbers do not have to be in increasing order."
    + "\nUse: !roll [num1] [num2]"
}