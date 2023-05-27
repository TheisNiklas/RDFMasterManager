import { Triple } from "./models/triple";

/**
 * Class for handling the dictionary encoding for the RDFCSA
 */
export class Dictionary {
  constructor() {
    this.SO = [];
    this.S = [];
    this.P = [];
    this.O = [];
  }

  /**
   * Creates the dictionary encoding from an array of triples
   * @param {string[][]} tripleList
   */
  createDictionaries(tripleList) {
    const tripleListCopy = JSON.parse(JSON.stringify(tripleList));
    tripleListCopy.forEach((triple) => {
      let subject = triple[0];
      let predicate = triple[1];
      let object = triple[2];
      this.#inputTriple(subject, predicate, object);
    });
    this.#intersectArrays();
    this.#sortArrays();
  }
  /**
   * 
   * @param {string} subject
   * @param {string} predicate
   * @param {string} object
   */
  #inputTriple(subject, predicate, object) {
    this.S.push(subject);
    this.P.push(predicate);
    this.O.push(object);
  }
  
  /**
   * Adds every element of the triple to its respective array.
   * For all elements a check is performed whether they already exist in the respective array. If not, they are added.
   * For subject[object] a check is performed whether the subject[object] exists in the object[subject] array.
   * If so, it is added to SO (subject-object list) and removed from object[subject] in order to save space.
   * @param {string} subject
   * @param {string} predicate
   * @param {string} object
   */
  #inputTripleForAdd(subject, predicate, object) {
    // for subject and object
    [
      [this.S, this.O, subject],
      [this.O, this.S, object],
    ].forEach(([array, otherArray, element]) => {
      if (!this.SO.includes(element)) {
        if (otherArray.includes(element)) {
          this.SO.push(element);
          let pos = otherArray.indexOf(element);
          otherArray.splice(pos, 1);
        } else if (!array.includes(element)) {
          array.push(element);
        }
      }
    });
    // for predicate
    if (!this.P.includes(predicate)) {
      this.P.push(predicate);
    }
  }
  
  #distinctMapFromArray(array) {
    const map = new Map();
    array.forEach(elem => {
      if (!map.get(elem)) {
        map.set(elem, 1);
      }
    });
    return map;
  }

  #intersectArrays() {
    const sMap = this.#distinctMapFromArray(this.S)

    const oMap = this.#distinctMapFromArray(this.O)

    this.S = [];
    this.O = [];

    oMap.forEach((_, elem) => {
      if (sMap.get(elem)) {
        this.SO.push(elem);
        sMap.set(elem, -1);
      } else {
        this.O.push(elem);
      }
    })

    sMap.forEach((val, key) => {
      if (val == 1) {
        this.S.push(key);
      }
    })

    const pMap = this.#distinctMapFromArray(this.P)
    this.P = [];

    pMap.forEach((_, key) => {
      this.P.push(key);
    })
  }

  /**
   * Sorts the arrays SO, S, P and O ascending
   */
  #sortArrays() {
    this.SO.sort();
    this.S.sort();
    this.P.sort();
    this.O.sort();
  }

  /**
   * Adds one triple to the arrays
   * @param {string} subject
   * @param {string} predicate
   * @param {string} object
   */
  addTriple(subject, predicate, object) {
    this.#inputTripleForAdd(subject, predicate, object);
    this.#sortArrays();
  }

  /**
   * Deletes the element in SO containing `subjectObjectToDelete`
   * @param {string} subjectObjectToDelete
   */
  deleteSubjectObject(subjectObjectToDelete) {
    let pos = this.SO.indexOf(subjectObjectToDelete);
    this.SO.splice(pos, 1);
  }

  /**
   * Deletes the element in S containing `subjectToDelete`
   * @param {string} subjectToDelete
   */
  deleteSubject(subjectToDelete) {
    let pos = this.S.indexOf(subjectToDelete);
    this.S.splice(pos, 1);
  }

  /**
   * Deletes the element in O containing `objectToDelete`
   * @param {string} objectToDelete
   */
  deleteObject(objectToDelete) {
    let pos = this.O.indexOf(objectToDelete);
    this.O.splice(pos, 1);
  }

  /**
   * Deletes the element in P containing `predicateToDelete`
   * @param {string} predicateToDelete
   */
  deletePredicate(predicateToDelete) {
    let pos = this.P.indexOf(predicateToDelete);
    this.P.splice(pos, 1);
  }

  /**
   * Deletes the content of all arrays
   */
  deleteDictionary() {
    this.SO = [];
    this.S = [];
    this.P = [];
    this.O = [];
  }

  /**
   * Get the id of `subject`
   * @param {string} subject
   * @returns {int}
   */
  getIdBySubject(subject) {
    return this.getIdByElement(subject, this.S);
  }

  /**
   * Get the id of `object`
   * @param {string} object
   * @returns {int}
   */
  getIdByObject(object) {
    const temp = this.getIdByElement(object, this.O);
    return temp + this.SO.length + this.S.length + this.P.length;
  }

  /**
   * Get the id of the object or subject `element` out of `SO` or `array`
   * @param {string} element
   * @param {string[]} array
   * @returns {int}
   */
  getIdByElement(element, array) {
    const soIndex = this.SO.findIndex((el) => el === element);
    if (soIndex === -1) {
      const found = array.findIndex((el) => el === element);
      if (found === -1) {
        return -1;
      }
      return this.SO.length + found;
    }
    return soIndex;
  }

  /**
   * Get the id of `predicate`
   * @param {string} predicate
   * @returns {int}
   */
  getIdByPredicate(predicate) {
    return this.P.findIndex((el) => el === predicate) + this.SO.length + this.S.length;
  }

  /**
   * Get subject with `id`
   * @param {int} id
   * @returns {string}
   */
  getSubjectById(id) {
    if (id < this.SO.length + this.S.length) {
      if (id < this.SO.length) {
        return this.SO[id];
      }
      return this.S[id - this.SO.length];
    }
    return undefined;
  }

  /**
   * Get object with `id`
   * @param {int} id
   * @returns {string}
   */
  getObjectById(id) {
    if (id < this.SO.length) {
      return this.SO[id];
    } else if (id < this.SO.length + this.O.length) {
      return this.O[id - this.SO.length];
    }
    return undefined;
  }

  /**
   * Get object with `id`
   * @param {int} id
   * @returns {string}
   */
  getPredicateById(id) {
    if (id < this.P.length) {
      return this.P[id];
    }
    return undefined;
  }

  getElementById(id) {
    if (id < this.SO.length + this.S.length) {
      return this.getSubjectById(id);
    }
    if (id < this.SO.length + this.S.length + this.P.length) {
      return this.getPredicateById(id - (this.SO.length + this.S.length));
    }
    if (id < this.SO.length + this.S.length + this.P.length + this.SO.length + this.O.length) {
      return this.getObjectById(id - (this.SO.length + this.S.length + this.P.length));
    }
    return undefined;
  }

  isSubjectObjectByObjectId(id) {
    if (id < this.SO.length + this.S.length + this.P.length + this.SO.length) {
      return true;
    }
    return false;
  }

  /**
   *
   * @param {Triple} triple
   */
  decodeTriple(triple) {
    const subject = this.getElementById(triple.subject);
    const predicate = this.getElementById(triple.predicate);
    const object = this.getElementById(triple.object);
    return [subject, predicate, object];
  }

  getSubjectMap() {
    const map = new Map();
    this.SO.forEach((so, index) => {
      map.set(so, index);
    })
    const soLength = this.SO.length;
    this.S.forEach((subject, index) => {
      map.set(subject, index + soLength);
    })
    return map;
  }

  getPredicateMap() {
    const map = new Map();
    const gap = this.SO.length + this.S.length;
    this.P.forEach((predicate, index) => {
      map.set(predicate, index + gap);
    })
    return map;
  }

  getObjectMap() {
    const map = new Map();
    const gap = this.SO.length + this.S.length + this.P.length;
    this.SO.forEach((so, index) => {
      map.set(so, index + gap);
    })
    const soLength = this.SO.length;
    this.O.forEach((object, index) => {
      map.set(object, index + gap + soLength);
    })
    return map;
  }
}