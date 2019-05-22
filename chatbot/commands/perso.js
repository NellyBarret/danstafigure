const Discord = require("discord.js");

function getMoyennePlayer(history) {
    let moyenne = 0;

    for(let fig in history) {
        moyenne += history[fig];
    }

    return moyenne;
}

module.exports.run = async (bot, message, args) => {
    if(args.lengh > 2) return;
    if(args.length === 1) {
        currentPlayerName = args[0];
        let botembed = new Discord.RichEmbed();
        if(!bot.enmap.has(currentPlayerName)) {
            botembed.setTitle(currentPlayerName+" : je n'ai pas d'informations sur cet apprennant !");
            botembed.setColor("#0000FF");
            await message.channel.send(botembed);
            return;
        }   
        botembed.setTitle(currentPlayerName+" : Données personnelles !");
        botembed.setColor("#0000FF");
        
        
        let hisHistoric = bot.enmap.get(currentPlayerName);
        let moyennePlayer = getMoyennePlayer(hisHistoric);

        var rang = Math.trunc(moyennePlayer/10) + 1;
        
        if(rang > 5) {
            rang = 5
        }

        var badge = "badge_"+rang;

        let attachment = new Discord.Attachment("../Badges/"+badge+".png", badge+".png");
        botembed.attachFile(attachment); // attache le logo en thumbnail
        botembed.setThumbnail("attachment://"+badge+".png");

        botembed.addField("Son score est de "+moyennePlayer, "Ce qui correspond à un rang de niveau "+rang+" !");
        await message.channel.send(botembed);
    } else {
        currentPlayerName = message.author.tag;
        let botembed = new Discord.RichEmbed();
        if(!bot.enmap.has(currentPlayerName)) {
            botembed.setTitle(currentPlayerName+" : je n'ai pas encore d'informations sur vous !");
            botembed.addField("N'hésitez pas à rejoindre des parties pour que j'apprenne à connaître votre niveau !", "ou à en créer une avec la commande `!creerChannel [nom du channel]`");
            botembed.setColor("#0000FF");
            await message.channel.send(botembed);
            return;
        }   
        botembed.setTitle(currentPlayerName+" : Données personnelles !");
        botembed.setColor("#0000FF");
        
        
        let hisHistoric = bot.enmap.get(currentPlayerName);
        let moyennePlayer = getMoyennePlayer(hisHistoric);
    
        var rang = Math.trunc(moyennePlayer/10) + 1;
        
        if(rang > 5) {
            rang = 5
        }
    
        var badge = "badge_"+rang;
    
        let attachment = new Discord.Attachment("../Badges/"+badge+".png", badge+".png");
        botembed.attachFile(attachment); // attache le logo en thumbnail
        botembed.setThumbnail("attachment://"+badge+".png");
    
        botembed.addField("Votre score est de "+moyennePlayer, "Ce qui correspond à un rang de niveau "+rang+" !");
        await message.channel.send(botembed);
    }
};


module.exports.help = {
    name: "perso",
    param: "!perso",
    infos: "Consulter ses résultats et son rang."
};