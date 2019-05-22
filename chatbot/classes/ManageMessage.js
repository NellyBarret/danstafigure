/**
 * Représente le manager de messages.
 */
exports.ManageMessage = class ManageMessage {
    /**
     * Constructeur par défaut.
     */
    constructor()�{
        this.filter = null;
    }

    /**
     * Getter du filtre.
     * @return Le filtre.
     */
    getFilter() {
        return this.filter;
    }

    /**
     * Setter du filtre.
     * @param {Object} filter Le filtre.
     */
    setFilter(filter) {
        this.filter = filter;
    }
}