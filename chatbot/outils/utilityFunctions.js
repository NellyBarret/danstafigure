const fetch = require('node-fetch');
const Discord = require('discord.js');


// const simpleGit = require('simple-git')(path.dirname("../"));

const tree = "repository/tree?ref=master"

/**************************** #FONCTIONS UTILES ***************************/

function decode(someDatas) {
    return Buffer.from(someDatas, 'base64').toString('UTF-8');
}

async function getBlobSha(configFile, file) {
    var res;

    // HTML response
    var response = await fetch(configFile.uri+tree, {
        method: 'GET',
        headers: { 'PRIVATE-TOKEN': configFile.access },
    });

    response = await response.text();
    niceContent = JSON.parse(response);

    // on cherche dans la reposne le bon fichier
    niceContent.forEach(element => {
        if(element.name == file) {
            res = element.id;
        }
    });
    
    // puis on le return
    return res;
}


async function formatInfos(message, cleFDS, infoFDS) {
    let botembed = new Discord.RichEmbed()
    .setTitle(cleFDS)
    .setDescription("Infos sur la FDS")
    .setColor("#0000FF")
    .addField("realname", infoFDS.realname)
    .addField("nbquestions", infoFDS.nbquestions)
    .addField("image", infoFDS.image)
    .addField("logo", infoFDS.logo)
    .addField("def", infoFDS.def);

    await message.channel.send(botembed);
}

async function formatQuestions(message, cleFDS, len, tabQuestions) {
    let botembed = new Discord.RichEmbed()
    .setTitle(cleFDS)
    .setDescription("phrases")
    .setColor("#0000FF");

    for(var i=0; i < len; i++ ) {
        botembed.addField("Q"+(i+1)+" : ",tabQuestions[i]);
    }

    await message.channel.send(botembed);
}

/**************************** #endregion ***************************/

// cette fonction modifie le fichier JSON et le PUT
async function modifContent(bot, json, path) {
    

    // var modifiedJSON = JSON.parse(response);

    /////////////////////////////////////
    // PLEINS DE CHOSES A FAIRE ICI !! //
    /////////////////////////////////////
    /*
        il faut aller chercher dans les dossiers : 
            - le nombre de questions
            - si il y a une image
            - si il y a un dossier "def" associe (sinon le creer)
            - ajouter au champ "manque" si il manque des trucs
    */

    var rep = await putContent(bot, modifiedJSON, path);

    return rep;
}



async function createRealName(bot, getResponse, cleFDS, PUT_pathToFDS_BOT, message) {
    // modifContent(bot, getResponse, path);
    const filter = m => { if(m.author.id === message.author.id) return true; return false; };
    await message.channel.send("Quel est son nom véritable ? (avec accents)");
    var msgTmp = await message.channel.awaitMessages(filter, { max: 1, errors: ['time']});
    getResponse[cleFDS]["realname"] = msgTmp.last().content.toLowerCase();
    var tmp = await putContent(bot, getResponse, PUT_pathToFDS_BOT);
    var statusCode = await tmp.status;

    if(statusCode == 200) {
        console.log("CREATED {realname} of the fds [ " + cleFDS + " ] --- at : " + Date());
    } else {
        message.channel.send("Il y a eu un problème avec la création !");
        var fullText = await tmp.text();
        console.log("ERROR CREATING {realname} of the fds [ " + cleFDS + " ] --- at : " + Date());
        console.log(fullText);
    }
}

async function modifRealName(bot, currentMessage, getResponse, cleFDS, infoFDS, PUT_pathToFDS_BOT, message) {
    // modifContent(bot, getResponse, path);
    const filter = m => { if(m.author.id === message.author.id) return true; return false; };
    await message.channel.send("Quel est le vrai nom à donner ?");
    var msgTmp = await message.channel.awaitMessages(filter, { max: 1, errors: ['time']});
    getResponse[cleFDS][currentMessage] = msgTmp.last().content.toLowerCase();
    var tmp = await putContent(bot, getResponse, PUT_pathToFDS_BOT);
    var statusCode = await tmp.status;

    if(statusCode === 200) {
        message.channel.send("Le nom a bien été modifié !");
        await formatInfos(message, cleFDS, infoFDS);
        console.log("MODIFY {realname} of the fds [ " + cleFDS + " ] --- at : " + Date());
    }
    else {
        message.channel.send("Il y a eu un problème avec la modification !");
        var fullText = await tmp.text();
        console.log("ERROR MODIFY {realname} of the fds [ " + cleFDS + " ] --- at : " + Date());
        console.log(fullText);
    }
}

async function modifNbQuestions(bot, currentMessage, getResponse, cleFDS, PUT_pathToFDS_BOT, nbquestions) {
    getResponse[cleFDS][currentMessage] = nbquestions;
    var tmp = await putContent(bot, getResponse, PUT_pathToFDS_BOT);
    var statusCode = await tmp.status;
    if(statusCode === 200) {
        console.log("MODIFY {nbquestions} of the fds [ " + cleFDS + " ] --- at : " + Date());
    }
    else {
        var fullText = await tmp.text()
        console.log("ERROR MODIFY {nbquestions} of the fds [ " + cleFDS + " ] --- at : " + Date());
        console.log(fullText);
    }
}

async function modifQuestions(bot, getInitialResponse, cleFDS, message, pathToFDS_BOT) {
    var newQuestions = [];
    const filter = m => {
        if(m.author.id === message.author.id) {
            return true;
        }
        else return false;
    };

    const filterYesNo = m => {
        if(m.author.id === message.author.id && ((m.content.toLowerCase() === "non") || (m.content.toLowerCase() === "oui"))) {
            return true;
        }
        else return false;
    };
    
    const sha = await getBlobSha(bot.config, bot.config.questionFile);
    if(!sha) { console.log("ERROR : Je n'ai pas été capable de récupérer le path de : "+bot.config.questionFile+" !"); return;}
    const pathToQuestions = bot.config.uri+bot.config.botfile+sha+"?"+bot.config.ref;

    const pathToQuestionsPut = bot.config.uri+bot.config.files+bot.config.questionFile+"?"+bot.config.ref;

    // on va chercher notre fichier de questions
    var getResponse = await getContent(bot, pathToQuestions);
    var repTabQuestions = getResponse[cleFDS];
    var lenTmp = repTabQuestions.length;
    // si il n'y a aucunes questions il faut remplir tout ça !
    if(lenTmp == 0) {
        await message.channel.send("Il y a actuellement 0 questions pour cette fds");
        await message.channel.send("Veuillez envoyer vos questions par ordre de difficulté croissante (moins dur d'abord) et terminer par le message 'fini' ");

        var payload = await message.channel.awaitMessages(filter, { max:1 , time: 600000, errors: ['time']});
        while(payload.last().content.toLowerCase() != "fini") {
            let tmp = await payload.last().content;
            newQuestions.push(tmp);
            await message.channel.send("ok pour celle-ci");
            payload = await message.channel.awaitMessages(filter, { max:1 , time: 600000, errors: ['time']});
        }
        
        getResponse[cleFDS] = newQuestions;

        // code factorisable 
        let tmpResponsePut = await putContent(bot, getResponse, pathToQuestionsPut);
        let statusCode = await tmpResponsePut.status
        if(statusCode === 200) {
            modifNbQuestions(bot, "nbquestions", getInitialResponse, cleFDS, pathToFDS_BOT, newQuestions.length.toString());
            message.channel.send("Les questions ont bien été modifié ! Vous n'avez plus qu'à pull !");
            //await formatInfos(message, cleFDS, infoFDS);
            console.log("MODIFY {questions} of the fds [ " + cleFDS + " ] --- at : " + Date());
        }
        else {
            message.channel.send("Il y a eu un problème avec la modification !");
            var fullText = await tmpResponsePut.text();
            console.log("ERROR MODIFY {questions} of the fds [ " + cleFDS + " ] --- at : " + Date());
            console.log(fullText);
        }
    }
    else {
        newQuestions = repTabQuestions;
        await message.channel.send("Il y a actuellement " + lenTmp + " questions pour cette fds");
        await message.channel.send("Voulez-vous en rajouter ?");
        var payload = await message.channel.awaitMessages(filterYesNo, { max:1 , time: 600000, errors: ['time']});
        let tmp = await payload.last().content;
        // si il repond oui on va pour modifier le tableau
        if(tmp.toLowerCase() === "oui") {
            //while
            await message.channel.send("Envoyez des questions (arrêtez le processus en tapant 'fini')");
            while(payload.last().content != "fini") {
                // on ecoute la question puis on la stocke
                payload = await message.channel.awaitMessages(filter, { max:1 , time: 600000, errors: ['time']});
                var questionToPush = await payload.last().content;
                if(questionToPush === "fini") break;
                if(newQuestions.includes(questionToPush)) {
                    await message.channel.send("Cette question existe déjà ! Une Autre ?");
                    continue;
                }
                await message.channel.send("Ok ! Où la classer ? ( exemple : si vous choisissez 5, elle sera mise en dessous de 5)");
                await message.channel.send("Parmis ces " + lenTmp + " là : ");
                // on envoie toutes les questions en supposant qu'elle sont deja classee par
                // ordre croissant de difficultee
                formatQuestions(message, cleFDS, lenTmp, newQuestions)

                // on vérifie que l'user rentre BIEN un nombre entier
                payload = await message.channel.awaitMessages(filter, { max:1 , time: 600000, errors: ['time']});
                tmp = await payload.last().content.toLowerCase();
                var intTmp = await parseInt(tmp, 10);
                // tant que ce n'est pas un nombre VALIDE on accepte pas !
                while(typeof intTmp != "number" || Math.floor(intTmp) != intTmp || intTmp > repTabQuestions.length+1 || intTmp < 1) {
                    // facto
                    if(tmp === "fini") {
                        console.log("MODIFY ABORTED adding of the fds [ " + cleFDS + " ] --- at : " + Date());
                        message.channel.send("Ok ajout terminé !");
                        return;
                    }
                    await message.channel.send("une vraie réponse stp ....");
                    payload = await message.channel.awaitMessages(filter, { max:1 , time: 600000, errors: ['time']});
                    tmp = payload.last().content.toLowerCase();
                    intTmp = parseInt(tmp, 10);
                }
                // array.splice(index,nbElementsToRemove, newElement)
                newQuestions.splice(intTmp-1,0,questionToPush);
                lenTmp = newQuestions.length;
                message.channel.send("La phrase a été ajoutée ! Une autre ?");
            }

            // on remplace notre ancien tableau par le nouveau
            getResponse[cleFDS] = newQuestions;

            // code factorisable 
            let tmpResponsePut = await putContent(bot, getResponse, pathToQuestionsPut);
            let statusCode = await tmpResponsePut.status
            // handleResponse(statusCode)
            if(statusCode === 200) {
                // on lui envoie la "getInitialResponse" car elle contient toutes les infos de la fds courante dans fds_bot.json
                modifNbQuestions(bot, "nbquestions", getInitialResponse, cleFDS, pathToFDS_BOT, newQuestions.length.toString());
                message.channel.send("Les questions ont bien été modifié ! Vous n'avez plus qu'à pull !");
                //await formatInfos(message, cleFDS, infoFDS);
                console.log("MODIFY {questions} of the fds [ " + cleFDS + " ] --- at : " + Date());
            }
            else {
                message.channel.send("Il y a eu un problème avec la modification !");
                var fullText = await tmpResponsePut.text;
                console.log("ERROR MODIFY { questions } of the fds [ " + cleFDS + " ] --- at : " + Date());
                console.log(fullText);
            }
            
            await message.channel.send("Ok modification terminée !");
        } else {
            console.log("MODIFY ABORTED adding of the fds [ " + cleFDS + " ] --- at : " + Date());
            message.channel.send("Ok modification terminée !");
        }
    }
}

async function getContent(bot, path) {
    // reponse HTML
    var response = await fetch(path, {
        method: 'GET',
        headers: { 'PRIVATE-TOKEN': bot.config.access }
    });

    response = await response.text();
    var niceContent = JSON.parse(response);
    var decoded = decode(niceContent.content);

    // on renvoie un fichier JSON
    return JSON.parse(decoded, null, 4);
};

async function putContent(bot, file, path) {
    const data = {
        "branch": "master",
        "commit_message": "Bot updating file",
        "content": JSON.stringify(file,null,4)
    };

    // var linkToUtilFile = bot.config.uri+files+bot.config.utilfile+"?"+bot.ref

    // reponse === HTML
    var response = await fetch(path, {
        method: 'PUT',
        headers: {
            'PRIVATE-TOKEN': bot.config.access,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    // response = await response.text();
    
    return response;
};

async function postImage(bot, datas, path) {
    // reponse === HTML
    var response = await fetch(path, {
        method: 'POST',
        headers: {
            'PRIVATE-TOKEN': bot.config.access,
            'Content-Type': 'multipart/form-data'
        },
        body: datas
    });
    response = await response.text();
    
    return response;
};

module.exports.help = {
    name: "utility",
    infos: "do **not** use this command"
};

module.exports.getContent = getContent
module.exports.getBlobSha = getBlobSha
module.exports.putContent = putContent
module.exports.postImage = postImage
module.exports.formatInfos = formatInfos
module.exports.modifRealName = modifRealName
module.exports.modifQuestions = modifQuestions
module.exports.createRealName = createRealName
