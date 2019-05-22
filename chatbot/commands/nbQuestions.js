const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    if(args.length != 1) return;
    if(args[0] < 1 || args[0] > 20) return;

    bot.nbQuestions = args[0];
    console.log(bot.nbQuestions);
    let botembed = new Discord.RichEmbed()
    .setTitle("Nombre de questions modifié")
    .setColor("#0000FF");

    if(bot.nbQuestions == 1) {
        botembed.addField("Désormais le bot posera " + args[0] + " question.", "\u200b");
    } else {
        botembed.addField("Désormais le bot posera " + args[0] + " questions.", "\u200b");
    }

    await message.channel.send(botembed);
};


module.exports.help = {
    name: "nbQuestions",
    param: "!nbQuestions [chiffre entre 1 et 20]",
    infos: "Modifie le nombre de questions posées par le bot (par défaut 3)."
};