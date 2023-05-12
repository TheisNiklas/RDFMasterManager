import { Dictionary } from "./dictionary";

export class Rdfcsa {
  constructor() {
    this.dictionary = new Dictionary();
    this.Tid = [];
    this.T = [];
    this.gaps = [];
  }

  /**
   * Constructs the array Tid and T from the tipleList
   * @param {string[][]} tripleList
   */
  constructTArrays(tripleList) {
    var tidArray = [];
    this.dictionary.createDictionaries(tripleList);
    tripleList.forEach((triple) => {
      triple[0] = this.dictionary.getIdBySubject(triple[0]);
      triple[1] = this.dictionary.getIdByPredicate(triple[1]);
      triple[2] = this.dictionary.getIdByObject(triple[2]);
    });
    tripleList.sort();

    this.#constructT(JSON.parse(JSON.stringify(tripleList)));

    tripleList.forEach((triple) => {
      tidArray.push(triple[0]);
      tidArray.push(triple[1]);
      tidArray.push(triple[2]);
    });
    this.Tid = tidArray;
  }

  /**
   *
   * @param {Number[][]} tid
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
    this.T = tArray;
    // 100 because its a little big bigger
    this.T.push(this.gaps[2] + this.dictionary.O.length + 100);
  }

  #constructA(tArray){
    aArray = Array.from(tArray.keys());
    aArray.pop();
    aArray.sort((a,b) => tArray[a] - tArray[b]);
    this.A = aArray;
  }

  #constructD(tArray, aArray){
    dArray = []
    preElement = -1
    aArray.forEach((element) => {
        if(preElement < tArray[element]){
          dArray.push(1);
        }
        else{
          dArray.push(0);
        }
      preElement = tArray[element];
    })
  }

  #constructSuffixArray(aArray){
    array = Array.from(aArray.keys());
    array.sort((a,b) => aArray[a] - aArray[b]);
    suffixArray = [];
    aArray.forEach((element) => {
      if(element % 3 === 2){
        suffixArray.push(array[element - 2]);
      }
      else{
        suffixArray.push(array[element + 1]);
      }
    })
  }
}
