import { Triple } from "./models/triple";

export class RdfOperations {
  /**
   * Handles all RDFCSA modifications
   * @param {Rdfcsa} rdfcsa
   */

  constructor(rdfcsa) {
    this.rdfcsa = rdfcsa;
  }

  /**
   * Regex changes all triples of given kind
   * @param {string} subject 
   * @param {string} predicate 
   * @param {string} object 
   */
  modifyTriples(oldTriple, newTriple){

  }
  /**
   * Adds a new element (triple) to rdfcsa - what happens if element already exists?
   * @param {string} subject 
   * @param {string} predicate 
   * @param {string} object 
   */
  addElement(subject, predicate, object) {
    // query first whether the object already exists
    // if not export rdfcsa in triple pattern, add pattern at bottom, create new rdfcsa, replace this.rdfcsa with generated rdfcsa
  }

  /**
   * 
   * @param {int} id 
   */
  deleteElementInDictionary(id) {
    // Check if id exists
    // if so, export rdfcsa in triple pattern, remove every line where id related string is included at the correct position via regex, create new rdfcsa, replace this.rdfcsa with generated rdfcsa
  }

  /**
   * Deletes all triples from RDFCSA.
   */
  deleteAll(){
    this.dictionary = new Dictionary();
    this.rdfcsa.tArray = []
    this.rdfcsa.aArray = []
    this.rdfcsa.D = [] // TODO: Make vector
    this.rdfcsa.psi = []
  }

  /**
   * 
   * @param {Triple} triple 
   * @param {string} subject 
   * @param {string} predicate 
   * @param {string} object 
   */
  changeElement(triple, subject, predicate, object){
    // export rdfcsa in triple pattern change line where subject predicate object is at the correct position and safe it again
  }

  /**
   * 
   * @param {int} id 
   * @param {string} text 
   */
  changeInDictionary(id, text){
    // change every text where at id position. Maybe you can just change it directly in the dictionary (maybe with export and import).
  }
}
