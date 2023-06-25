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
        return this.rdfcsa;
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
   * Adds a new element (triple) to rdfcsa
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
    let oldSubjectId = metadata.subject.id;
    let oldObjectId = metadata.object.id;
    let oldPredicateId = metadata.predicate.id;

    // Update gaps if new elements were added to the dictionary
    // Calculate the old ids if new elements where inserted with a lower id
    if (metadata.subject.isNew) {
      this.rdfcsa.gaps[1] += 1;
      this.rdfcsa.gaps[2] += 1;

      oldObjectId -= 1;
      oldPredicateId -= 1;

      if (metadata.soChange.objectGotSO) {
        oldObjectId -= 1;
      }
    }
    if (metadata.predicate.isNew) {
      this.rdfcsa.gaps[2] += 1;
      oldObjectId -= 1;
    }

    if (
      metadata.soChange.subjectGotSO &&
      !this.rdfcsa.dictionary.isSubjectObjectById(metadata.subject.id) &&
      subject < object
    ) {
      oldSubjectId -= 1;
    }

    // Get the range where the existing subject is or the new subject will be
    let sRange;
    if (!metadata.subject.isNew) {
      sRange = [this.rdfcsa.select(oldSubjectId), this.rdfcsa.select(oldSubjectId + 1) - 1];
    } else {
      sInsertIndex = this.rdfcsa.select(oldSubjectId);
      sRange = [sInsertIndex, sInsertIndex];
    }

    // Get the range where the existing predicate is or the new predicate will be
    let pRange;
    if (!metadata.predicate.isNew) {
      pRange = [this.rdfcsa.select(oldPredicateId), this.rdfcsa.select(oldPredicateId + 1) - 1];
    } else {
      pInsertIndex = this.rdfcsa.select(oldPredicateId);
      pRange = [pInsertIndex, pInsertIndex];
    }

    // Get the range where the existing object is or the new object will be
    let oRange;
    if (!metadata.object.isNew) {
      oRange = [this.rdfcsa.select(oldObjectId), this.rdfcsa.select(oldObjectId + 1) - 1];
    } else {
      oInsertIndex = this.rdfcsa.select(oldObjectId);
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
      this.rdfcsa.D.addBit(sInsertIndex);
      this.rdfcsa.D.setBit(sInsertIndex);
    } else {
      this.rdfcsa.D.addBit(sRange[0] + 1);
    }

    if (metadata.predicate.isNew) {
      this.rdfcsa.D.addBit(pInsertIndex + 1);
      this.rdfcsa.D.setBit(pInsertIndex + 1);
    } else {
      this.rdfcsa.D.addBit(pRange[0] + 2);
    }

    if (metadata.object.isNew) {
      this.rdfcsa.D.addBit(oInsertIndex + 2);
      this.rdfcsa.D.setBit(oInsertIndex + 2);
    } else {
      this.rdfcsa.D.addBit(oRange[0] + 3);
    }

    if (metadata.subject.isNew && metadata.subject.id === 0) {
      this.rdfcsa.D.unsetBit(0);
      this.rdfcsa.D.setBit(1); // toggle because element got shifted by one place
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
        metadata.soChange.oldSubjectId += 1;
      }
      const rangeToMove = [
        this.rdfcsa.select(metadata.soChange.oldSubjectId),
        this.rdfcsa.select(metadata.soChange.oldSubjectId + 1) - 1,
      ];

      const targetIndex = this.rdfcsa.select(metadata.object.id - this.rdfcsa.gaps[2]);

      const distanceToMove = rangeToMove[0] - targetIndex;

      const rangeToMoveOver = [targetIndex, rangeToMove[0] - 1];

      this.#moveSubject(rangeToMove, rangeToMoveOver, distanceToMove);
    }

    if (metadata.soChange.objectGotSO) {
      metadata.soChange.oldObjectId += 1; // because subject gets inserted every time
      if (metadata.predicate.isNew) {
        metadata.soChange.oldObjectId += 1;
      }
      if (metadata.object.isNew && metadata.object.id - 1 <= metadata.soChange.oldObjectId) {
        metadata.soChange.oldObjectId += 1;
      }
      const rangeToMove = [
        this.rdfcsa.select(metadata.soChange.oldObjectId),
        this.rdfcsa.select(metadata.soChange.oldObjectId + 1) - 1,
      ];

      const targetIndex = this.rdfcsa.select(metadata.subject.id + this.rdfcsa.gaps[2]);

      const distanceToMove = rangeToMove[0] - targetIndex;

      const rangeToMoveOver = [targetIndex, rangeToMove[0] - 1];

      this.#moveObject(rangeToMove, rangeToMoveOver, distanceToMove);
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
    const sRange = [this.rdfcsa.select(triple.subject), this.rdfcsa.select(triple.subject + 1) - 1];
    const pRange = [this.rdfcsa.select(triple.predicate), this.rdfcsa.select(triple.predicate + 1) - 1];
    const oRange = [this.rdfcsa.select(triple.object), this.rdfcsa.select(triple.object + 1) - 1];
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
    this.rdfcsa.D.deleteBit(sRange[1]);
    this.rdfcsa.D.deleteBit(pRange[1] - 1);
    this.rdfcsa.D.deleteBit(oRange[1] - 2);

    this.rdfcsa.psi.splice(sIndex, 1);
    this.rdfcsa.psi.splice(pIndex - 1, 1);
    this.rdfcsa.psi.splice(oIndex - 2, 1);

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

    if (sDeleted && sIndex === 0 && this.rdfcsa.psi.length > 0) {
      this.rdfcsa.D.unsetBit(0);
    }

    if (metadata.subjectWasSO && sDeleted) {
      const oldObjectSOId = triple.subject + this.rdfcsa.gaps[2] - objectIdDifference;

      const rangeToMoveOver = [this.rdfcsa.select(oldObjectSOId), this.rdfcsa.select(oldObjectSOId + 1) - 1];

      const targetIndex = this.rdfcsa.select(metadata.newObjectId);

      const distanceToMove = rangeToMoveOver[1] - rangeToMoveOver[0] + 1;

      const rangeToMove = [rangeToMoveOver[1] + 1, targetIndex - 1];

      this.#moveObject(rangeToMove, rangeToMoveOver, distanceToMove);
    }

    if (metadata.objectWasSO && oDeleted) {
      const rangeToMoveOver = [
        this.rdfcsa.select(triple.object - this.rdfcsa.gaps[2]), // get ID of SO from "O" ID minus gaps
        this.rdfcsa.select(triple.object - this.rdfcsa.gaps[2] + 1) - 1,
      ];

      // + 1 because the 1 of the range to move is also counted by the select
      const targetIndex = this.rdfcsa.select(metadata.newSubjectId + 1);

      if (targetIndex - 1 > rangeToMoveOver[1]) {
        const distanceToMove = rangeToMoveOver[1] - rangeToMoveOver[0] + 1;

        const rangeToMove = [rangeToMoveOver[1] + 1, targetIndex - 1];

        this.#moveSubject(rangeToMove, rangeToMoveOver, distanceToMove);
      }
    }

    this.rdfcsa.gaps[1] -= predicateIdDifference;
    this.rdfcsa.gaps[2] -= objectIdDifference;

    this.rdfcsa.tripleCount -= 1;

    return this.rdfcsa;
  }

  /**
   * Moves a subject range in psi and D
   * @param {number[]} rangeToMove
   * @param {number[]} rangeToMoveOver
   * @param {number} distanceToMove
   */
  #moveSubject(rangeToMove, rangeToMoveOver, distanceToMove) {
    const moves = [];
    const changes = [];

    for (let i = rangeToMove[0]; i <= rangeToMove[1]; i++) {
      const movePredicate = this.rdfcsa.psi[i];
      const referencePredicateId = this.rdfcsa.D.rank(movePredicate);
      const rangePredicate = [
        this.rdfcsa.select(referencePredicateId),
        this.rdfcsa.select(referencePredicateId + 1) - 1,
      ];
      // IDEA: maybe move into second for loop to not calculate if not needed, save if calculated to not repeat for every loop iteration
      const referenceObjectId = this.rdfcsa.D.rank(this.rdfcsa.psi[movePredicate]);
      const rangeObject = [this.rdfcsa.select(referenceObjectId), this.rdfcsa.select(referenceObjectId + 1) - 1];
      for (let j = rangeToMoveOver[0]; j <= rangeToMoveOver[1]; j++) {
        const moveOverPredicate = this.rdfcsa.psi[j];
        if (
          moveOverPredicate >= rangePredicate[0] &&
          moveOverPredicate <= rangePredicate[1] &&
          moveOverPredicate < movePredicate
        ) {
          moves.push([movePredicate, -1]);
          changes.push([i, -1]);
          changes.push([j, +1]);
        }
        const moveOverObject = this.rdfcsa.psi[moveOverPredicate];
        if (
          moveOverObject >= rangeObject[0] &&
          moveOverObject <= rangeObject[1] &&
          moveOverObject < this.rdfcsa.psi[movePredicate]
        ) {
          moves.push([this.rdfcsa.psi[movePredicate], -1]);
          changes.push([movePredicate, -1]);
          changes.push([moveOverPredicate, +1]);
        }
      }
      moves.push([i, -distanceToMove]);
      changes.push([this.rdfcsa.psi[movePredicate], -distanceToMove]);
    }

    for (let k = rangeToMoveOver[0]; k <= rangeToMoveOver[1]; k++) {
      const target = this.rdfcsa.psi[this.rdfcsa.psi[k]];
      changes.push([target, rangeToMove[1] - rangeToMove[0] + 1]);
    }

    this.#applyChanges(changes);

    this.#applyMoves(moves);

    this.#executeMoveOnBitvector(rangeToMove, rangeToMoveOver, distanceToMove);
  }

  /**
   * Moves a object range in psi and D
   * @param {number[]} rangeToMove
   * @param {number[]} rangeToMoveOver
   * @param {number} distanceToMove
   */
  #moveObject(rangeToMove, rangeToMoveOver, distanceToMove) {
    const moves = [];
    const changes = [];

    for (let i = rangeToMove[0]; i <= rangeToMove[1]; i++) {
      const moveSubject = this.rdfcsa.psi[i];
      moves.push([i, -distanceToMove]);
      changes.push([this.rdfcsa.psi[moveSubject], -distanceToMove]);
    }

    for (let k = rangeToMoveOver[0]; k <= rangeToMoveOver[1]; k++) {
      const target = this.rdfcsa.psi[this.rdfcsa.psi[k]];
      changes.push([target, rangeToMove[1] - rangeToMove[0] + 1]);
    }

    this.#applyChanges(changes);

    this.#applyMoves(moves);

    this.#executeMoveOnBitvector(rangeToMove, rangeToMoveOver, distanceToMove);
  }

  /**
   * Moves the elements in `rangeToMove` for `distanceToMove`
   * @param {number[]} rangeToMove
   * @param {number[]} rangeToMoveOver
   * @param {number} distanceToMove
   */
  #executeMoveOnBitvector(rangeToMove, rangeToMoveOver, distanceToMove) {
    if (rangeToMoveOver[0] === 0) {
      this.rdfcsa.D.setBit(0);
      this.rdfcsa.D.unsetBit(rangeToMove[0]);
    }
    // change D range
    for (let index = rangeToMove[0]; index <= rangeToMove[1]; index++) {
      const oldBit = this.rdfcsa.D.getBit(index);
      this.rdfcsa.D.deleteBit(index);
      this.rdfcsa.D.addBit(index - distanceToMove);
      if (oldBit === 1) {
        this.rdfcsa.D.setBit(index - distanceToMove);
      }
    }
  }

  /**
   * Applies the changes to psi
   * @param {number[][]} changes
   */
  #applyChanges(changes) {
    changes.forEach(([index, change]) => {
      this.rdfcsa.psi[index] += change;
    });
  }

  /**
   * Applies the moves to psi
   * @param {number[][]} moves
   */
  #applyMoves(moves) {
    moves.forEach(([index, movesLength]) => {
      for (let i = index; i > index + movesLength; i--) {
        const temp = this.rdfcsa.psi[i - 1];
        this.rdfcsa.psi[i - 1] = this.rdfcsa.psi[i];
        this.rdfcsa.psi[i] = temp;
      }
    });
  }

  /**
   * get the indices in psi or d where the triple is located, that has an element in every range
   * @param {number[]} sRange
   * @param {number[]} pRange
   * @param {number[]} oRange
   * @returns
   */
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
    if (!this.rdfcsa.dictionary.getElementById(id)) {
      return;
    }

    const element = this.rdfcsa.dictionary.getElementById(id);

    const queryManager = new QueryManager(this.rdfcsa);

    let tripleToDelete = this.#getTripleToDelete(element, queryManager);

    while (tripleToDelete != undefined) {
      this.deleteTripleNew(tripleToDelete);
      tripleToDelete = this.#getTripleToDelete(element, queryManager);
    }

    return this.rdfcsa;
  }

  #getTripleToDelete(element, queryManager) {
    const id = this.rdfcsa.dictionary.getIdByElement(element);

    if (id === -1) {
      return undefined;
    }

    let tripleToDelete;
    if (this.rdfcsa.gaps[1] > id) {
      tripleToDelete = queryManager.getTriples([new QueryTriple(new QueryElement(id), null, null)]);
    } else if (this.rdfcsa.gaps[2] > id) {
      tripleToDelete = queryManager.getTriples([new QueryTriple(null, new QueryElement(id), null)]);
    } else {
      tripleToDelete = queryManager.getTriples([new QueryTriple(null, null, new QueryElement(id))]);
    }

    if (tripleToDelete.length === 0) {
      return undefined;
    }
    return tripleToDelete[0];
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
   * @param {int} id with gaps
   * @param {string} text
   */
  changeInDictionary(id, text) {
    const queryManager = new QueryManager(this.rdfcsa);

    const originalTriples = [];

    if (id < this.rdfcsa.gaps[1]) {
      const originalTriplesNumeric = queryManager.getTriples([new QueryTriple(new QueryElement(id), null, null)]);
      originalTriplesNumeric.forEach((triple) => {
        originalTriples.push(this.rdfcsa.dictionary.decodeTriple(triple));
      });
      originalTriples.forEach((triple) => {
        triple[0] = text;
      });
      if (this.rdfcsa.dictionary.isSubjectObjectById(id)) {
        const originalObjectTriplesNumeric = queryManager.getTriples([
          new QueryTriple(null, null, new QueryElement(id + this.rdfcsa.gaps[2])),
        ]);
        const originalObjectTriples = [];
        originalObjectTriplesNumeric.forEach((triple) => {
          originalObjectTriples.push(this.rdfcsa.dictionary.decodeTriple(triple));
        });
        originalObjectTriples.forEach((triple) => {
          triple[2] = text;
        });
        originalTriples.push(...originalObjectTriples);
      }
    } else if (id < this.rdfcsa.gaps[2]) {
      const originalTriplesNumeric = queryManager.getTriples([new QueryTriple(null, new QueryElement(id), null)]);
      originalTriplesNumeric.forEach((triple) => {
        originalTriples.push(this.rdfcsa.dictionary.decodeTriple(triple));
      });
      originalTriples.forEach((triple) => {
        triple[1] = text;
      });
    } else {
      const originalTriplesNumeric = queryManager.getTriples([
        null,
        null,
        new QueryTriple(new QueryElement(id - this.rdfcsa.gaps[2])),
      ]);
      originalTriplesNumeric.forEach((triple) => {
        originalTriples.push(this.rdfcsa.dictionary.decodeTriple(triple));
      });
      originalTriples.forEach((triple) => {
        triple[2] = text;
      });
      if (this.rdfcsa.dictionary.isSubjectObjectById(id)) {
        const originalSubjectTriplesNumeric = queryManager.getTriples([
          new QueryTriple(new QueryElement(id), null, null),
        ]);
        const originalSubjectTriples = [];
        originalSubjectTriplesNumeric.forEach((triple) => {
          originalSubjectTriples.push(this.rdfcsa.dictionary.decodeTriple(triple));
        });
        originalSubjectTriples.forEach((triple) => {
          triple[0] = text;
        });
        originalTriples.push(...originalSubjectTriples);
      }
    }
    this.deleteElementInDictionary(id);

    originalTriples.forEach((changedTriple) => {
      this.addTripleNew(changedTriple[0], changedTriple[1], changedTriple[2]);
    });

    return this.rdfcsa;
  }
}
