const Discord = require("discord.js");
var { Player } = require('../classes/Player.js')

module.exports.run = async (bot, message, args) => {
    let currentChannel = message.channel.name;
    let currentPlayerName = message.author.tag;
    if(!bot.factoryGame.isJoinable(currentChannel)) return;
    let currentGame = bot.factoryGame.getGame(currentChannel);

    // si le joueur est déjà dans la partie 
    if(currentGame.getPlayerByTag(currentPlayerName)) return;

    let currentPlayer = new Player();
    currentPlayer.setName(currentPlayerName);

    // on récupère les datas du joueur si elles sont dispo
    if(bot.enmap.has(currentPlayerName)) {
        currentPlayer.setHistory(bot.enmap.get(currentPlayerName));
    } else {
        bot.enmap.set(currentPlayerName, {});
    }

    // on utilise le "tag" du user car on sait de source sure qu'il est unique
    currentPlayer.setName(currentPlayerName);
    console.log(currentPlayer.name + " a rejoint la partie dans le channel : "+currentChannel);

    // le joueur rejoint le jeu
    currentGame.join(currentPlayer);

    let botembed = new Discord.RichEmbed()
    .setTitle("A rejoint une partie !")
    .setColor("#0000FF")

    botembed.setDescription(currentPlayer.getName() + " a rejoint la partie.");

    await message.channel.send(botembed);    
};


module.exports.help = {
    name: "rejoindre",
    param: "!rejoindre",
    infos: "Rejoindre une partie."
};