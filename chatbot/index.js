const Discord = require("discord.js");
const Enmap   = require("enmap");
const fs      = require("fs");
const path    = require("path");
const DBL     = require("dblapi.js");

const bot     = new Discord.Client();
const config  = require('./config.json');
const FactoryGame = require('./classes/FactoryGame.js');

bot.config    = config;
bot.commands  = new Discord.Collection();
bot.enmap     = new Enmap({name: 'globalHistory'});
bot.factoryGame = new FactoryGame.FactoryGame(bot.enmap);
bot.nbQuestions = 2;
// bot.factoryGame.addGame(); // par defaut on cree un game

fs.readdir("./commands/", (err, files) => {
    if(err) console.log(err);

    let jsfile = files.filter(file => file.split(".").pop() === "js");
    if(jsfile.length <= 0) {
        console.error("Impossible de trouver la commande.");
        return;
    }

    jsfile.forEach((file, i) => {
        let cmd = require(`./commands/${file}`);
        if(cmd.help.name) {
            bot.commands.set(cmd.help.name, cmd);
            console.log(`${file} charge !`);
        }
    });

});

fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err);

    let jsfile = files.filter(file => file.split(".").pop() === "js");
    if(jsfile.length <= 0) {
        console.error("Impossible de trouver l'event.");
        return;
    }

    jsfile.forEach(file => {
        const event = require(`./events/${file}`);
        if(event.help.name) {
            console.log(`${file} charge !`);
            bot.on(event.help.name, (msg) => event.run(bot, msg));
        }
    });
});

bot.login(config.token);
