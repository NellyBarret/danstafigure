module.exports.run = async (bot, message=null) => {
    console.log(`${bot.user.username} is online !`);
    console.log(`Ready to serve on ${bot.guilds.size} servers, for a total of ${bot.users.size} users.`);
    bot.user.setActivity("QUIZZ Figures de styles");
};

module.exports.help = {
    name: "ready"
};