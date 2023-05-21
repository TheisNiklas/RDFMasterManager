import { QueryTriple } from "../../src/rdf/models/query-triple";
import { BitvectorTools } from "./bitvector-tools";
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
    // export rdfcsa in triple pattern, add pattern at bottom, create new rdfcsa, replace this.rdfcsa with generated rdfcsa
  }

  /**
   * 
   * @param {int} id 
   */
  deleteElementInDictionary(id) {
    // remove every triple where id is included at the correct position regex
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
    // change every triple where subject predicate object is included at the correct position regex
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
