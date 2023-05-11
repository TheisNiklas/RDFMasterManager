import { Dictionary } from './dictionary'

export class Rdfcsa {
  constructor() {
    this.dictionary = new Dictionary();
    this.Tid = [];
    this.T = [];

  }

  /**
   * 
   * @param {string[][]} tripleList 
   */
  constructTid(tripleList) {
    var tidArray = []
    this.dictionary.createDictionaries(tripleList);
    tripleList.forEach((triple) => {
      triple[0] = this.dictionary.getIdBySubject(triple[0]);
      triple[1] = this.dictionary.getIdByPredicate(triple[1]);
      triple[2] = this.dictionary.getIdByObject(triple[2]);
    })
    tripleList.sort();
    tripleList.forEach((triple) => {
      tidArray.push(triple[0]);
      tidArray.push(triple[1]);
      tidArray.push(triple[2]);
    })
    this.Tid = tidArray;
  }

  constructT(tid){
    gaps = [0, this.dictionary.SO.length + this.dictionary.S.length, this.dictionary.SO.length + this.dictionary.S.length + this.dictionary.P.length]
    tid.forEach((triple) => {
      triple[1] = triple[1] + gaps[1]
      triple[2] = triple[2] + gaps[2]
    })
  }

}