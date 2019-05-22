const Discord = require("discord.js");

function makeChannel(message, name){
    var server = message.guild;

    server.createChannel(name, "channel");
    
    return name;
}

module.exports.run = async (bot, message, args) => {
    if(args.length != 1) return;

    let currentChan = makeChannel(message, args[0]);

    // TODO: créer un nouveau channel et set currentChan au nom du nouveau channel (c-a-d args[0])

    if(bot.factoryGame.getGame(currentChan)) return;
    bot.factoryGame.addGame(message.author.tag, currentChan.toLowerCase());


    let bicon = bot.user.displayAvatarURL;
    let botembed = new Discord.RichEmbed()
    .setColor("#0000FF")
    .setThumbnail(bicon)
    .addField("Une nouvelle partie a été créé dans le channel " + currentChan.toLowerCase(), "Allez-y pour commencer votre partie.");

    await message.channel.send(botembed);
};


module.exports.help = {
    name: "creerChannel",
    param: "!creerChannel [nom du channel]",
    infos: "Crée un nouveau channel pour y lancer une partie."
};