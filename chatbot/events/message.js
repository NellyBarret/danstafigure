module.exports.run = async (bot, message) => {
    if(message.author.bot) return;              // si c'est le bot lui meme on ne gere pas le message
    if(message.channel.type === "dm") return;   // si c'est un DM (DIRECT MESSAGE) on ne gere pas non plus

    let greetings = ["salut", "bonjour", "hello", "saloute", "bonsoir", "bonjoir"];
    let greet = false;

    let msgArray = message.content.split(" ");
    let prefix = bot.config.prefix;
    let cmd = msgArray[0];
    let args = msgArray.slice(1);
    let greetWord = "";

    let commandFile;
    if(cmd.slice(prefix.length).toLowerCase() == "nbquestions") {
        commandFile = bot.commands.get("nbQuestions");
    } else if(cmd.slice(prefix.length).toLowerCase() == "creerchannel") {
        commandFile = bot.commands.get("creerChannel");
    } else {
        commandFile = bot.commands.get(cmd.slice(prefix.length));
    }
    if(commandFile && prefix === bot.config.prefix) { // si ce n'est pas le bon préfixe on ne considère pas le message
        await commandFile.run(bot, message, args);
        return;
    }

    msgArray.forEach(element => {
        for (var i of greetings) {
            if(element.toLowerCase() == i) {
                greet = true;
                greetWord = element;
                break;
            }
        }
    });

    if(message.isMentioned(bot.user) && greet) {
        return message.channel.send(`${greetWord} ${message.author.username} !`);
    }
};

module.exports.help = {
    name: "message"
};