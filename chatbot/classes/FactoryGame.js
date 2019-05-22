const Game = require('./Game.js')
const fs   = require("fs");

/**
 * Représente le conteneur de parties.
 */
module.exports.FactoryGame = class FactoryGame {
    /**
     * Constructeur par défaut.
     */
    constructor(enmap) {
        this.games = {};
        this.botEnmap = enmap;
    }

    /**
     * Getter des parties.
     * @return {Object} Dictionnaire de parties.
     */
    getGames() {
        return this.games;
    }

    /**
     * Getter d'une game.
     * @return {Game} Partie.
     */
    getGame(channel) {
        return this.games[channel];
    }

    /**
     * Setter des parties.
     * @param {Object} games Le tableau des parties.
     */
    setGames(games) {
        this.games = games;
    }

    /**
     * Ajoute une partie dans la factory.
     * @param {String} channel Le nom du channel
     * @param {String} admin la personne qui a lancé la commande
     */
    addGame(admin, channel) {
        let newGame = new Game.Game();
        newGame.setChannel(channel);
        newGame.setAdmin(admin);
        this.games[channel] = newGame;
    }

    /**
     * Supprime une partie de la factory.
     * @param {String} channel Le nom du channel
     */
    eraseGame(channel, message) {
        try {
            this.games[channel].getPlayers().forEach(player => {
                this.botEnmap.set(player.getName(), player.getHistory());
            });
            
            delete this.games[channel];
            var fetchedChannel = message.guild.channels.find(r => r.name === channel);
            fetchedChannel.delete(); // suppression du channel associé
            fs.unlink("currentQuestion"+channel+".png", function (err) {
                if (err) console.log("Can't delete file!");
                // if no error, file has been deleted successfully
                console.log('File deleted!');
            }); // suppression de l'image du channel
            console.log("Game named '"+channel+ "' has been successfully deleted");
        } catch(e) {
            console.log("ERROR : impossible to access OR modify ENMAP : \n"+e);
        }
    }
    
    /**
     * Lance une partie.
     * @param {String} channel Le nom du channel de la partie.
     */
    runGame(channel) {
        return this.games[channel].startGame();
    }

    /**
     * Renvoie 'true' si la partie est 'joinable' (si elle existe ET si elle n'a pas démarré)
     * @return {boolean} vraie si la partie peut etre joignable par le joueur
     */
    isJoinable(channel) {
        if(this.games[channel] && this.games[channel].joinable()) return true;
        return false;
    }
}