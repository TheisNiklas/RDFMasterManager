import { Dictionary } from "./dictionary";

export class Rdfcsa {
  /**
   * Creates the rdfcsa datastructure
   * @param {string[][]} tripleList
   */
  constructor(tripleList) {
    this.dictionary = new Dictionary(tripleList);
    const tArray = this.#constructTArrays(tripleList);
    const aArray = this.#constructA(tArray);
    this.D = this.#constructD(tArray, aArray);
    this.psi = this.#constructPsi(aArray);
  }

  /**
   * Constructs the array Tid and T from the `tipleList`
   * @param {string[][]} tripleList
   * @returns {number[]} Array T
   */
  #constructTArrays(tripleList) {
    // create SO, S, P and O dictionaries
    this.dictionary.createDictionaries(tripleList);
    // transform string triple into number triple
    tripleList.forEach((triple) => {
      triple[0] = this.dictionary.getIdBySubject(triple[0]);
      triple[1] = this.dictionary.getIdByPredicate(triple[1]);
      triple[2] = this.dictionary.getIdByObject(triple[2]);
    });
    // sort triples in list
    tripleList.sort();
    // create and return tArray
    return this.#constructT(JSON.parse(JSON.stringify(tripleList)));
  }

  /**
   * Cunstructs the array T from the `tripleList`
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
    // add gaps to triples
    tripleList.forEach((triple) => {
      triple[1] += gaps[1];
      triple[2] += gaps[2];
    });
    this.gaps = gaps;

    // generate tArray (all triples without grouping into triples)
    var tArray = [];
    tripleList.forEach((triple) => {
      tArray.push(triple[0]);
      tArray.push(triple[1]);
      tArray.push(triple[2]);
    });

    // 100 because it's a little big bigger (see paper; big number added at back)
    tArray.push(this.gaps[2] + this.dictionary.O.length + 100);

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
    aArray.pop(); // remove largest number (added before)
    aArray.sort((a, b) => tArray[a] - tArray[b]); // where a,b are any two elements of aArray; then the value at those places in tArray are compared.
    return aArray;
  }

  /**
   * Constructs the bitvector D, currently as a number array
   * D[i]=1 if tArray[aArray[i]]!=tArray[aArray[i-1]] changes else D[i]=0
   * @param {number[]} tArray array of S,O,P IDs in S1,O1,P1,...SN,ON,PN order)
   * @param {number[]} aArray suffix array
   * @returns {number[]}
   */
  #constructD(tArray, aArray) {
    let dArray = [];
    let preElement = 0; // has to be 0, due to out indexing starting from 0, results in D always starting with 0
    aArray.forEach((element) => {
      // every time the id in tArray changes a 1 is push, else a 0 is pushed
      if (preElement < tArray[element]) {
        // TODO: Check if != is faster (probably not)
        dArray.push(1);
      } else {
        dArray.push(0);
      }
      preElement = tArray[element];
    });
    return dArray;
  }

  // TODO: If large database available test if the branching variant to generate psi is
  //       better the find creating psi_orig and the decrement the last third each by one
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
