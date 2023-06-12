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
   *
   * @param {Triple} oldTriple
   * @param {string} newSubject
   * @param {string} newPredicate
   * @param {string} newObject
   * @returns
   */
  modifyTripleNew(oldTriple, newSubject, newPredicate, newObject) {
    this.deleteTripleNew(oldTriple);
    this.addTripleNew(newSubject, newPredicate, newObject);
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

    this.rdfcsa.tripleCount += 1;

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
    let oldSubjectId = metadata.subject.id; // Zans
    let oldObjectId = metadata.object.id;
    let oldPredicateId = metadata.predicate.id;

    // Update gaps if new elements were added to the dictionary
    if (metadata.subject.isNew) {
      this.rdfcsa.gaps[1] += 1;
      this.rdfcsa.gaps[2] += 1;
    }
    if (metadata.predicate.isNew) {
      this.rdfcsa.gaps[2] += 1;
    }

    if (metadata.subject.isNew) {
      oldObjectId -= 1;
      oldPredicateId -= 1;
      if (metadata.soChange.subjectGotSO && subject < object) {
        oldSubjectId -= 1;
      }
      if (metadata.soChange.objectGotSO) {
        oldObjectId -= 1;
      }
    }
    if (metadata.predicate.isNew) {
      oldObjectId -= 1;
    }

    // Get the range where the existing subject is or the new subject will be
    let sRange;
    if (!metadata.subject.isNew) {
      sRange = [
        BitvectorTools.select(this.rdfcsa.D, oldSubjectId),
        BitvectorTools.select(this.rdfcsa.D, oldSubjectId + 1) - 1,
      ];
    } else {
      sInsertIndex = BitvectorTools.select(this.rdfcsa.D, oldSubjectId);
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
          if (this.rdfcsa.psi[this.rdfcsa.psi[i]] < sRange[0]) {
            continue;
          }
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

    if (metadata.subject.isNew && metadata.subject.id === 0) {
      this.rdfcsa.D[0] = 0
      this.rdfcsa.D[1] = 1 // toggle because element got shifted by one place 
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

    if (metadata.soChange.subjectGotSO) {
      if (metadata.subject.isNew && metadata.subject.id - 1 <= metadata.soChange.oldSubjectId) {
        metadata.soChange.oldSubjectId += 1
      }
      const rangeToMove = [
        BitvectorTools.select(this.rdfcsa.D, metadata.soChange.oldSubjectId),
        BitvectorTools.select(this.rdfcsa.D, metadata.soChange.oldSubjectId + 1) - 1
      ]

      const targetIndex = BitvectorTools.select(this.rdfcsa.D, metadata.object.id - this.rdfcsa.gaps[2]);

      const distanceToMove = rangeToMove[0] - targetIndex;

      const rangeToMoveOver = [
        targetIndex,
        rangeToMove[0] - 1
      ]

      const moves = [];
      const changes = [];
      
      for (let i = rangeToMove[0]; i <= rangeToMove[1]; i++) {
        const movePredicate = this.rdfcsa.psi[i];
        const referencePredicateId = BitvectorTools.rank(this.rdfcsa.D, movePredicate);
        const rangePredicate = [
          BitvectorTools.select(this.rdfcsa.D, referencePredicateId),
          BitvectorTools.select(this.rdfcsa.D, referencePredicateId + 1) - 1
        ]
        // IDEA: maybe move into second for loop to not calculate if not needed, save if calculated to not repeat for every loop iteration
        const referenceObjectId = BitvectorTools.rank(this.rdfcsa.D, this.rdfcsa.psi[movePredicate]);
        const rangeObject = [
          BitvectorTools.select(this.rdfcsa.D, referenceObjectId),
          BitvectorTools.select(this.rdfcsa.D, referenceObjectId + 1) - 1
        ]
        for (let j = rangeToMoveOver[0]; j <= rangeToMoveOver[1]; j++) {
          const moveOverPredicate = this.rdfcsa.psi[j];
          if (moveOverPredicate >= rangePredicate[0] && moveOverPredicate <= rangePredicate[1] && moveOverPredicate < movePredicate) {
            moves.push([movePredicate, -1]);
            changes.push([i, -1]);
            changes.push([j, +1]);
          }
          const moveOverObject = this.rdfcsa.psi[moveOverPredicate]
          if (moveOverObject >= rangeObject[0] && moveOverObject <= rangeObject[1] && moveOverObject < this.rdfcsa.psi[movePredicate]) {
            moves.push([this.rdfcsa.psi[movePredicate], -1]);
            changes.push([movePredicate, -1]);
            changes.push([moveOverPredicate, +1]);
          }
        }
        moves.push([i, - distanceToMove]);
        changes.push([this.rdfcsa.psi[movePredicate], -distanceToMove]);
      }

      for (let k = rangeToMoveOver[0]; k <= rangeToMoveOver[1]; k++) {
        const target = this.rdfcsa.psi[this.rdfcsa.psi[k]]
        changes.push([target, rangeToMove[1] - rangeToMove[0] + 1]);
      }


      changes.forEach(([index, change]) => {
        this.rdfcsa.psi[index] += change;
      })

      moves.forEach(([index, movesLength]) => {
        for (let i = index; i > index + movesLength; i--) {   
          const temp = this.rdfcsa.psi[i - 1];
          this.rdfcsa.psi[i - 1] = this.rdfcsa.psi[i];
          this.rdfcsa.psi[i] = temp;
        }
      })
      
      if (rangeToMoveOver[0] === 0) {
        this.rdfcsa.D[0] = 1
        this.rdfcsa.D[rangeToMove[0]] = 0
      }
      // change D range
      for (let index = rangeToMove[0]; index <= rangeToMove[1]; index++) {
        for (let i = index; i > index - distanceToMove; i--) {   
          const temp = this.rdfcsa.D[i - 1];
          this.rdfcsa.D[i - 1] = this.rdfcsa.D[i];
          this.rdfcsa.D[i] = temp;
        }
      }
    }
    
    if (metadata.soChange.objectGotSO) {
      metadata.soChange.oldObjectId += 1 // because subject gets inserted every time
      if (metadata.predicate.isNew) {
        metadata.soChange.oldObjectId += 1
      }
      if (metadata.object.isNew && metadata.object.id - 1 <= metadata.soChange.oldObjectId) {
        metadata.soChange.oldObjectId += 1
      }
      const rangeToMove = [
        BitvectorTools.select(this.rdfcsa.D, metadata.soChange.oldObjectId),
        BitvectorTools.select(this.rdfcsa.D, metadata.soChange.oldObjectId + 1) - 1
      ]

      const targetIndex = BitvectorTools.select(this.rdfcsa.D, metadata.subject.id + this.rdfcsa.gaps[2]);

      const distanceToMove = rangeToMove[0] - targetIndex;

      const rangeToMoveOver = [
        targetIndex,
        rangeToMove[0] - 1
      ]

      const moves = [];
      const changes = [];
      
      for (let i = rangeToMove[0]; i <= rangeToMove[1]; i++) {
        const moveSubject = this.rdfcsa.psi[i];
        moves.push([i, -distanceToMove]);
        changes.push([this.rdfcsa.psi[moveSubject], -distanceToMove]);
      }

      for (let k = rangeToMoveOver[0]; k <= rangeToMoveOver[1]; k++) {
        const target = this.rdfcsa.psi[this.rdfcsa.psi[k]]
        changes.push([target, rangeToMove[1] - rangeToMove[0] + 1]);
      }


      changes.forEach(([index, change]) => {
        this.rdfcsa.psi[index] += change;
      })

      moves.forEach(([index, movesLength]) => {
        for (let i = index; i > index + movesLength; i--) {   
          const temp = this.rdfcsa.psi[i - 1];
          this.rdfcsa.psi[i - 1] = this.rdfcsa.psi[i];
          this.rdfcsa.psi[i] = temp;
        }
      })

      for (let index = rangeToMove[0]; index <= rangeToMove[1]; index++) {
        for (let i = index; i > index - distanceToMove; i--) {   
          const temp = this.rdfcsa.D[i - 1];
          this.rdfcsa.D[i - 1] = this.rdfcsa.D[i];
          this.rdfcsa.D[i] = temp;
        }
      }
    }

    this.rdfcsa.tripleCount += 1;

    return this.rdfcsa;
  }

  /**
   * Delete Triple from database with new method
   * @param {Triple} triple 
   */
  deleteTripleNew(triple) {
    const queryManager = new QueryManager(this.rdfcsa);

    const result = queryManager.getTriples([
      new QueryTriple(
        new QueryElement(triple.subject),
        new QueryElement(triple.predicate),
        new QueryElement(triple.object)
      ),
    ]);
    if (result.length !== 1) {
      // elements doesnt exists in database
      return;
    }
    const sRange = [
      BitvectorTools.select(this.rdfcsa.D, triple.subject),
      BitvectorTools.select(this.rdfcsa.D, triple.subject + 1) - 1,
    ];
    const pRange = [
      BitvectorTools.select(this.rdfcsa.D, triple.predicate),
      BitvectorTools.select(this.rdfcsa.D, triple.predicate + 1) - 1,
    ];
    const oRange = [
      BitvectorTools.select(this.rdfcsa.D, triple.object),
      BitvectorTools.select(this.rdfcsa.D, triple.object + 1) - 1,
    ];
    let sDeleted = false;
    let pDeleted = false;
    let oDeleted = false;

    let predicateIdDifference = 0;
    let objectIdDifference = 0;

    if (sRange[1] - sRange[0] === 0) {
      sDeleted = true;
      predicateIdDifference += 1;
      objectIdDifference += 1;
    }
    if (pRange[1] - pRange[0] === 0) {
      pDeleted = true;
      objectIdDifference += 1;
    }
    if (oRange[1] - oRange[0] === 0) {
      oDeleted = true;
    }

    const metadata = this.rdfcsa.dictionary.deleteTriple(triple, sDeleted, pDeleted, oDeleted);

    const indices = this.#getTripleIndices(sRange, pRange, oRange);
    const sIndex = indices[0];
    const pIndex = indices[1];
    const oIndex = indices[2];


    // delete those positions from D
    this.rdfcsa.D.splice(sRange[1], 1);
    this.rdfcsa.D.splice(pRange[1] - 1, 1);
    this.rdfcsa.D.splice(oRange[1] - 2, 1);
    
    this.rdfcsa.psi.splice(sIndex, 1)[0];
    this.rdfcsa.psi.splice(pIndex - 1, 1)[0];
    this.rdfcsa.psi.splice(oIndex - 2, 1)[0];
    
    // Update existing references in psi
    for (let i = 0; i < this.rdfcsa.psi.length / 3; i++) {
      const subjectArealength = this.rdfcsa.psi.length / 3;

      // Update first third ("subjects"), referencing the index of the predicates
      if (this.rdfcsa.psi[i] < pIndex) {
        this.rdfcsa.psi[i] -= 1;
      } else {
        this.rdfcsa.psi[i] -= 2;
      }

      // Update second third ("predicate"), referencing the index of the objects
      if (this.rdfcsa.psi[i + subjectArealength] < oIndex) {
        this.rdfcsa.psi[i + subjectArealength] -= 2;
      } else {
        this.rdfcsa.psi[i + subjectArealength] -= 3;
      }

      // Update third third ("objects"), referencing the index of the subjects
      if (this.rdfcsa.psi[i + 2 * subjectArealength] >= sIndex) {
        this.rdfcsa.psi[i + 2 * subjectArealength] -= 1;
      }
    }

    if (sDeleted && sIndex === 0 && this.rdfcsa.D.length > 0) {
      this.rdfcsa.D[0] = 0;
    }

    if (metadata.subjectWasSO && sDeleted) {
      const oldObjectSOId =  triple.subject + this.rdfcsa.gaps[2] - objectIdDifference

      const rangeToMoveOver = [
        BitvectorTools.select(this.rdfcsa.D, oldObjectSOId),
        BitvectorTools.select(this.rdfcsa.D, oldObjectSOId + 1) - 1
      ]

      const targetIndex = BitvectorTools.select(this.rdfcsa.D, metadata.newObjectId);

      const distanceToMove = rangeToMoveOver[1] - rangeToMoveOver[0] + 1;

      const rangeToMove = [
        rangeToMoveOver[1] + 1,
        targetIndex - 1
      ]

      const moves = [];
      const changes = [];
      
      for (let i = rangeToMove[0]; i <= rangeToMove[1]; i++) {
        const moveSubject = this.rdfcsa.psi[i];
        moves.push([i, -distanceToMove]);
        changes.push([this.rdfcsa.psi[moveSubject], -distanceToMove]);
      }

      for (let k = rangeToMoveOver[0]; k <= rangeToMoveOver[1]; k++) {
        const target = this.rdfcsa.psi[this.rdfcsa.psi[k]]
        changes.push([target, rangeToMove[1] - rangeToMove[0] + 1]);
      }


      changes.forEach(([index, change]) => {
        this.rdfcsa.psi[index] += change;
      })

      moves.forEach(([index, movesLength]) => {
        for (let i = index; i > index + movesLength; i--) {   
          const temp = this.rdfcsa.psi[i - 1];
          this.rdfcsa.psi[i - 1] = this.rdfcsa.psi[i];
          this.rdfcsa.psi[i] = temp;
        }
      })
      // change D range
      for (let index = rangeToMove[0]; index <= rangeToMove[1]; index++) {
        for (let i = index; i > index - distanceToMove; i--) {   
          const temp = this.rdfcsa.D[i - 1];
          this.rdfcsa.D[i - 1] = this.rdfcsa.D[i];
          this.rdfcsa.D[i] = temp;
        }
      }
    }

    if (metadata.objectWasSO && oDeleted) {
      const rangeToMoveOver = [
        BitvectorTools.select(this.rdfcsa.D, triple.object - this.rdfcsa.gaps[2]), // get ID of SO from "O" ID minus gaps
        BitvectorTools.select(this.rdfcsa.D, triple.object - this.rdfcsa.gaps[2] + 1) - 1
      ]

      const targetIndex = BitvectorTools.select(this.rdfcsa.D, metadata.newSubjectId + 1);

      if (targetIndex - 1 > rangeToMoveOver[1]) {

        const distanceToMove = rangeToMoveOver[1] - rangeToMoveOver[0] + 1;

        const rangeToMove = [
          rangeToMoveOver[1] + 1,
          targetIndex - 1
        ]

        const moves = [];
        const changes = [];

        for (let i = rangeToMove[0]; i <= rangeToMove[1]; i++) {
          const movePredicate = this.rdfcsa.psi[i];
          const referencePredicateId = BitvectorTools.rank(this.rdfcsa.D, movePredicate);
          const rangePredicate = [
            BitvectorTools.select(this.rdfcsa.D, referencePredicateId),
            BitvectorTools.select(this.rdfcsa.D, referencePredicateId + 1) - 1
          ]
          // IDEA: maybe move into second for loop to not calculate if not needed, save if calculated to not repeat for every loop iteration
          const referenceObjectId = BitvectorTools.rank(this.rdfcsa.D, this.rdfcsa.psi[movePredicate]);
          const rangeObject = [
            BitvectorTools.select(this.rdfcsa.D, referenceObjectId),
            BitvectorTools.select(this.rdfcsa.D, referenceObjectId + 1) - 1
          ]
          for (let j = rangeToMoveOver[0]; j <= rangeToMoveOver[1]; j++) {
            const moveOverPredicate = this.rdfcsa.psi[j];
            if (moveOverPredicate >= rangePredicate[0] && moveOverPredicate <= rangePredicate[1] && moveOverPredicate < movePredicate) {
              moves.push([movePredicate, -1]);
              changes.push([i, -1]);
              changes.push([j, +1]);
            }
            const moveOverObject = this.rdfcsa.psi[moveOverPredicate]
            if (moveOverObject >= rangeObject[0] && moveOverObject <= rangeObject[1] && moveOverObject < this.rdfcsa.psi[movePredicate]) {
              moves.push([this.rdfcsa.psi[movePredicate], -1]);
              changes.push([movePredicate, -1]);
              changes.push([moveOverPredicate, +1]);
            }
          }
          moves.push([i, - distanceToMove]);
          changes.push([this.rdfcsa.psi[movePredicate], -distanceToMove]);
        }

        for (let k = rangeToMoveOver[0]; k <= rangeToMoveOver[1]; k++) {
          const target = this.rdfcsa.psi[this.rdfcsa.psi[k]]
          changes.push([target, rangeToMove[1] - rangeToMove[0] + 1]);
        }

        changes.forEach(([index, change]) => {
          this.rdfcsa.psi[index] += change;
        })

        moves.forEach(([index, movesLength]) => {
          for (let i = index; i > index + movesLength; i--) {   
            const temp = this.rdfcsa.psi[i - 1];
            this.rdfcsa.psi[i - 1] = this.rdfcsa.psi[i];
            this.rdfcsa.psi[i] = temp;
          }
        })

        
        if (rangeToMoveOver[0] === 0) {
          this.rdfcsa.D[0] = 1
          this.rdfcsa.D[rangeToMove[0]] = 0
        }
        // change D range
        for (let index = rangeToMove[0]; index <= rangeToMove[1]; index++) {
          for (let i = index; i > index - distanceToMove; i--) {   
            const temp = this.rdfcsa.D[i - 1];
            this.rdfcsa.D[i - 1] = this.rdfcsa.D[i];
            this.rdfcsa.D[i] = temp;
          }
        }
      }
    }

    this.rdfcsa.gaps[1] -= predicateIdDifference;
    this.rdfcsa.gaps[2] -= objectIdDifference;

    this.rdfcsa.tripleCount -= 1;

    return this.rdfcsa;
  }

  #getTripleIndices(sRange, pRange, oRange) {
    const ranges = [sRange, pRange, oRange];
    //Take the first range
    let range = ranges.shift();
    //Check if elements from one range point into the next range
    //and update the first range to reflect that
    ranges.forEach((r, index) => {
      let new_range = [];
      for (let i = range[0]; i <= range[1]; i++) {
        let val = this.rdfcsa.psi[i];
        if (index === 1) {
          val = this.rdfcsa.psi[val];
        }
        if (val >= r[0] && val <= r[1]) {
          new_range.push(i);
        }
      }
      if (new_range.length === 0) {
        range = [];
        return;
      }
      range = [new_range[0], new_range.pop()];
    });

    const sIndex = range[0];
    const pIndex = this.rdfcsa.psi[sIndex];
    const oIndex = this.rdfcsa.psi[pIndex];
    return [sIndex, pIndex, oIndex];
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

    this.rdfcsa.tripleCount -= 1;

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
