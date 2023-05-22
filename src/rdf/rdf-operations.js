import { QueryElement } from "./models/query-element";
import { QueryTriple } from "./models/query-triple";
import { Triple } from "./models/triple";
import { QueryManager } from "./query-manager";
import { Rdfcsa } from "./rdfcsa";

export class RdfOperations {
  /**
   * Handles all RDFCSA modifications
   * @param {Rdfcsa} rdfcsa
   */

  constructor(rdfcsa) {
    /** @type {Rdfcsa} */
    this.rdfcsa = rdfcsa;
  }

  /**
   *
   * @param {Triple} oldTriple
   * @param {string} newSubject
   * @param {string} newPredicate
   * @param {string} newObject
   * @returns
   */
  modifyTriples(oldTriple, newSubject, newPredicate, newObject) {
    this.deleteTriple(oldTriple);
    this.addTriple(newSubject, newPredicate, newObject);
    return this.rdfcsa;
  }

  /**
   * Adds a new element (triple) to rdfcsa - what happens if element already exists?
   * @param {string} subject
   * @param {string} predicate
   * @param {string} object
   */
  addTriple(subject, predicate, object) {
    // query first whether the object already exists
    // if not export rdfcsa in triple pattern, add pattern at bottom, create new rdfcsa, replace this.rdfcsa with generated rdfcsa
    const queryManager = new QueryManager(this.rdfcsa);
    const subjectId = this.rdfcsa.dictionary.getIdBySubject(subject);
    const predicateId = this.rdfcsa.dictionary.getIdByPredicate(predicate);
    const objectId = this.rdfcsa.dictionary.getIdByObject(object);

    if (subjectId !== -1 && objectId !== -1 && predicateId !== -1) {
      // check if triple exists
      const result = queryManager.getTriples([
        new QueryTriple(new QueryElement(subjectId), new QueryElement(predicateId), new QueryElement(objectId)),
      ]);
      if (result.length > 0) {
        return;
      }
    }

    const oldTriples = queryManager.getTriples([new QueryTriple(null, null, null)]);
    const stringTriples = [];
    oldTriples.forEach((oldTriple) => {
      stringTriples.push(this.rdfcsa.dictionary.decodeTriple(oldTriple));
    });
    stringTriples.push([subject, predicate, object]);
    this.rdfcsa = new Rdfcsa(stringTriples);
    return this.rdfcsa;
  }

  /**
   *
   * @param {Triple} triple
   */
  deleteTriple(triple) {
    // query first whether the object already exists
    // if not export rdfcsa in triple pattern, add pattern at bottom, create new rdfcsa, replace this.rdfcsa with generated rdfcsa
    const queryManager = new QueryManager(this.rdfcsa);

    const result = queryManager.getTriples([
      new QueryTriple(
        new QueryElement(triple.subject),
        new QueryElement(triple.predicate),
        new QueryElement(triple.object)
      ),
    ]);
    if (result.length !== 1) {
      return;
    }

    const oldTriples = queryManager.getTriples([new QueryTriple(null, null, null)]);
    let foundIndex = -1;
    oldTriples.forEach((oldTriple, index) => {
      if (
        triple.subject === oldTriple.subject &&
        triple.predicate === oldTriple.predicate &&
        triple.object === oldTriple.object
      ) {
        foundIndex = index;
        return;
      }
    });
    oldTriples.splice(foundIndex, 1);
    const stringTriples = [];
    oldTriples.forEach((oldTriple) => {
      stringTriples.push(this.rdfcsa.dictionary.decodeTriple(oldTriple));
    });
    this.rdfcsa = new Rdfcsa(stringTriples);
    return this.rdfcsa;
  }

  /**
   *
   * @param {int} id with gaps
   */
  deleteElementInDictionary(id) {
    // Check if id exists
    // if so, export rdfcsa in triple pattern, remove every line where id related string is included at the correct position via regex, create new rdfcsa, replace this.rdfcsa with generated rdfcsa
    const queryManager = new QueryManager(this.rdfcsa);

    if (!this.rdfcsa.dictionary.getElementById(id)) {
      return;
    }

    const oldTriples = queryManager.getTriples([new QueryTriple(null, null, null)]);
    const newTriples = [];
    oldTriples.forEach((oldTriple) => {
      if (!(oldTriple.subject === id || oldTriple.predicate === id || oldTriple.object === id)) {
        newTriples.push(oldTriple);
      }
    });

    const stringTriples = [];
    newTriples.forEach((newTriple) => {
      stringTriples.push(this.rdfcsa.dictionary.decodeTriple(newTriple));
    });
    this.rdfcsa = new Rdfcsa(stringTriples);
    return this.rdfcsa;
  }

  /**
   * Deletes all triples from RDFCSA.
   */
  deleteAll() {
    this.dictionary = new Dictionary();
    this.rdfcsa.tArray = [];
    this.rdfcsa.aArray = [];
    this.rdfcsa.D = []; // TODO: Make vector
    this.rdfcsa.psi = [];
  }

  /**
   *
   * @param {int} id
   * @param {string} text
   */
  changeInDictionary(id, text) {
    // change every text where at id position. Maybe you can just change it directly in the dictionary (maybe with export and import).
    const queryManager = new QueryManager(this.rdfcsa);

    if (!this.rdfcsa.dictionary.getElementById(id)) {
      return;
    }

    const oldString = this.rdfcsa.dictionary.getElementById(id);

    const oldTriples = queryManager.getTriples([new QueryTriple(null, null, null)]);

    const stringTriples = [];
    oldTriples.forEach((oldTriple) => {
      stringTriples.push(this.rdfcsa.dictionary.decodeTriple(oldTriple));
    });

    const newStringList = [];
    stringTriples.forEach((stringTriple) => {
      const temp = stringTriple;
      if (stringTriple[0] === oldString) {
        temp[0] = text;
      }
      if (stringTriple[1] === oldString) {
        temp[1] = text;
      }
      if (stringTriple[2] === oldString) {
        temp[2] = text;
      }
      newStringList.push(temp);
    });

    this.rdfcsa = new Rdfcsa(newStringList);
    return this.rdfcsa;
  }
}
