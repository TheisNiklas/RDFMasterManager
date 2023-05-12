import { Dictionary } from "./dictionary";

export class Rdfcsa {
  constructor() {
    this.dictionary = new Dictionary();
    this.gaps = [];
  }

  /**
   * Construct the arrays being part of the RDFCSA
   * @param {string[][]} tripleList
   */
  construct(tripleList) {
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
    this.dictionary.createDictionaries(tripleList);
    tripleList.forEach((triple) => {
      triple[0] = this.dictionary.getIdBySubject(triple[0]);
      triple[1] = this.dictionary.getIdByPredicate(triple[1]);
      triple[2] = this.dictionary.getIdByObject(triple[2]);
    });
    tripleList.sort();

    return this.#constructT(JSON.parse(JSON.stringify(tripleList)));
  }

  /**
   * Cunstructs the array T from the `tripleList`
   * @param {Number[][]} tripleList
   * @returns {number[]} Array T
   */
  #constructT(tripleList) {
    const gaps = [
      0,
      this.dictionary.SO.length + this.dictionary.S.length,
      this.dictionary.SO.length +
        this.dictionary.S.length +
        this.dictionary.P.length,
    ];
    tripleList.forEach((triple) => {
      triple[1] += gaps[1];
      triple[2] += gaps[2];
    });
    this.gaps = gaps;

    var tArray = [];
    tripleList.forEach((triple) => {
      tArray.push(triple[0]);
      tArray.push(triple[1]);
      tArray.push(triple[2]);
    });

    // 100 because its a little big bigger
    tArray.push(this.gaps[2] + this.dictionary.O.length + 100);

    return tArray;
  }

  /**
   * Constructs the array A
   * @param {number[]} tArray
   * @returns {number[]} Array A
   */
  #constructA(tArray) {
    let aArray = Array.from(tArray.keys());
    aArray.pop();
    aArray.sort((a, b) => tArray[a] - tArray[b]);
    return aArray;
  }

  /**
   * Constructs the bitvector D, currently as an number array
   * @param {number[]} tArray
   * @param {number[]} aArray
   * @returns {number[]}
   */
  #constructD(tArray, aArray) {
    let dArray = [];
    let preElement = -1;
    aArray.forEach((element) => {
      if (preElement < tArray[element]) {
        dArray.push(1);
      } else {
        dArray.push(0);
      }
      preElement = tArray[element];
    });
    return dArray;
  }

  /**
   * Constructs the array Psi
   * @param {number[]} aArray
   * @returns {number[]}
   */
  #constructPsi(aArray) {
    let indexArray = Array.from(aArray.keys());
    indexArray.sort((a, b) => aArray[a] - aArray[b]);
    let psi = [];
    aArray.forEach((element) => {
      if (element % 3 === 2) {
        psi.push(indexArray[element - 2]);
      } else {
        psi.push(indexArray[element + 1]);
      }
    });
    return psi;
  }
}
