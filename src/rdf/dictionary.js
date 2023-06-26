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
   * Adds one triple to the arrays (dictionary must exist)
   *
   * Adds every element of the triple to its respective array.
   * For all elements a check is performed whether they already exist in the respective array. If not, they are added.
   * For subject[object] a check is performed whether the subject[object] exists in the object[subject] array.
   * If so, it is added to SO (subject-object list) and removed from object[subject] in order to save space.
   *
   * Calculates some metadata for updating psi.
   *
   * @param {string} subject
   * @param {string} predicate
   * @param {string} object
   * @returns {{
   * subject: {
   *     id: number,
   *     isNew: boolean
   *   },
   *   predicate: {
   *     id: number,
   *     isNew: boolean
   *   },
   *   object: {
   *     id: number,
   *     isNew: boolean
   *   },
   *   soChange: {
   *     subjectGotSO: boolean,
   *     oldSubjectId: number,
   *     objectGotSO: boolean,
   *     oldObjectId: number
   *   }
   * }
   */
  addTriple(subject, predicate, object) {
    const subjectIsNew = !this.SO.includes(subject) && !this.S.includes(subject);
    const predicateIsNew = !this.P.includes(predicate);
    const objectIsNew = !this.SO.includes(object) && !this.O.includes(object);
    const subjectWasSO = this.SO.includes(subject);
    const objectWasSO = this.SO.includes(object);
    let subjectGotSO = false;
    let objectGotSO = false;

    let oldSubjectId;
    let oldObjectId;

    if (!subjectWasSO) {
      if (this.O.includes(subject)) {
        let pos = this.O.indexOf(subject);
        oldObjectId = this.SO.length + this.S.length + this.P.length + this.SO.length + pos;
        this.O.splice(pos, 1);
        objectGotSO = true;
        this.SO.push(subject);
      } else if (!this.S.includes(subject)) {
        this.S.push(subject);
      }
    }

    if (!objectWasSO) {
      if (this.S.includes(object)) {
        let pos = this.S.indexOf(object);
        oldSubjectId = this.SO.length + pos;
        this.S.splice(pos, 1);
        subjectGotSO = true;
        this.SO.push(object);
      } else if (!this.O.includes(object)) {
        this.O.push(object);
      }
    }

    // for predicate
    if (predicateIsNew) {
      this.P.push(predicate);
    }

    this.#sortArrays();

    const subjectId = this.getIdBySubject(subject);
    const predicateId = this.getIdByPredicate(predicate);
    const objectId = this.getIdByObject(object);

    return {
      subject: {
        id: subjectId,
        isNew: subjectIsNew,
      },
      predicate: {
        id: predicateId,
        isNew: predicateIsNew,
      },
      object: {
        id: objectId,
        isNew: objectIsNew,
      },
      soChange: {
        subjectGotSO: subjectGotSO,
        oldSubjectId: oldSubjectId,
        objectGotSO: objectGotSO,
        oldObjectId: oldObjectId,
      },
    };
  }

  /**
   * If `subjectDeleted` is true, the element is deleted. If it was a SO, it is removed from S and added to O
   * If `predicateDeleted` is true, the element is deleted from P.
   * If `objectDeleted` is true, the element is deleted. If it was a SO, it is removed from O and added to S
   * @param {Triple} triple
   * @param {boolean} subjectDeleted
   * @param {boolean} predicateDeleted
   * @param {boolean} objectDeleted
   * @returns {{subjectWasSO: boolean, objectWasSO: boolean, newObjectId: number, newSubjectId: number}}
   */
  deleteTriple(triple, subjectDeleted, predicateDeleted, objectDeleted) {
    const subjectWasSO = this.isSubjectObjectById(triple.subject);
    const objectWasSO = this.isSubjectObjectById(triple.object);
    let newObjectId = -1;
    let newSubjectId = -1;
    let subject;
    let object;
    if (subjectDeleted) {
      if (subjectWasSO) {
        object = this.getElementById(triple.object);
        subject = this.SO.splice(triple.subject, 1)[0];
        this.O.push(subject);
        this.O.sort();
        newObjectId = this.getIdByObject(subject);
      } else {
        const index = triple.subject - this.SO.length;
        this.S.splice(index, 1);
      }
    }
    if (predicateDeleted) {
      let index = triple.predicate - (this.SO.length + this.S.length);
      if (subjectDeleted) {
        index -= 1;
      }
      this.P.splice(index, 1);
    }
    if (objectDeleted) {
      let index = triple.object - (this.SO.length + this.S.length + this.P.length + this.SO.length);
      if (subjectDeleted) {
        index -= 1;
      }
      if (predicateDeleted) {
        index -= 1;
      }
      if (subjectWasSO && subject > object) {
        index -= 1;
      }
      if (objectWasSO) {
        const object = this.SO.splice(index, 1)[0];
        this.S.push(object);
        this.S.sort();
        newSubjectId = this.getIdBySubject(object);
      } else {
        this.O.splice(index, 1);
      }
    }

    return {
      subjectWasSO: subjectWasSO,
      objectWasSO: objectWasSO,
      newObjectId: newObjectId,
      newSubjectId: newSubjectId,
    };
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
   * Clear the dictionary and deletes the content of all arrays
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
   * @returns {int} the id with gaps
   */
  getIdBySubject(subject) {
    return this.#getIdByElementInArray(subject, this.S);
  }

  /**
   * Get the id of `object`
   * @param {string} object
   * @returns {int} the id with gaps
   */
  getIdByObject(object) {
    const temp = this.#getIdByElementInArray(object, this.O);
    if (temp === -1) {
      return temp;
    }
    return temp + this.SO.length + this.S.length + this.P.length;
  }

  /**
   * Get the id of `predicate`
   * @param {string} predicate
   * @returns {int} id with gaps
   */
  getIdByPredicate(predicate) {
    const temp = this.P.findIndex((el) => el === predicate);
    if (temp === -1) {
      return temp;
    }
    return temp + this.SO.length + this.S.length;
  }

  /**
   * Gets the id of the element with gaps
   * @param {string} element
   * @returns {number} id of the element, -1 if not found
   */
  getIdByElement(element) {
    const sId = this.getIdBySubject(element);
    if (sId != -1) {
      return sId;
    }
    const pId = this.getIdByPredicate(element);
    if (pId != -1) {
      return pId;
    }
    const oId = this.getIdByObject(element);
    if (oId != -1) {
      return oId;
    }
    return -1;
  }

  /**
   * Get subject with `id`
   * @param {int} id with gaps
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
   * @param {int} id with gaps
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
   * @param {int} id with gaps
   * @returns {string}
   */
  getPredicateById(id) {
    if (id < this.P.length) {
      return this.P[id];
    }
    return undefined;
  }

  /**
   * Returns element (string) by id with gaps
   * @param {int} id
   * @returns
   */
  getElementById(id) {
    if (id < this.SO.length + this.S.length) {
      // within S
      return this.getSubjectById(id);
    } else if (id < this.SO.length + this.S.length + this.P.length) {
      // within P
      return this.getPredicateById(id - (this.SO.length + this.S.length));
    } else if (id < this.SO.length + this.S.length + this.P.length + this.SO.length + this.O.length) {
      // within O
      return this.getObjectById(id - (this.SO.length + this.S.length + this.P.length));
    }
    return undefined;
  }

  /**
   * Returns true if element by id is subject and object.
   * Dictionary consists of SO+S+P+SO+O. Yes SO appear twice but that makes it easier to handle
   * @param {int} id
   * @returns {boolean}
   */
  isSubjectObjectById(id) {
    if (id < this.SO.length) {
      return true; // is in subject area of subject object
    } else if (id < this.SO.length + this.S.length + this.P.length) {
      return false; // is within just subject or predicate area
    } else if (id < this.SO.length + this.S.length + this.P.length + this.SO.length) {
      return true; // is in object area of subject object
    }
    return false; // is within just object area
  }

  /**
   * Gets the strings related to the ids of a triple
   * @param {Triple} triple
   * @returns {string[]}
   */
  decodeTriple(triple) {
    const subject = this.getElementById(triple.subject);
    const predicate = this.getElementById(triple.predicate);
    const object = this.getElementById(triple.object);
    return [subject, predicate, object];
  }

  /**
   * Contructs a map from SO and S containing the values as keys and the ids as values
   * @returns {Map<string, number>}
   */
  getSubjectMap() {
    const map = new Map();
    this.SO.forEach((so, index) => {
      map.set(so, index);
    });
    const soLength = this.SO.length;
    this.S.forEach((subject, index) => {
      map.set(subject, index + soLength);
    });
    return map;
  }

  /**
   * Contructs a map from P containing the values as keys and the ids as values
   * @returns {Map<string, number>}
   */
  getPredicateMap() {
    const map = new Map();
    const gap = this.SO.length + this.S.length;
    this.P.forEach((predicate, index) => {
      map.set(predicate, index + gap);
    });
    return map;
  }

  /**
   * Contructs a map from SO and O containing the values as keys and the ids as values
   * @returns {Map<string, number>}
   */
  getObjectMap() {
    const map = new Map();
    const gap = this.SO.length + this.S.length + this.P.length;
    this.SO.forEach((so, index) => {
      map.set(so, index + gap);
    });
    const soLength = this.SO.length;
    this.O.forEach((object, index) => {
      map.set(object, index + gap + soLength);
    });
    return map;
  }

  /**
   * Pushes the elements of the triple onto the respective arrays
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
   * Create a map where all map values are 1 and keys are elements of array
   * @param {*} array
   * @returns
   */
  #distinctMapFromArray(array) {
    const map = new Map();
    array.forEach((elem) => {
      if (!map.get(elem)) {
        map.set(elem, 1);
      }
    });
    return map;
  }

  /**
   * Create S O and P by first calculating disjunct maps and then adding elements to SO if both in S and O; otherwise to S [O] if coming from S [O].
   */
  #intersectArrays() {
    const sMap = this.#distinctMapFromArray(this.S);

    const oMap = this.#distinctMapFromArray(this.O);

    this.S = [];
    this.O = [];

    // add to SO if also in S otherwise to O
    oMap.forEach((_, elem) => {
      if (sMap.get(elem)) {
        // if element also exists in S
        this.SO.push(elem);
        sMap.set(elem, -1); // mark P element that has been added to SO
      } else {
        this.O.push(elem); // add to O if not in S
      }
    });

    // add to S if not added to SO
    sMap.forEach((val, key) => {
      if (val == 1) {
        // only non marked P elements are added to S because marked ones have been added to SO
        this.S.push(key);
      }
    });

    this.P = [...new Set(this.P)]; // make P distinct
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
   * Get the id of the object or subject `element` out of `SO` or `array`
   * @param {string} element
   * @param {string[]} array
   * @returns {int} id with gaps
   */
  #getIdByElementInArray(element, array) {
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
}
