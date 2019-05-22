const fs      = require("fs");
const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    let botembed = new Discord.RichEmbed()
    .setTitle("Aide : comment jouer ?")
    .setColor("#0000FF")
    .addField("Première commande", "Pour commencer, vous avez accès aux différentes commandes avec ```!liste```")
    .addField("Lancer une partie", "Pour lancer une nouvelle partie, tapez successivement ```!creerChannel [nom]``` puis rejoignez le channel manuellement et tout les participants qui souhaitent rejoindre la partie doivent taper la commande suivante : ```!rejoindre``` enfin, quand tous les participants ont rejoint la partie tapez : ```!commencer```")
    .addField("Répondre", "Pour répondre il suffit de saisir le numéro correspondant à la bonne figure de style. Le premier joueur qui a la bonne réponse remporte le point")
    .addField("Calcul des points", "Chaque réponse juste vous fait gagner un point, chaque réponse fausse vous en fait perdre un")
    .addField("Fin de la partie", "Quand la partie est terminée le tableau des scores s'affiche. Vous pouvez ensuite quitter le channel il se supprimera automatiquement au bout d'une minute")
    .addField("Cours", "Pour avoir accès à toutes les figures de style disponibles tapez ```!def``` Vous avez accès aux définitions des figures de style via la commande ```!def [nom]```Si vous voulez la définition longue, vous pouvez taper ```!def [nom] longue```Si vous voulez une définition spéciale, vous pouvez taper ```!def [nom] speciale```")
    .addField("Exemples illustrés", "Pour avoir accès aux exemples illustrés, vous pouvez taper ```!image [nom]```");

    await message.channel.send(botembed);
};


module.exports.help = {
    name: "aide",
    param: "!aide",
    infos: "Indique comment utiliser le bot."
};