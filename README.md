# zBot

Just a bot with ever expanding features.

## Installation

To run/test the bot you will need to do the following:

Go to the [node js 12.x or newer](https://nodejs.org/en/docs/) website to download the node.js installer and run it.
Use a package manager to install the following: [Discord js](https://discord.js.org/#/), [nodemon](https://www.npmjs.com/package/nodemon) and [dotenv](https://www.npmjs.com/package/dotenv).

In the local directory of your project run
```bash
git clone #repository https#
npm install discord.js --save
npm install --save-dev nodemon
npm install dotenv --save
```

Now you have what you need to run the bot. You will need to create an environment file for the bot to read the token and prefix. To do this, go to your top directory, in zBot, and create a new file called ".env" . Use a text editor to add the following lines:
```bash
CLIENT_TOKEN=#BOT TOKEN GOES HERE#
PREFIX=! #USE THIS TO CHANGE THE PREFIX FOR THE BOT COMMANDS#
```

## Usage
In the local directory of your project run
```bash
npm start
```
This will automatically run nodemon so each time you save a local change, it will restart.

If you add files in the commands folder that are commands, simply just name it "commandname".js and it will automatically be loaded and dealt with, no other action is required.
If you add a file for storage (for example to store poll data etc) make sure to add this to the nodemon.json under "ignore." It will mean when changes are made in that file the bot will not restart, as well as when the commands are loaded these .json files will be ignored

## Contributing
Pull requests are welcome. For minor changes, work on master. For major changes create a new branch.
