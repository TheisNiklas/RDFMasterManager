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

class Dictionary {
  constructor() {
    this.SO = [];
    this.S = [];
    this.P = [];
    this.O = [];
  }

  /**
   * 
   * @param {string[][]} tripleList 
   */
  createDictionaries(tripleList) {
    // index starts at 0
    tripleList.forEach((triple) => {
      subject = triple[0];
      predicate = triple[1];
      object = triple[2];
      inputTriple(subject, predicate, object);
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
    [[this.S, this.O, subject], [this.O, this.S, object]].forEach(
      ([array, otherArray, element]) => {
        if (otherArray.includes(element)) {
          if (!this.SO.includes(element)) {
            this.SO.push(element);
            pos = otherArray.indexOf(element);
            otherArray.splice(pos, 1);
          }
        } else if (!array.includes(element)) {
          array.push(element);
        }
      }
    );
    // for predicate
    if (!this.P.includes(predicate)) {
      this.P.push(predicate);
    }
  }

  sortArrays() {
    this.SO.sort();
    this.S.sort();
    this.P.sort();
    this.O.sort();
  }

  addTriple(subject, predicate, object) {
    inputTriple(subject, predicate, object);
    sortArrays();
  }

  deleteSubjectObject(subjectObjectToDelete) {
    pos = this.SO.indexOf(subjectObjectToDelete);
    this.SO.splice(pos, 1);
  }

  deleteSubject(subjectToDelete) {
    pos = this.S.indexOf(subjectToDelete);
    this.S.splice(pos, 1);
  }

  deleteObject(objectToDelete) {
    pos = this.O.indexOf(objectToDelete);
    this.O.splice(pos, 1);
  }

  deletePredicate(predicateToDelete) {
    pos = this.P.indexOf(predicateToDelete);
    this.P.splice(pos, 1);
  }

  deleteDictionary() {
    this.SO = [];
    this.S = [];
    this.P = [];
    this.O = [];
  }

  getIdBySubject(subject) {
    return getIdBySO(subject, this.S);
  }

  getIdByObject(object) {
    return getIdBySO(object, this.O);
  }

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

  getIdByPredicate(predicate) {
    return this.P.findIndex(predicate);
  }

  getSubjectByID(id) {
    if (id < this.SO.length + S.length) {
      if (id < this.SO.length) {
        return this.SO.find(id);
      }
      return this.S.find(id - this.SO.length);
    }
    return undefined;
  }

  getObjectByID(id) {
    if (id < this.SO.length) {
      return this.SO.find(id);
    } else if (id < this.SO.length + this.O.length) {
      return this.O.find(id - this.SO.length);
    }
    return undefined;
  }

  getPredicateByID(id) {
    if (id < this.P.length) {
      return this.P.find(id);
    }
    return undefined;
  }
}
