/**
 * Représente une partie.
 */
module.exports.Game = class Game {
    /**
     * Constructeur par défaut.
     */
    constructor() {
        this.channel = "";
        this.nbPlayers = 0;
        this.admin = "";
        this.scores = {};
        this.players = []; // new Player()
        this.started = false;
    }

    /**
     * Getter du njom du channel de la partie.
     * @return Le nom du channel de la partie.
     */
    getChannel() {
        return this.channel;
    }

    /**
     * Setter du nom channel de la partie.
     * @param {String} channel Le nom du channel de la partie.
     */
    setChannel(channel) {
        this.channel = channel;
    }

    /**
     * Getter du nombre de joueurs de la partie.
     * @return Le nombre de joueurs de la partie.
     */
    getNbPlayers() {
        return this.nbPlayers;
    }

    /**
     * Setter du nombre de joueurs de la partie.
     * @param {Integer} nbPlayers Le nombre de joueurs de la partie.
     */
    setNbPlayers(nbPlayers) {
        this.nbPlayers = nbPlayers;
    }

    /**
     * Getter de l'administrateur de la partie.
     * @return L'administrateur de la partie.
     */
    getAdmin() {
        return this.admin;
    }

    /**
     * Setter de l'administrateur de la partie.
     * @param {String} admin tag de L'administrateur de la partie.
     */
    setAdmin(admin) {
        this.admin = admin;
    }

    /**
     * Getter des scores de la partie.
     * @return Les scores de la partie.
     */
    getScores() {
        return this.scores;
    }

    /**
     * Setter des scores de la partie.
     * @param {Array} scores Les scores de la partie.
     */
    setScores(scores) {
        this.scores = scores;
    }


    /**
     * Change le score d'un joueur.
     * @param {String} name pseudo du joueur.
     * @param {int} amount prix de la question (peut etre négatif ou positif).
     */
    modifyScore(name, amount) {
        this.scores[name] += amount;
    }

    getSortedScores() {
        var sortable = [];
        for (let player in this.scores) {
            sortable.push([player, this.scores[player]]);
        }
        if(this.nbPlayers == 1) return sortable;
        let sortedPlayerScores = sortable.sort((a,b) => { return b[1] - a[1]; });
        return sortedPlayerScores;
    }

    /**
     * Getter des joueurs de la partie.
     * @return {Array} Les joueurs de la partie.
     */
    getPlayers() {
        return this.players;
    }

    /**
     * Setter des joueurs de la partie.
     * @param {Array} players Les joueurs de la partie.
     */
    setPlayers(players) {
        this.players = players;
    }

    /**
     * Renvoie vrai si le joueur est enregistré, faux sinon.
     * @param {String} name Le nom du joueur.
     * @return {boolean}
     */
    searchPlayer(name) {
        for(let i  = 0 ; i < this.players.length ; i++) {
            if(this.players[i].getName() == name) {
                return true;
            }
        }
        return false;
    }

    /**
     * Cherche le joueur dans le tableau de joueurs à partir du tag.
     * @param {String} name Le tag du joueur.
     * @return {Player}
     */
    getPlayerByTag(tag) {
        for(let player of this.players) {
            if(player.getName() == tag) {
                return player;
            }
        }
        return null;
    }

    /**
     * Ajout d'un joueur à la partie.
     * @param {Player} player Le joueur qui veut rejoindre la partie.
     */
    join(player) {
        this.players.push(player);
        this.scores[player.getName()] = 0;
        this.nbPlayers = this.players.length;
    }

    /**
     * Retrait d'un joueur de la partie.
     * @param {Player} player Le joueur qui veut quitter la partie.
     */
    leave(player) {
        delete this.playerObject[player.getName()];
        this.players.remove(player);
        this.nbPlayers = this.players.length;
    }

    /**
     * Vérifie si un joueur peu encore rejoindre cette partie.
     * @return {boolean} vrai si la partie est rejoignable.
     */
    joinable() {
        return !this.started;
    }

    /**
     * Lance la partie.
     */
    startGame() {
        this.started = true;
    }
}