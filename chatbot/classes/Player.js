/**
 * Représente un joueur.
 */
exports.Player =  class Player {
    /**
     * Constructeur par défaut.
     */
    constructor() {
        this.name = "";
        this.history = {};
    }

    /**
     * Getter du nom du joueur
     * @return Le nom du joueur.
     */
    getName() {
        return this.name;
    }

    /**
     * Setter du nom du joueur.
     * @param {String} name Le nom du joueur.
     */
    setName(name) {
        this.name = name;
    }

    /**
     * Getter de l'historique du joueur.
     * @return L'historique du joueur.
     */
    getHistory() {
        return this.history;
    }

    /**
     * Setter de l'historique du joueur.
     * @param {Object} history L'historique du joueur.
     */
    setHistory(history) {
        this.history = history;
    }

    /**
     * Met à jour le score d'une figure de style dans l'historique du joueur.
     * @param {String} fds Le nom de la figure de style (clé).
     * @param {Float} value La valeur à ajouter au score actuel (valeur).
     */
    addToHistory(fds, value) {
        if(this.history[fds]) {
            this.history[fds] += value; // ajout du score
        } else {
            this.history[fds] = value; // premiere insertion
        }
    }
}
