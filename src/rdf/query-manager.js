import { QueryTriple } from "../../src/rdf/models/query-triple";
import { BitvectorTools } from "./bitvector-tools";
import { Triple } from "./models/triple";

export class QueryManager {
  /**
   * Handles all query directed at the dataset
   * @param {Rdfcsa} rdfcsa
   */

  chosenJoinType = "Merge"
  constructor(rdfcsa) {
    this.rdfcsa = rdfcsa;
  }

  /**
   * Get the triples matching a given `query`
   * @param {QueryTriple[]} queries
   * @returns {Triple[]}
   */
  getTriples(queries) {
    if (queries.length === 1){
      // no join query
      const query = queries[0];
      const countUnboundType = this.#getQueryType(query);
      switch (countUnboundType){
        case 0: 
          return this.getBoundTriple(query);
        case 1:
          return this.getOneUnboundTriple(query);
        case 2:
          return this.getTwoUnboundTriple(query);
        default:
          return this.getAllTriples();
      }
    }
    // Query is join query
    const resultsList = []
    queries.forEach((query) => {
        switch (this.chosenJoinType) {
          case "Merge":
            this.#mergeJoin()
            break;
        
          default:
            break;
        }
      });
  }

  /**
   * 
   * @returns {Triple[]}
   */
  getAllTriples() {
    // TODO: return all triples
    return [];
  }

  /**
   * Queries whether a given fully bound query is in the dataset
   * If true returns the triple in an array, else returns an empty array
   * @param {QueryTriple} query
   * @returns {Triple[]}
   */
  getBoundTriple(query) {
    const pattern = [query.subject.id, query.predicate.id, query.object.id];
    const resultRange = this.#getResultList(pattern);
    if (resultRange.length === 2) {
      if (resultRange[0] === resultRange[1]) {
        const resultTriple = [new Triple(query.subject.id, query.predicate.id, query.object.id)];
        return resultTriple;
      }
    }
    return [];
  }

  /**
   * Queries the dataset for the given query with one unbound element
   * @param {QueryTriple} query
   * @returns {Triple[]} array with the matching triples, empty if none found
   */
  getOneUnboundTriple(query) {
    const pattern = [];
    if (query.subject === null) {
      pattern.push(query.predicate.id);
      pattern.push(query.object.id);
    } else if (query.predicate === null) {
      pattern.push(query.object.id);
      pattern.push(query.subject.id);
    } else if (query.object === null) {
      pattern.push(query.subject.id);
      pattern.push(query.predicate.id);
    }
    const result_range = this.#getResultList(pattern);
    const result = this.#decodeRangeToTriple(result_range, query);
    return result;
  }

  /**
   * Queries the dataset for the given query with two unbound elements
   * @param {QueryTriple} query
   * @returns {Triple[]} array with the matching triples, empty if none found
   */
  getTwoUnboundTriple(query) {
    const pattern = [];
    if (query.subject !== null) {
      pattern.push(query.subject.id);
    } else if (query.predicate !== null) {
      pattern.push(query.predicate.id);
    } else if (query.object !== null) {
      pattern.push(query.object.id);
    }
    const result_range = this.#getResultList(pattern);
    const result = this.#decodeRangeToTriple(result_range, query);
    return result;
  }

  /**
   *
   * @param {number[]} range
   * @param {QueryTriple} query
   */
  #decodeRangeToTriple(range, query) {
    const tripleList = [];
    // is one unbound
    if (
      (query.subject === null && query.predicate !== null && query.object !== null) ||
      (query.subject !== null && query.predicate === null && query.object !== null) ||
      (query.subject !== null && query.predicate !== null && query.object === null)
    ) {
      for (let i = range[0]; i <= range[1]; i++) {
        const targetIndex = this.rdfcsa.psi[this.rdfcsa.psi[i]];
        const target = BitvectorTools.rank(this.rdfcsa.D, targetIndex);
        if (query.subject === null) {
          tripleList.push([target, query.predicate.id, query.object.id]);
        } else if (query.predicate === null) {
          tripleList.push([query.subject.id, target, query.object.id]);
        } else if (query.object === null) {
          tripleList.push([query.subject.id, query.predicate.id, target]);
        }
      }
    }
    // are two unbound
    else if (
      (query.subject === null && query.predicate === null && query.object !== null) ||
      (query.subject === null && query.predicate !== null && query.object === null) ||
      (query.subject !== null && query.predicate === null && query.object === null)
    ) {
      for (let i = range[0]; i <= range[1]; i++) {
        const targetIndex1 = this.rdfcsa.psi[i];
        const targetIndex2 = this.rdfcsa.psi[targetIndex1];

        const target1 = BitvectorTools.rank(this.rdfcsa.D, targetIndex1);
        const target2 = BitvectorTools.rank(this.rdfcsa.D, targetIndex2);
        if (query.subject !== null) {
          tripleList.push([query.subject.id, target1, target2]);
        } else if (query.predicate !== null) {
          tripleList.push([target2, query.predicate.id, target1]);
        } else if (query.object !== null) {
          tripleList.push([target1, target2, query.object.id]);
        }
      }
    }
    return tripleList;
  }

  /**
   *
   * @param {QueryTriple} pattern
   */
  #getResultList(pattern) {
    let ranges = [];

    pattern.forEach((elem) => {
      const range_start = BitvectorTools.select(this.rdfcsa.D, elem);
      const range_end = BitvectorTools.select(this.rdfcsa.D, elem + 1) - 1;
      ranges.push([range_start, range_end]);
    });

    let range = ranges.shift();
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

    return range;
  }

  /**
   *
   * @param {QueryTriple[]} queries
   */
  #mergeJoin(queries) {
    const resultList = [];
    queries.forEach((query) => {
      countUnbound = this.#getQueryType(query);
      switch (countUnboundType){
        case 0: 
          resultList.push(this.getBoundTriple(query));
          break;
        case 1:
          resultList.push(this.getOneUnboundTriple(query));
          break;
        case 2:
          resultList.push(this.getTwoUnboundTriple(query));
          break;
        default:
          resultList.push(this.getAllTriples());
          break;
        }
    });

    var mergedResults  = undefined;
    for (var i = 1; i < resultList.length; i++){
      if (mergedResults === undefined){
        mergedResults = resultList[i]
      }
        // get join variable
        const preJoinVar = this.#getJoinVar(query[i-1]);
        const curJoinVar = this.#getJoinVar(query[i]);
        // compare join variable
        var joinVar = undefined;
        for (var i = 0; i < curJoinVar.length; i++){
          if (curJoinVar[i] >= 0 && joinVar === undefined){
              switch (i) {
                case 0:
                  if (curJoinVar[i] === preJoinVar[0]){
                  joinVar = "S";
                  }
                  else if (curJoinVar[i] === preJoinVar[2]){
                    joinVar = "SO";
                  }
                  break;
                case 1:
                  if (curJoinVar[i] === preJoinVar[1]){
                    joinVar = "P";
                  }
                  break;
                case 2:
                  if (curJoinVar[i] === preJoinVar[0]){
                    joinVar = "OS";
                  }
                  else if (curJoinVar[i] === preJoinVar[2]){
                    joinVar = "O";
                  }
                  break;
                default:
                  break;
              }
            
          }
        }
        // get merged results
        mergedResults = this.#intersectTwoResultLists(mergedResults, resultList[i], joinVar);
      }
      return mergedResults;
  }

  #getJoinVar(query){
    const joinVar = []
        if (previous.subject.isJoinVar){
          joinVar.push(previous.subject.id);
        }
        else {
          joinVar.push(-1);
        }
        if (previous.predicate.isJoinVar){
          joinVar.push(previous.predicate.id);
        }
        else {
          joinVar.push(-1);
        }
        if (previous.object.isJoinVar){
          joinVar.push(previous.object.id);
        }
        else {
          joinVar.push(-1);
        }
        return joinVar;
  }

  /**
   * 
   * @param {Triple[]} l1 
   * @param {Triple[]} l2 
   * @param {string} joinElement:
   *    S: Join on subject
   *    P: Join on predicate
   *    O: Join on Object
   *    SO: Join Subject of `l1` on Object of `l2`
   *    OS: Join Object of `l1` on Subject of `l2`
   */
  #intersectTwoResultLists(l1, l2, joinElement) {
    const resultList = [];
    switch (joinElement) {
      case "S":
        l1.forEach((triple1) => {
          l2.forEach((triple2, index) => {
            if (triple2.subject === triple1.subject) {
              resultList.push(triple1)
              resultList.push(triple2)
              // CHECK: pop of triple2 from l2 faster, to reduce nessecary iterations
            }
          })
        })
        break;
      case "P":
        l1.forEach((triple1) => {
          l2.forEach((triple2) => {
            if (triple2.predicate === triple1.predicate) {
              resultList.push(triple1)
              resultList.push(triple2)
            }
          })
        })
        break;
      case "O":
        l1.forEach((triple1) => {
          l2.forEach((triple2) => {
            if (triple2.object === triple1.object) {
              resultList.push(triple1)
              resultList.push(triple2)
            }
          })
        })
        break;
      case "SO":
        l1.forEach((triple1) => {
          l2.forEach((triple2) => {
            if (triple2.object === triple1.subject){
              resultList.push(triple1)
              resultList.push(triple2)
            }
          })
        });
        break;
      case "OS":
        l1.forEach((triple1) => {
          l2.forEach((triple2) => {
            if (triple2.subject === triple1.object) {
              resultList.push(triple1)
              resultList.push(triple2)
            }
          })
        })
    }
    return resultList;
  }

    /**
   *
   * @param {QueryTriple} query
   * @returns {number}
   */
  #getQueryType(query) {
    var countUnbound = 0;
    // evaluate subject
    if (query.subject === null || query.subject.isJoinVar) {
      countUnbound += 1;
      }
    // evaluate predicate
    if (query.predicate === null || query.predicate.isJoinVar) {
      countUnbound += 1;
    }
    // evaluate object
    if (query.object === null || query.object.isJoinVar) {
      countUnbound += 1;
    }
    return countUnbound;
  }
}
