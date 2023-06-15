/**
 * Class for handling the dictionary encoding for the RDFCSA
 */
export class Dictionary {
    SO: any[];
    S: any[];
    P: any[];
    O: any[];
    /**
     * Creates the dictionary encoding from an array of triples
     * @param {string[][]} tripleList
     */
    createDictionaries(tripleList: string[][]): void;
    /**
     * Adds one triple to the arrays
     * @param {string} subject
     * @param {string} predicate
     * @param {string} object
     */
    addTriple(subject: string, predicate: string, object: string): void;
    /**
     * Deletes the element in SO containing `subjectObjectToDelete`
     * @param {string} subjectObjectToDelete
     */
    deleteSubjectObject(subjectObjectToDelete: string): void;
    /**
     * Deletes the element in S containing `subjectToDelete`
     * @param {string} subjectToDelete
     */
    deleteSubject(subjectToDelete: string): void;
    /**
     * Deletes the element in O containing `objectToDelete`
     * @param {string} objectToDelete
     */
    deleteObject(objectToDelete: string): void;
    /**
     * Deletes the element in P containing `predicateToDelete`
     * @param {string} predicateToDelete
     */
    deletePredicate(predicateToDelete: string): void;
    /**
     * Deletes the content of all arrays
     */
    deleteDictionary(): void;
    /**
     * Get the id of `subject`
     * @param {string} subject
     * @returns {number}
     */
    getIdBySubject(subject: string): number;
    /**
     * Get the id of `object`
     * @param {string} object
     * @returns {number}
     */
    getIdByObject(object: string): number;
    /**
     * Get the id of the object or subject `element` out of `SO` or `array`
     * @param {string} element
     * @param {string[]} array
     * @returns {number}
     */
    getIdByElement(element: string, array: string[]): number;
    /**
     * Get the id of `predicate`
     * @param {string} predicate
     * @returns {number}
     */
    getIdByPredicate(predicate: string): number;
    /**
     * Get subject with `id`
     * @param {number} id
     * @returns {string}
     */
    getSubjectById(id: number): string;
    /**
     * Get object with `id`
     * @param {number} id
     * @returns {string}
     */
    getObjectById(id: number): string;
    /**
     * Get object with `id`
     * @param {number} id
     * @returns {string}
     */
    getPredicateById(id: number): string;
    /**
     * Returns element (string) by id
     * @param {number} id
     * @returns
     */
    getElementById(id: number): string;
    /**
     * Returns true if element by id is subject and object.
     * Dictionary consists of SO+S+P+SO+O. Yes SO appear twice but that makes it easier to handle
     * @param {number} id
     * @returns
     */
    isSubjectObjectById(id: number): boolean;
    /**
     *
     * @param {Triple} triple
     */
    decodeTriple(triple: Triple): string[];
    /**
     * Get subjects in a map
     * @returns {Map<string,number>}
     */
    getSubjectMap(): Map<string, number>;
    /**
     * Get predicates in a map
     * @returns {Map<string,number>}
     */
    getPredicateMap(): Map<string, number>;
    /**
     * Get objects in a map
     * @returns {Map<string,number>}
     */
    getObjectMap(): Map<string, number>;
    #private;
}
import { Triple } from "./models/triple";
