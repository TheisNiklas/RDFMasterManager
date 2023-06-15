export class RdfOperations {
    /**
     * Handles all RDFCSA modifications
     * @param {Rdfcsa} rdfcsa
     */
    constructor(rdfcsa: Rdfcsa);
    /** @type {Rdfcsa} */
    rdfcsa: Rdfcsa;
    /**
     *
     * @param {Triple} oldTriple
     * @param {string} newSubject
     * @param {string} newPredicate
     * @param {string} newObject
     * @returns
     */
    modifyTriples(oldTriple: Triple, newSubject: string, newPredicate: string, newObject: string): Rdfcsa;
    /**
     * Adds a new element (triple) to rdfcsa - what happens if element already exists?
     * @param {string} subject
     * @param {string} predicate
     * @param {string} object
     */
    addTriple(subject: string, predicate: string, object: string): Rdfcsa;
    /**
     *
     * @param {Triple} triple
     */
    deleteTriple(triple: Triple): Rdfcsa;
    /**
     *
     * @param {int} id with gaps
     */
    deleteElementInDictionary(id: int): Rdfcsa;
    /**
     * Deletes all triples from RDFCSA.
     */
    deleteAll(): void;
    dictionary: any;
    /**
     *
     * @param {int} id
     * @param {string} text
     */
    changeInDictionary(id: int, text: string): Rdfcsa;
}
import { Rdfcsa } from "./rdfcsa";
import { Triple } from "./models/triple";
