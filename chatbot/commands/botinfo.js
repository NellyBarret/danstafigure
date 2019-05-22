const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {

    let bicon = bot.user.displayAvatarURL;
    let botembed = new Discord.RichEmbed()
    .setDescription("Bot Information")
    .setColor("#0000FF")
    .setThumbnail(bicon)
    .addField("Bot Name", bot.user.username)
    .addField("Created On", bot.user.createdAt);

    await message.channel.send(botembed);
};


module.exports.help = {
    name: "botinfo",
    param: "!botinfo",
    infos: "Montre les informations du bot."
};