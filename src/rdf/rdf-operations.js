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
   * Modify a given triple
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
   * Adds a new triple
   * @param {string} subject
   * @param {string} predicate
   * @param {string} object
   */
  addTriple(subject, predicate, object) {
    const queryManager = new QueryManager(this.rdfcsa);
    const subjectId = this.rdfcsa.dictionary.getIdBySubject(subject);
    const predicateId = this.rdfcsa.dictionary.getIdByPredicate(predicate);
    const objectId = this.rdfcsa.dictionary.getIdByObject(object);

    // if triple already exists, abort.
    if (subjectId !== -1 && objectId !== -1 && predicateId !== -1) {
      const result = queryManager.getTriples([
        new QueryTriple(new QueryElement(subjectId), new QueryElement(predicateId), new QueryElement(objectId)),
      ]);
      if (result.length > 0) {
        return;
      }
    }

    // conver triples to string, add new triple at the bottom and create new RDFCSA
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
   * Deletes triple
   * @param {Triple} triple
   */
  deleteTriple(triple) {
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

    // check where triple is stored
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

    // remove triple
    oldTriples.splice(foundIndex, 1);

    // create new rdfcsa from oldTriples without found triple
    const stringTriples = [];
    oldTriples.forEach((oldTriple) => {
      stringTriples.push(this.rdfcsa.dictionary.decodeTriple(oldTriple));
    });
    this.rdfcsa = new Rdfcsa(stringTriples);
    return this.rdfcsa;
  }

  /**
   * Remove every triple that includes id
   * @param {int} id with gaps
   */
  deleteElementInDictionary(id) {
    const queryManager = new QueryManager(this.rdfcsa);

    // if id doesn't exist, abort
    if (!this.rdfcsa.dictionary.getElementById(id)) {
      return;
    }

    // if id not in triple, keep it by adding to newTriples
    const oldTriples = queryManager.getTriples([new QueryTriple(null, null, null)]);
    const newTriples = [];
    oldTriples.forEach((oldTriple) => {
      if (!(oldTriple.subject === id || oldTriple.predicate === id || oldTriple.object === id)) {
        newTriples.push(oldTriple);
      }
    });

    // create new rdfcsa from kept Triples newTriples
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
   * Changes triple elements with id id to a string text for all triples
   * @param {int} id
   * @param {string} text
   */
  changeInDictionary(id, text) {
    const queryManager = new QueryManager(this.rdfcsa);

    // if id not in dictionary, abort.
    if (!this.rdfcsa.dictionary.getElementById(id)) {
      return;
    }

    // decode all triples
    const oldString = this.rdfcsa.dictionary.getElementById(id);
    const oldTriples = queryManager.getTriples([new QueryTriple(null, null, null)]);
    const stringTriples = [];
    oldTriples.forEach((oldTriple) => {
      stringTriples.push(this.rdfcsa.dictionary.decodeTriple(oldTriple));
    });

    // change all occurences of
    const newStringList = [];
    stringTriples.forEach((stringTriple) => {
      // for every triple
      const temp = stringTriple;
      stringTriple.forEach((element, index) => {
        // for every element in triple
        if (element === oldString) {
          temp[index] = text; // replace element if it matches corresponding string of given id
        }
      });
      newStringList.push(temp); // add triple to string list
    });

    this.rdfcsa = new Rdfcsa(newStringList); // create new rdfcsa from stringlist
    return this.rdfcsa;
  }
}
