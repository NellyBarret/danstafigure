const fs          = require("fs");
const Discord     = require("discord.js");
const mergeImages = require('merge-img');

var goodResponse = null;

/**
 * Just a sleep function.
 * @param {int} ms 
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Renvoie la liste des figures de style disponibles.
 */
function getFdsList() {
    let fdsList = [];
    let fds_bot = require('../../questions.json');

    for(let fds in fds_bot) {
        if(getLogoList().includes(fds)) {
            fdsList.push(fds); // on verifie que le logo existe
        }
    }

    return fdsList;
}

/**
 * Renvoie la liste des logos disponibles.
 */
function getLogoList() {
    let logosList = [];
    fs.readdirSync("../Figures_de_style_logos/").forEach(file => {
        logosList.push(file.split(".").shift());
    });
    
    return logosList;
}

/**
 * Renvoie une figure de style tirée dans la liste de priorité.
 */
function getRandomFds(factory, currentChannel) {
    var fdsList = getPriorityList(factory, currentChannel);
    if(fdsList.length == 0) {
        fdsList = getLogoList();
    }
    
    console.log(fdsList);
    let randomNumber = Math.floor(Math.random() * fdsList.length);
    return fdsList[randomNumber];
}

/**
 * Renvoie le chemin associé à la figure de style.
 * @param {String} fds Le nom de la figure de style.
 */
function getFdsPath(fds) {
    let path = "../Figures_de_style_logos/"+fds+".png";
    return path;
}

/**
 * Enlève un élément du tableau.
 * @param {Array} list Une liste (logos, fds...)
 * @param {String} value La valeur à enlever
 */
function spliceArray(list, value) {
    let indexFds = list.indexOf(value);
    if(indexFds > -1) {
        list.splice(indexFds,1); // on enleve uniquement l'element voulu
    }
    
    return list;
}

/**
 * Renvoie le nom de la figure de style associée au chemin.
 * @param {String} path Le chemin de la figure de style.
 */
function getFdsNameFromPath(path) {
    let dir   = "../Figures_de_style_logos/";
    let index = path.indexOf(dir);
    let name  = null;
    if(index > -1) {
        name = path.substring(index+dir.length, path.length - 4) // on retire le dossier + l'extension
    }
    return name;
}

/**
 * Mélange un tableau aléatoirement.
 * @param {Array} array Le tableau à mélanger.
 * @return {Integer} L'index de la bonen réponse.
 */
function shuffle(array) {
    array.sort(() => Math.random() - 0.5);
}

/**
 * Renvoie les paths des 4 logos (celui de la question + 3 aléatoires)
 * @param {String} fds Le nom de la figure de style posée à l'apprenant.
 * @return {Array<String>} liste des 3 paths des autres images
 */
function getFourPictures(fds) {
    let logosList = getLogoList(); // on cherche dans la liste des logos disponibles (car certaines fds n'ont pas de logos)

    // contiendra les 3 paths des autres images
    let pathes = [];

    // on ajoute le logo de la figure de style posee à l'apprenant
    pathes.push(getFdsPath(fds));

    // on récupère 3 logos aléatoirement
    // on enleve la figure de style choisie pour ne pas avoir la même plusieurs fois
    // permet de chercher dans les autres fds que celle demandée et celle(s) deja choisie(s)
    logosList = spliceArray(logosList, fds);
    let randomNumber = Math.floor(Math.random() * logosList.length); // nombre aleatoire
    let fdsName = logosList[randomNumber]; // figure de style aleatoire
    pathes.push(getFdsPath(fdsName)); // sauvegarde du chemin du logo 

    logosList = spliceArray(logosList, fdsName);
    randomNumber = Math.floor(Math.random() * logosList.length);
    fdsName = logosList[randomNumber];
    pathes.push(getFdsPath(fdsName));
    
    logosList = spliceArray(logosList, fdsName);
    randomNumber = Math.floor(Math.random() * logosList.length);
    fdsName = logosList[randomNumber];
    pathes.push(getFdsPath(fdsName));

    shuffle(pathes);

    // on stocke la bonne réponse dans une variable pour que les joueurs n'aient qu'à répondre un chiffre
    goodResponse = pathes.indexOf(getFdsPath(fds))+1;

    return pathes;
}

function getPriorityList(factory, currentChannel) {
    let priorityList = [];
    
    // ajout de toutes les fds
    let tmpFds = getLogoList();
    for(let fds in tmpFds) {
        priorityList.push(tmpFds[fds]);
    }

    for(let player in factory.getGames()[currentChannel].getPlayers()) {
        let history = factory.getGames()[currentChannel].getPlayers()[player].getHistory();

        // on enleve toutes les fds qui ont un score positif (on garde les fds non traitees et celles qui ont un score négatif)
        for(let entry in history) {
            if(history[entry] > 0) {
                let index = priorityList.indexOf(entry);
                if(index > -1) {
                    priorityList.splice(index, 1);
                }
            }
        }
    }

    return priorityList;
}

module.exports.run = async (bot, message, args) => {
    let currentChannel = message.channel.name;
    let factory = bot.factoryGame;
    
    // si on est bien dans la bonne game et dans le bon channel alors on peut lancer la partie
    // on vérifie après que ce soit bien l'admin de la game qui lance la partie
    if(!factory.isJoinable(currentChannel)) return;
    let currentGame = factory.getGame(currentChannel);
    let author = message.author.tag;
    let botembed = null;

    if (author != currentGame.getAdmin() || currentGame.getNbPlayers() < 1) return;
    
    if (author == currentGame.getAdmin() && currentGame.getNbPlayers() >= 1) {
        bot.factoryGame.runGame(currentChannel);
        botembed = new Discord.RichEmbed()
        .setColor("#0000FF");

        if(bot.nbQuestions == 1) {
            botembed.setDescription("C'est parti pour " + bot.nbQuestions + " question !");
        } else {
            botembed.setDescription("C'est parti pour " + bot.nbQuestions + " questions !");
        }
        
        if(currentGame.getNbPlayers() == 1) {
            botembed.setTitle("Le quiz va démarrer avec "+ currentGame.getNbPlayers() + " joueur !");
        } else {
            botembed.setTitle("Le quiz va démarrer avec "+ currentGame.getNbPlayers() + " joueurs !");
        }

        botembed.addField("Aide", "Pour répondre, écrivez le numéro de la figure de style (1, 2, 3 ou 4).")
    
        await message.channel.send(botembed);
    
    
        let listQuestions = require('../../questions.json');
        let cpt = 0;
    
        console.log(currentGame.getPlayers());

        for(let j = 3; j > 0; j--) {
            await message.channel.send(j);
            await sleep(1000); // timer de 1 seconde
        }
    
        while(cpt < bot.nbQuestions) {
            let randomFds; 
            
            // choix de la figure de style
            do {
                randomFds = getRandomFds(factory, currentChannel);
            } while(listQuestions[randomFds] == undefined);

            let randomNumber = Math.floor(Math.random() * listQuestions[randomFds].length);

            // choix de la question
            let randomQuestion = listQuestions[randomFds][randomNumber];
            console.log(randomFds);
    
            // poser la question
            botembed = new Discord.RichEmbed()
            .setTitle("Question "+ (cpt+1))
            .setColor("#0000FF")
            .setDescription(randomQuestion);
    
            await message.channel.send(botembed);
    
            // proposer les logos
            // récupération des logos
            let logos = getFourPictures(randomFds);
            let files = []; // stocke la liste des chemins des logos (pour l'embed)
            let fields = []; // stocke les fields de l'embed
            // TODO: mélanger les figures
            for(let logo in logos) {
                await files.push(logos[logo]);
                await fields.push({
                    "value": getFdsNameFromPath(logos[logo]),
                    "inline": true
                })
            }

            try {
                let imageName = "currentQuestion"+currentChannel+".png"
                var newImage = await mergeImages(files);
                await newImage.write(imageName, async () => await console.log('Image chargée !'));
                await sleep(2000);
                

                // creation de l'embed
                const tmp = await new Discord.RichEmbed()
                .setColor('0x000FF')
                .attachFile(imageName)
                // .addField("Logos", "Les noms apparaîtrons dans 2 secondes");

                await message.channel.send(tmp);
                var logoName;

                // vu la taille de l'image, il faut 11 caractères pour arriver au bout d'un seul logo
                let str = "```"; // on passe par  du code pour avoir une police formatee
                for(let fds in logos) {
                    logoName = getFdsNameFromPath(logos[fds]);
                    str += logoName;
                    str += "\u200b ";
                    for(let i = logoName.length ; i < 12 ; i++) {
                        str += "\u200b "; // on ajoute les espaces manquants pour aligner
                    }
                }
                str += "```";

                await message.channel.send(str);
            }
            catch (e) {
                const tmp = await new Discord.RichEmbed()
                .setColor('0x000FF')
                .setTitle("Logos");

                tmp.fields = await fields;
                await message.channel.send(tmp);
                console.log("Impossible de charger l'image");
            }

            
            console.log("goodResponse == " + goodResponse);
            
            // filtre pour les réponses de l'apprenant
            // let prefixResponse = '!!!'
            // const filter = m => m.content.startsWith(prefixResponse);
            const filter = m => {
                // m.content.toString() === goodResponse+""-
                return (currentGame.searchPlayer(m.author.tag))
            }

            let responseToTest = "";

            while(true) {
                // on attend la réponse de l'apprenant
                let collected = await message.channel.awaitMessages(filter, { max: 1, errors: ['time'] });
                let lastMessage = await collected.last();
                let response = await lastMessage.content;
                let currentPlayer = await currentGame.getPlayerByTag(lastMessage.author.tag);
        
                // normalisation de la réponse => Bastien et Scapin : adaptabilité / flexibilité
                // let responseToTest = response.slice(prefixResponse.length).normalize('NFD').replace(/[\u0300-\u036f]/g, ""); // on enleve le prefixe et on normalise (accents...)
                
                responseToTest = await response;

                console.log(randomFds + " / " + responseToTest);
                console.log(" currentPlayer == "+currentPlayer.getName());

                // réponse correcte : on ajuste le score du joueur puis on passe a la question suivante
                if(responseToTest == goodResponse) {
                    currentPlayer.addToHistory(randomFds, 1);
                    await currentGame.modifyScore(currentPlayer.getName(),1);
                    botembed = new Discord.RichEmbed()
                    .setTitle("Correct !")
                    .setColor("#15f153")
                    .setDescription("La réponse est correcte ! Bravo à "+lastMessage.author.username);

                    await message.channel.send(botembed);
                    break;
                }

                // réponse erronée : le joueur a un 'malus caché' pour se souvenir de son score global
                await currentPlayer.addToHistory(randomFds, -1);
                await currentGame.modifyScore(currentPlayer.getName(),-1);
            }
    
            cpt++;
        }
        
        for(let currentPlayer of currentGame.getPlayers()) {
            console.log(currentPlayer);
        }
    }

    await sleep(2000);

    botembed = new Discord.RichEmbed()
    .setTitle("Fin !")
    .setColor("0x000FF")
    .setDescription("C'est la fin du quiz : Ce channel se supprimera automatiquement dans 60 secondes, veuillez quitter le channel");

    try {
        var tab = currentGame.getSortedScores();
        var first = true;
        for(let i in tab) {
            let player = tab[i];
            let nom = player[0];
            let score = player[1];
            var pts = "point"
            if(score > 1) pts += "s";
            if(first) {
                botembed.addField(nom+" gagne avec un score de ", ""+score+" "+pts);
                first = false;
            } else {
                botembed.addField(nom+" a ", ""+score+" "+pts);
            }
        }
    } catch(e) {
        console.log("Erreur : \n"+e);
    }
    

    await message.channel.send(botembed);

    await sleep(60000);

    bot.factoryGame.eraseGame(currentChannel, message); // on supprime le channel 60 secondes apres la fin du jeu
};


module.exports.help = {
    name: "commencer",
    param: "!commencer",
    infos: "Lance la partie"
};