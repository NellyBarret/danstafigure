// const Discord = require("discord.js");
const commands  = require('../outils/utilityFunctions.js');
const fetch = require('node-fetch');
const mine = "workAPIBOT48H/fds_bot/";
const branch = "repository/branches/";

/**
 * Crée une nouvelle figure de style.
 * @param {*} bot 
 * @param {*} message 
 * @param {*} collected 
 * @param {*} getResponse 
 * @param {*} cleFDS 
 * @param {*} PUT_pathToFDS_BOT 
 */
async function creation(bot, message, collected, getResponse, cleFDS, PUT_pathToFDS_BOT) {
    var currentMessage;
    var collected;
    var newQuestions = [];
    var tmp;
    const filterYesNo = m => { if(m.author.id === message.author.id && (m.content.toLowerCase() === "oui" || m.content.toLowerCase() === "non")) { return true; } return false; };
    const filter = m => { if(m.author.id === message.author.id) { return true; } return false; };
    currentMessage = collected.last().content.toLowerCase();

    if(currentMessage === "non" || currentMessage === "stop") {
        await message.channel.send("Création annulée !");
        console.log("CREATION ABORTED of :" + cleFDS + " --- at : " + Date());
        return;
    }

    getResponse[cleFDS] = {
        "realname": "",
        "nbquestions": "0",
        "image": "0",
        "logo": "0",
        "def": "false"
    }
    
    await message.channel.send("Il va me falloir plusieurs informations");

    // realname
    // await commands.createRealName(bot, getResponse, cleFDS, PUT_pathToFDS_BOT, message);
    await message.channel.send("Quel est son nom véritable ? (avec accents)");
    var msgTmp = await message.channel.awaitMessages(filter, { max: 1, errors: ['time']});
    getResponse[cleFDS]["realname"] = msgTmp.last().content.toLowerCase();

    // questions
    const sha = await commands.getBlobSha(bot.config, bot.config.questionFile);
    if(!sha) {
        await message.channel.send("Problème avec le 'sha', contacter les devs");
        console.log("ERROR : Je n'ai pas été capable de récupérer le path de : "+bot.config.questionFile+" !"); 
        return;
    }
    const pathToQuestions = bot.config.uri+bot.config.botfile+sha+"?"+bot.config.ref;

    const pathToQuestionsPut = bot.config.uri+bot.config.files+bot.config.questionFile+"?"+bot.config.ref;

    // on va chercher notre fichier de questions
    var getResponseQuestions = await commands.getContent(bot, pathToQuestions);
    await message.channel.send("Maintenant des questions !");
    await message.channel.send("Veuillez envoyer vos questions par ordre de difficulté croissante (moins dur d'abord) et terminer par le message 'fini' ");

    var payload = await message.channel.awaitMessages(filter, { max:1 , time: 600000, errors: ['time']});
    while(payload.last().content.toLowerCase() != "fini") {
        tmp = await payload.last().content;
        newQuestions.push(tmp);
        await message.channel.send("ok pour celle-ci");
        payload = await message.channel.awaitMessages(filter, { max:1 , time: 600000, errors: ['time']});
    }
    
    getResponseQuestions[cleFDS] = newQuestions;
    getResponse[cleFDS]["nbquestions"] = newQuestions.length+"";

    // code factorisable 
    let tmpResponsePut = await commands.putContent(bot, getResponseQuestions, pathToQuestionsPut);
    let statusCode = await tmpResponsePut.status
    if(statusCode === 200) {
        console.log("MODIFY {questions} of the fds [ " + cleFDS + " ] --- at : " + Date());
    }
    else {
        message.channel.send("Il y a eu un problème avec la modification !");
        var fullText = await tmpResponsePut.text();
        console.log("ERROR MODIFY {questions} of the fds [ " + cleFDS + " ] --- at : " + Date());
        console.log(fullText);
    }

    let fullGetToPut = await commands.putContent(bot, getResponse, PUT_pathToFDS_BOT);
    statusCode = await fullGetToPut.status
    if(statusCode === 200) {
        message.channel.send("Terminé !");
        console.log("CREATED fds [ " + cleFDS + " ] --- at : " + Date());
    }
    else {
        message.channel.send("Il y a eu un problème avec la création de cette fds !");
        var fullText = await tmpResponsePut.text();
        errorPut(cleFDS);
        console.log(fullText);
    }

    // definition courte
    // message.channel.send("Il me faut une définition courte maintenant");


    // image
    // message.channel.send("As-tu une image exemple ?");
    // msgTmp = await message.channel.awaitMessages(filterYesNo, { max: 1, errors: ['time']});
    // tmp = await payload.last().content;

    // logo
    // message.channel.send("As-tu un logo ?");
    // msgTmp = await message.channel.awaitMessages(filterYesNo, { max: 1, errors: ['time']});
    // tmp = await payload.last().content;

    // definition longue
    // message.channel.send("def longue ?");
    // msgTmp = await message.channel.awaitMessages(filterYesNo, { max: 1, errors: ['time']});
    // tmp = await payload.last().content;

    // definition speciale
    // message.channel.send("def speciale ?");
    // msgTmp = await message.channel.awaitMessages(filterYesNo, { max: 1, errors: ['time']});
    // tmp = await payload.last().content;
}

/**
 * Modifie une figure de style.
 * @param {*} bot 
 * @param {*} message 
 * @param {*} collected 
 * @param {*} getResponse 
 * @param {*} cleFDS 
 * @param {*} infoFDS 
 * @param {*} pathToFDS_BOT 
 */
async function modification(bot, message, collected, getResponse, cleFDS, infoFDS, pathToFDS_BOT) {
    var currentMessage;
    const filter = m => {
        if(m.author.id === message.author.id &&
            ((m.content.toLowerCase() === "stop") ||
            (m.content.toLowerCase() === "realname") ||
            (m.content.toLowerCase() === "nbquestions") ||
            (m.content.toLowerCase() === "q") ||
            (m.content.toLowerCase() === "image") ||
            (m.content.toLowerCase() === "logo") ||
            (m.content.toLowerCase() === "def"))) {
            return true;
        }
        return false;
    };
    currentMessage = collected.last().content.toLowerCase();
    if(currentMessage === "non" || currentMessage === "stop") {
        await message.channel.send("Modification annulée !");
        console.log("MODIFY ABORTED of :" + cleFDS + " --- at : " + Date());
        return;
    }
    await commands.formatInfos(message, cleFDS, infoFDS);
    await message.channel.send("Quels champs voulez-vous modifier ?");
    var champModif = await message.channel.awaitMessages(filter, { max: 1, errors: ['time']});
    currentMessage = champModif.last().content.toLowerCase();
    switch (currentMessage) {
        case "realname":
            await commands.modifRealName(bot, currentMessage, getResponse, cleFDS, infoFDS, pathToFDS_BOT, message);
            break;
        case "nbquestions":
            await commands.modifQuestions(bot, getResponse, cleFDS, message, pathToFDS_BOT);
            break;
        case "q":
            await commands.modifQuestions(bot, getResponse, cleFDS, message, pathToFDS_BOT);
            break;
        case "image":
            // await commands.modifImage(bot, currentMessage, getResponse, cleFDS, infoFDS, pathToFDS_BOT, message);
            break;
        case "logo":
            // await commands.modifLogo(bot, currentMessage, getResponse, cleFDS, infoFDS, pathToFDS_BOT, message);
            break;
        case "def":
            // await commands.modifDef(bot, currentMessage, getResponse, cleFDS, infoFDS, pathToFDS_BOT, message);
            break;
        case "stop":
            await message.channel.send("Reçu ! Modification terminée !");
            console.log("MODIFY ABORTED adding of the fds [ " + cleFDS + " ] --- at : " + Date());
            break;
        default:
            console.log("****************************************************************************************");
            console.log("FATAL ERROR IN async function modification(bot, collected, getResponse, cleFDS, infoFDS)");
            console.log("****************************************************************************************");
            break;
    }
}

module.exports.run = async (bot, message, args) => {
    // si il n'y a pas exactement UN argument on n'écoute pas
    if(args.length != 1) return;
    
    // on va d'abord chercher le SHA de mon fichier
    const fdsName = args[0];
    const sha = await commands.getBlobSha(bot.config, bot.config.utilfile);
    if(!sha) { console.log("ERROR : Je n'ai pas été capable de récupérer le path de : "+bot.config.questionFile+" !"); return;}

    // avec le "sha" c'est comme ca qu'on peut aller chercher le bon fichier en question
    const pathToFDS_BOT = bot.config.uri+bot.config.botfile+sha+"?"+bot.config.ref;
    const PUT_pathToFDS_BOT = bot.config.uri+bot.config.files+bot.config.utilfile+"?"+bot.config.ref;

    // filtre indispensable pour attendre un message de la part d'un utilisateur
    const filter = m => {
        //  si c'est bien la meme personne qu'au départ qui me répond "oui" ou "non" je réponds
        if(m.author.id === message.author.id && ((m.content.toLowerCase() === "non") || (m.content.toLowerCase() === "oui") || (m.content.toLowerCase() === "stop") )) {
            return true;
        }
        else return false;
    };

    // je vais chercher le contenu de mon fichier
    var getResponse = await commands.getContent(bot, pathToFDS_BOT);
    if(getResponse) {
        var infoFDS = getResponse[fdsName];
        if(!infoFDS) {
            await message.channel.send("Cette fds : "+fdsName+" n'existe pas, l'ajouter ? [oui/non]");
            var collected = await message.channel.awaitMessages(filter, { max: 1, errors: ['time']});
            await creation(bot, message, collected, getResponse, fdsName, PUT_pathToFDS_BOT);
        }
        else {
            await message.channel.send("Cette fds existe ! Voulez-vous la modifier ?");
            var collected = await message.channel.awaitMessages(filter, { max: 1, errors: ['time']});
            await modification(bot, message, collected, getResponse, fdsName, infoFDS, PUT_pathToFDS_BOT);
        }
    }
    else {
        await message.channel.send("Il y a eu une erreur lors du chargement du fichier suivant : "+bot.config.utilfile);
        console.log("Error : impossible de GET à cette adresse : "+pathToFDS_BOT);
    }
    
    message.channel.send("Ajout terminé !");
    return;

    // Le bot pose la question pour savoir si on souhaite vraiment
    // enregistrer cette figure de style !

    await message.channel.awaitMessages(filter, { max: 2, errors: ['time']})
    .then( async collected => {
        let currentMessage = collected.last().content.toLowerCase();
        if(currentMessage === "non") {
            message.channel.send("Ok je stop");
            return;
        } else {
            datas.nom = fdsName;
            // on l'add dans GIT !
            // var response = await commands.getid(bot);
            // ma reponse contient un JSON avec des infos sur notre projet
            // var response = await fetch(bot.config.uri, {
            //                     method: 'GET',
            //                     headers: { 'PRIVATE-TOKEN': bot.config.access },
            //                 })
            //                 .then( res => res.json());
            var response = await fetch(bot.config.uri+branch, {
                                    method: 'GET',
                                    headers: { 'PRIVATE-TOKEN': bot.config.access },
                                })
                                .then( res => res.json());
            console.log(response);
        }
    })
    .catch(collected => console.log("ERROR : " + collected));

    // await message.channel.awaitMessages(filter, { max: 2, errors: ['time']})
    // .then( collected => {
    //     // some stuff
    // })
    // .catch(collected => console.log("ERROR : " + collected));

    // await message.channel.awaitMessages(filter, { max: 2, errors: ['time']})
    // .then( collected => {
    //     // some stuff
    // })
    // .catch(collected => console.log("ERROR : " + collected));

    message.channel.send("fini d'add la figure de style !");
}

module.exports.help = {
    name: "ajouter",
    param: "ajouter [nom de la figure de style]",
    infos: "API qui aide à ajouter des figures de styles à la liste de questions."
};