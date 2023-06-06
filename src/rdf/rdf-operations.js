import { QueryElement } from "./models/query-element";
import { QueryTriple } from "./models/query-triple";
import { Triple } from "./models/triple";
import { QueryManager } from "./query-manager";
import { Rdfcsa } from "./rdfcsa";
import { BitvectorTools } from "./bitvector-tools";

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
        return this.rdfcsa; // TODO: If error message needed return undefined
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
   * Adds a new element (triple) to rdfcsa - what happens if element already exists?
   * @param {string} subject
   * @param {string} predicate
   * @param {string} object
   */
  addTripleNew(subject, predicate, object) {
    // add new triple to dic†ionary and re†urn the id of the elements after insert
    // Step 1 and 2 of insert concept (for the first case)
    const metadata = this.rdfcsa.dictionary.addTriple(subject, predicate, object);

    const queryManager = new QueryManager(this.rdfcsa);

    if (!metadata.subject.isNew && !metadata.predicate.isNew && !metadata.object.isNew) {
      // check if triple exists
      const result = queryManager.getTriples([
        new QueryTriple(
          new QueryElement(metadata.subject.id),
          new QueryElement(metadata.predicate.id),
          new QueryElement(metadata.object.id)
        ),
      ]);
      // If triple exists return the current unchanged rdfcsa
      if (result.length > 0) {
        return this.rdfcsa;
      }
    }

    // Init the indices, where the new triple should be inserted
    let sInsertIndex;
    let pInsertIndex;
    let oInsertIndex;

    // For the case that new elements got inserted into the dictionary, calculate the original ids for existing objects and predicates
    let oldObjectId = metadata.object.id;
    let oldPredicateId = metadata.predicate.id;
    if (metadata.subject.isNew) {
      oldObjectId -= 1;
      oldPredicateId -= 1;
    }
    if (metadata.predicate.isNew) {
      oldObjectId -= 1;
    }

    // Get the range where the existing subject is or the new subject will be
    let sRange;
    if (!metadata.subject.isNew) {
      sRange = [
        BitvectorTools.select(this.rdfcsa.D, metadata.subject.id),
        BitvectorTools.select(this.rdfcsa.D, metadata.subject.id + 1) - 1,
      ];
    } else {
      sInsertIndex = BitvectorTools.select(this.rdfcsa.D, metadata.subject.id);
      sRange = [sInsertIndex, sInsertIndex];
    }

    // Get the range where the existing predicate is or the new predicate will be
    let pRange
    if (!metadata.predicate.isNew) {
      pRange = [
        BitvectorTools.select(this.rdfcsa.D, oldPredicateId),
        BitvectorTools.select(this.rdfcsa.D, oldPredicateId + 1) - 1,
      ];
    } else {
      pInsertIndex = BitvectorTools.select(this.rdfcsa.D, oldPredicateId);
      pRange = [pInsertIndex, pInsertIndex];
    }

    // Get the range where the existing object is or the new object will be
    let oRange;
    if (!metadata.object.isNew) {
      oRange = [
        BitvectorTools.select(this.rdfcsa.D, oldObjectId),
        BitvectorTools.select(this.rdfcsa.D, oldObjectId + 1) - 1,
      ];
    } else {
      oInsertIndex = BitvectorTools.select(this.rdfcsa.D, oldObjectId);
      oRange = [oInsertIndex, oInsertIndex];
    }
    
    // If the subject already exists, calculate the insertion position inside the range of existing triples with the subject
    if (!metadata.subject.isNew) {
      sInsertIndex = sRange[1] + 1;

      for (let i = sRange[0]; i <= sRange[1]; i++) {
        if (this.rdfcsa.psi[i] < pRange[0]) {
          continue;
        }
        if (this.rdfcsa.psi[i] > pRange[1]) {
          sInsertIndex = i;
          break;
        }
        if (this.rdfcsa.psi[i] >= pRange[0] && this.rdfcsa.psi[i] <= pRange[1] && !metadata.predicate.isNew) {
          if (this.rdfcsa.psi[this.rdfcsa.psi[i]] < oRange[0]) {
            continue;
          }
          if (this.rdfcsa.psi[this.rdfcsa.psi[i]] > oRange[1]) {
            sInsertIndex = i;
            break;
          }
          if (metadata.object.isNew) {
            sInsertIndex = i;
            break;
          }
        } else {
          sInsertIndex = i;
          break;
        }
      }
    }

    // If the predicate already exists, calculate the insertion position inside the range of existing triples with the predicate
    if (!metadata.predicate.isNew) {
      pInsertIndex = pRange[1] + 1;

      for (let i = pRange[0]; i <= pRange[1]; i++) {
        if (this.rdfcsa.psi[i] < oRange[0] && this.rdfcsa.psi[this.rdfcsa.psi[i]] < sRange[0]) {
          continue;
        }
        if (this.rdfcsa.psi[i] > oRange[1]) {
          pInsertIndex = i;
          break;
        }
        if (this.rdfcsa.psi[i] >= oRange[0] && this.rdfcsa.psi[i] <= oRange[1]) {
          if (this.rdfcsa.psi[this.rdfcsa.psi[i]] < sRange[0]) {
            continue;
          }
          if (this.rdfcsa.psi[this.rdfcsa.psi[i]] > sRange[1]) {
            pInsertIndex = i;
            break;
          }
          if (metadata.subject.isNew) {
            pInsertIndex = i;
            break;
          }
        } else {
          pInsertIndex = i;
          break;
        }
      }
    }
    
    // If the object already exists, calculate the insertion position inside the range of existing triples with the object
    if (!metadata.object.isNew) {
      oInsertIndex = oRange[1] + 1;

      for (let i = oRange[0]; i <= oRange[1]; i++) {
        if (this.rdfcsa.psi[i] < sRange[0]) {
          continue;
        }
        if (this.rdfcsa.psi[i] > sRange[1]) {
          oInsertIndex = i;
          break;
        }
        if (this.rdfcsa.psi[i] >= sRange[0] && this.rdfcsa.psi[i] <= sRange[1] && !metadata.subject.isNew) {
          if (this.rdfcsa.psi[this.rdfcsa.psi[i]] < pRange[0]) {
            continue;
          }
          if (this.rdfcsa.psi[this.rdfcsa.psi[i]] > pRange[1]) {
            oInsertIndex = i;
            break;
          }
          if (metadata.predicate.isNew) {
            oInsertIndex = i;
            break;
          }
        } else {
          oInsertIndex = i;
          break;
        }
      }
    }

    // Update the bitvector D, with 1s for new elements and 0s after first index of its respective range for existing elements
    if (metadata.subject.isNew) {
      this.rdfcsa.D.splice(sInsertIndex, 0, 1);
    } else {
      this.rdfcsa.D.splice(sRange[0] + 1, 0, 0);
    }

    if (metadata.predicate.isNew) {
      this.rdfcsa.D.splice(pInsertIndex + 1, 0, 1);
    } else {
      this.rdfcsa.D.splice(pRange[0] + 2, 0, 0);
    }

    if (metadata.object.isNew) {
      this.rdfcsa.D.splice(oInsertIndex + 2, 0, 1);
    } else {
      this.rdfcsa.D.splice(oRange[0] + 3, 0, 0);
    }
    
    // Update existing references in psi
    for (let i = 0; i < this.rdfcsa.psi.length / 3; i++) {
      const subjectArealength = this.rdfcsa.psi.length / 3;

      // Update first third ("subjects"), referencing the index of the predicates
      if (this.rdfcsa.psi[i] < pInsertIndex) {
        this.rdfcsa.psi[i] += 1;
      } else {
        this.rdfcsa.psi[i] += 2;
      }

      // Update second third ("predicate"), referencing the index of the objects
      if (this.rdfcsa.psi[i + subjectArealength] < oInsertIndex) {
        this.rdfcsa.psi[i + subjectArealength] += 2;
      } else {
        this.rdfcsa.psi[i + subjectArealength] += 3;
      }

      // Update third third ("objects"), referencing the index of the subjects
      if (this.rdfcsa.psi[i + 2 * subjectArealength] >= sInsertIndex) {
        this.rdfcsa.psi[i + 2 * subjectArealength] += 1;
      }
    }

    // Insert the new references into psi
    this.rdfcsa.psi.splice(sInsertIndex, 0, pInsertIndex + 1);
    this.rdfcsa.psi.splice(pInsertIndex + 1, 0, oInsertIndex + 2);
    this.rdfcsa.psi.splice(oInsertIndex + 2, 0, sInsertIndex);

    // Update gaps if new elements were added to the dictionary
    if (metadata.subject.isNew) {
      this.rdfcsa.gaps[1] += 1;
      this.rdfcsa.gaps[2] += 1;
    }
    if (metadata.predicate.isNew) {
      this.rdfcsa.gaps[2] += 1;
    }

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
