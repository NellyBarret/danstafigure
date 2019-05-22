/**
 * Repr√©sente les erreurs HTTP.
 */
exports.Errors = class Errors {
    /**
     * Constructeur par d√©faut.
     */
    constructor() {

    }

    /**
     * Erreur de modification.
     */
    errorModify() {

    }
    
    /**
     * Erreur de cr√©ation.
     */
    errorCreate()†{

    }
    
    /**
     * Erreur de PUT.
     * @param {String} cleFDS La figure de style.
     */
    errorPut(cleFDS)†{
        console.log("ERROR CREATION of the fds [ " + cleFDS + " ] --- at : " + Date());
    }
    
    /**
     * Error de GET.
     */
    errorGet() {

    }
}