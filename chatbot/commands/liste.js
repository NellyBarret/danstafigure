const fs      = require("fs");
const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    let botembed = new Discord.RichEmbed()
    .setTitle("Help : Liste des commandes")
    .setColor("#0000FF")

    var files = fs.readdirSync("./commands/")

    for(var f of files) {
        let cmd = require(`./${f}`);
        let cmdName = cmd.help.name;
        let cmdParam =  cmd.help.param;
        let cmdinfos = cmd.help.infos;
        if(cmd && cmdName && cmdParam && cmdinfos) {
            botembed.addField(bot.config.prefix+cmdName, "usage : " + cmdParam + "\n" + cmdinfos); //
        }
    }

    await message.channel.send(botembed);
};


module.exports.help = {
    name: "liste",
    param: "!liste",
    infos: "Montre ce message."
};