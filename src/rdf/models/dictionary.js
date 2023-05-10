const exampleTripleList = [
  ["Hans", "hat", "Auto"],

  ["Auto", "ist", "grün"],

  ["Haus", "gehört", "Hans"],

  ["Geld", "ist", "grün"],

  [
    "http://one.example/subject1",

    "http://one.example/predicate1",

    "http://one.example/object1",
    ,
  ],
  ,
];

/**
 * Class for handling the dictionary encoding for the RDFCSA
 */
class Dictionary {
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
    // index starts at 0
    tripleList.forEach((triple) => {
      subject = triple[0];
      predicate = triple[1];
      object = triple[2];
      this.inputTriple(subject, predicate, object);
    });
    sortArrays();
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
  inputTriple(subject, predicate, object) {
    // for subject and object
    [
      [this.S, this.O, subject],
      [this.O, this.S, object],
    ].forEach(([array, otherArray, element]) => {
      if (otherArray.includes(element)) {
        if (!this.SO.includes(element)) {
          this.SO.push(element);
          pos = otherArray.indexOf(element);
          otherArray.splice(pos, 1);
        }
      } else if (!array.includes(element)) {
        array.push(element);
      }
    });
    // for predicate
    if (!this.P.includes(predicate)) {
      this.P.push(predicate);
    }
  }

  /**
   * Sorts the arrays SO, S, P and O ascending
   */
  sortArrays() {
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
    this.inputTriple(subject, predicate, object);
    this.sortArrays();
  }

  /**
   * Deletes the element in SO containing `subjectObjectToDelete`
   * @param {string} subjectObjectToDelete
   */
  deleteSubjectObject(subjectObjectToDelete) {
    pos = this.SO.indexOf(subjectObjectToDelete);
    this.SO.splice(pos, 1);
  }

  /**
   * Deletes the element in S containing `subjectToDelete`
   * @param {string} subjectToDelete
   */
  deleteSubject(subjectToDelete) {
    pos = this.S.indexOf(subjectToDelete);
    this.S.splice(pos, 1);
  }

  /**
   * Deletes the element in O containing `objectToDelete`
   * @param {string} objectToDelete
   */
  deleteObject(objectToDelete) {
    pos = this.O.indexOf(objectToDelete);
    this.O.splice(pos, 1);
  }

  /**
   * Deletes the element in P containing `predicateToDelete`
   * @param {string} predicateToDelete
   */
  deletePredicate(predicateToDelete) {
    pos = this.P.indexOf(predicateToDelete);
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
   * @returns
   */
  getIdBySubject(subject) {
    return this.getIdByElement(subject, this.S);
  }

  /**
   * Get the id of `object`
   * @param {string} object
   * @returns
   */
  getIdByObject(object) {
    return this.getIdByElement(object, this.O);
  }

  /**
   * Get the id of the object or subject `element` out of `SO` or `array`
   * @param {string} element
   * @param {string[]} array
   * @returns
   */
  getIdByElement(element, array) {
    const arrayIndex = this.SO.findIndex(element);
    if (arrayIndex === -1) {
      return SOIndex;
    }
    const found = array.findIndex(element);
    if (found === -1) {
      return -1;
    }
    return this.SO.length + found;
  }

  /**
   * Get the id of `predicate`
   * @param {string} predicate
   * @returns
   */
  getIdByPredicate(predicate) {
    return this.P.findIndex(predicate);
  }

  /**
   * Get subject with `id`
   * @param {int} id
   * @returns
   */
  getSubjectById(id) {
    if (id < this.SO.length + S.length) {
      if (id < this.SO.length) {
        return this.SO.find(id);
      }
      return this.S.find(id - this.SO.length);
    }
    return undefined;
  }

  /**
   * Get object with `id`
   * @param {int} id
   * @returns
   */
  getObjectById(id) {
    if (id < this.SO.length) {
      return this.SO.find(id);
    } else if (id < this.SO.length + this.O.length) {
      return this.O.find(id - this.SO.length);
    }
    return undefined;
  }

  /**
   * Get object with `id`
   * @param {int} id
   * @returns
   */
  getPredicateById(id) {
    if (id < this.P.length) {
      return this.P.find(id);
    }
    return undefined;
  }
}
