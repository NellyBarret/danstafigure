const fs      = require("fs");
const Discord     = require("discord.js");

module.exports.run = async (bot, message, args) => {
    if(args.length > 2) return;

    let embed = new Discord.RichEmbed();
    embed.setColor("#0000FF");

    if(args.length == 0) {
        // pas de parametres donc on affiche la liste des definitions disponibles
        let listFds = require('../../fds_bot.json');
        let stringLst = "";
        for(let fds in listFds) {
            stringLst += fds + " / ";
        }

        embed.addField("Liste des figures de style", stringLst);
        await message.channel.send(embed);
    } else if(args.length == 1) {
        let listDef = require('../../definitions.json');
        let def;
        if(listDef[args[0]] != undefined) {
            def = listDef[args[0]]["courte"];
        } else {
            def = undefined;
        }

        if(def == undefined) {
            embed.addField("définition", "pas de définition courte");
        } else {
            //TODO: verifier que le logo existe
            //TODO: image
            let attachment = new Discord.Attachment("../Figures_de_style_logos/"+args[0]+".png", args[0]+".png");
            embed.addField("définition", def);
            embed.attachFile(attachment); // attache le logo en thumbnail
            embed.setThumbnail("attachment://"+args[0]+".png");
        }
        await message.channel.send(embed);
    } else if(args.length == 2) {
        let listDef = require('../../definitions.json');
        if(args[1] != "longue" && args[1] != "speciale") { console.log("return"); return }
        else {
            if(listDef[args[0]][args[1]] != undefined) { // args[1] = longue ou speciale
                embed.addField("Définition " + args[1], listDef[args[0]][args[1]]);
            } else {
                embed.addField("Définition "+args[1], "cette figure de style n'a pas de définition "+args[1]);
            }
            await message.channel.send(embed);
        }
    } 
};

module.exports.help = {
    name: "def",
    param: "!def [nom de la figure de style] {longue/speciale}",
    infos: "Avoir la définition d'une figure de style."
};