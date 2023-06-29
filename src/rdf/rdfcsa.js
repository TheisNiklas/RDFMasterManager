/**
 * Contributions made by:
 * Niklas Theis
 * Tobias Kaps
 * Svea Worms
 */

import { Dictionary } from "./dictionary";
import { BitVector } from "./bitvector";
import { BitVectorJsArray } from "./bitvector-js-array";
import { gzip } from "zlib";

export class Rdfcsa {
  /**
   * Creates the rdfcsa datastructure
   * @param {string[][]} tripleList
   */
  constructor(tripleList, useJsBitvector = false) {
    this.tripleCount = tripleList.length;
    this.dictionary = new Dictionary(tripleList);
    this.dictionary.createDictionaries(tripleList);
    const tArray = this.#constructTArrays(tripleList);
    const aArray = this.#constructA(tArray);
    if (useJsBitvector) {
      this.D = this.#constructDJsArray(tArray, aArray);
    } else {
      this.D = this.#constructDBitvector(tArray, aArray);
    }
    this.psi = this.#constructPsi(aArray);
  }

  /**
   * Wrapper with extension when trying to access a bit which is not saved because of optimisations
   * @param {Number} count
   * @returns {Number}
   */
  select(count) {
    let result = this.D.select(count);
    if (result < 0) {
      result = this.psi.length;
    }
    return result;
  }

  /**
   * Save the database in a native format.
   */
  saveDatabase() {
    const serialized = JSON.stringify(this);
    gzip(serialized, (err, data) => {
      if (err) throw err;
      const link = document.createElement("a");
      const blob = new Blob([data], { type: "application/octet-stream" });
      link.href = URL.createObjectURL(blob);
      link.download = "database.rdfcsa";
      link.click();
    });
  }

  /**
   * Constructs the array Tid and T from the `tipleList`
   * @param {string[][]} tripleList
   * @returns {number[]} Array T
   */
  #constructTArrays(tripleList) {
    // use map instead of indexOf because performance is much better
    const subjectMap = this.dictionary.getSubjectMap();
    const predicateMap = this.dictionary.getPredicateMap();
    const objectMap = this.dictionary.getObjectMap();
    tripleList.forEach((triple) => {
      triple[0] = subjectMap.get(triple[0]);
      triple[1] = predicateMap.get(triple[1]);
      triple[2] = objectMap.get(triple[2]);
    });

    tripleList.sort((a, b) => {
      if (a[0] - b[0] !== 0) {
        return a[0] - b[0];
      }
      if (a[1] - b[1] !== 0) {
        return a[1] - b[1];
      }
      return a[2] - b[2];
    });

    return this.#constructT(JSON.parse(JSON.stringify(tripleList)));
  }

  /**
   * Constructs the array T from the `tripleList`
   * @param {Number[][]} tripleList
   * @returns {number[]} Array T
   */
  #constructT(tripleList) {
    // create gaps array
    const gaps = [
      0,
      this.dictionary.SO.length + this.dictionary.S.length,
      this.dictionary.SO.length + this.dictionary.S.length + this.dictionary.P.length,
    ];
    this.gaps = gaps;

    // generate tArray (all triples without grouping into triples)
    var tArray = [];
    tripleList.forEach((triple) => {
      tArray.push(triple[0]);
      tArray.push(triple[1]);
      tArray.push(triple[2]);
    });

    return tArray;
  }

  /**
   * Constructs the array A (suffix array)
   * tArray 0 9 12 | 1 8 15 | 2 5 11 | 2 7 13 | 3 5 11 | 3 7 15 | 3 10 12 | 4 5 11 | 4 6 14 | 4 7 15
   * aArray 0 3 6 ...
   *
   * (0)|(9)|(12)
   * (0)|(1)|(2)
   *
   *
   * @param {number[]} tArray array of S,O,P IDs in S1,O1,P1,...SN,ON,PN order
   * @returns {number[]} aArray (suffix array; sorted indices of tArray's elements after the corresponding tArray elements)
   */
  #constructA(tArray) {
    // creates array with indices from tArray
    let aArray = Array.from(tArray.keys());
    // delete last element (implementation trick in paper?)
    aArray.sort((a, b) => tArray[a] - tArray[b]); // where a,b are any two elements of aArray; then the value at those places in tArray are compared.
    return aArray;
  }

  /**
   * Constructs the bitvector D, currently as a number array
   * D[i]=1 if tArray[aArray[i]]!=tArray[aArray[i-1]] changes else D[i]=0
   * @param {number[]} tArray array of S,O,P IDs in S1,O1,P1,...SN,ON,PN order)
   * @param {number[]} aArray suffix array
   * @returns {BitVector}
   */
  #constructDBitvector(tArray, aArray) {
    let dArray = new BitVector();
    let preElement = 0; // has to be 0, due to out indexing starting from 0, results in D always starting with 0
    aArray.forEach((element, index) => {
      // every time the id in tArray changes a 1 is set at the specific index in the bitvector
      if (preElement < tArray[element]) {
        dArray.setBit(index);
      }
      preElement = tArray[element];
    });
    return dArray;
  }

  /**
   * Constructs the bitvector D, currently as a number array
   * D[i]=1 if tArray[aArray[i]]!=tArray[aArray[i-1]] changes else D[i]=0
   * @param {number[]} tArray array of S,O,P IDs in S1,O1,P1,...SN,ON,PN order)
   * @param {number[]} aArray suffix array
   * @returns {number[]}
   */
  #constructDJsArray(tArray, aArray) {
    let dArray = [];
    let preElement = 0; // has to be 0, due to out indexing starting from 0, results in D always starting with 0
    aArray.forEach((element) => {
      // every time the id in tArray changes a 1 is push, else a 0 is pushed
      if (preElement < tArray[element]) {
        dArray.push(1);
      } else {
        dArray.push(0);
      }
      preElement = tArray[element];
    });
    let bitvector = new BitVectorJsArray(dArray);
    return bitvector;
  }

  /**
   * Constructs the array Psi
   * example data:
   *   values  0  1  2  | 3  4  5  | 6  7  8    9  10 11   12 13 14   15 16 17   18 19 20   21 22 23   24 25 26   27 28 29
   *   index array:  indices to the references of the triple in array A (calculated by sorting aArray ascending)
   *   index   0  18 23 | 1  17 27 | 2  10 20 | 3  14 25 | 4  11 21 | 5  15 28 | 6  19 24 | 7  12 22 | 8  13 26 | 9  16 29
   *   aArray  0  3  6    9  12 15   18 21 24   27|7  13   22 25 10   16 28 4    1  19|8    14 23 2    20 11 26   5  17 29
   *   psi     18 17 10   14 11 15   19 12 13   16|20 21   22 26 25   28 29 27   23 24|2    4  7  0    6  3  8    1  5  9
   * @param {number[]} aArray suffix array
   * @returns {number[]} Psi
   */
  #constructPsi(aArray) {
    let indexArray = Array.from(aArray.keys());
    indexArray.sort((a, b) => aArray[a] - aArray[b]); //suffix array of the suffix array; aArray[indexArray[]]
    let psi = [];
    aArray.forEach((element) => {
      if (element % 3 === 2) {
        // every third is a S/P/O
        // generating circular reference from object back to subject (last part of the psi array)
        psi.push(indexArray[element - 2]);
      } else {
        // generating reference from subject -> predicate and predicate -> object
        psi.push(indexArray[element + 1]);
      }
    });
    return psi;
  }
}
