const fs          = require("fs");
const Discord     = require("discord.js");

module.exports.run = async (bot, message, args) => {
    if(args.length > 1) return;

    let exemplesList = [];
    fs.readdirSync("../Figures_de_style_images/").forEach(file => {
        exemplesList.push(file.split(".").shift());
    });

    let embed = new Discord.RichEmbed();
    embed.setColor("#0000FF");
    if(exemplesList.includes(args[0])) {
        let attachment = new Discord.Attachment("../Figures_de_style_images/"+args[0]+".png", args[0]+".png");
        embed.addField("Exemple", args[0]);
        embed.attachFile(attachment); // attache l'exemple en thumbnail
        embed.setImage("attachment://"+args[0]+".png");
    } else {
        embed.addField("Exemple", "Il n'y a pas d'exemple pour cette figure de style.");
    }

    await message.channel.send(embed);
};

module.exports.help = {
    name: "image",
    param: "!image [nom de la figure de style]",
    infos: "Avoir un exemple illustré d'une figure de style."
};