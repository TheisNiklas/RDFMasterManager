import { queries } from "@testing-library/react";
import { QueryTriple } from "../../src/rdf/models/query-triple";
import { BitvectorTools } from "./bitvector-tools";
import { Triple } from "./models/triple";

export class QueryManager {
  /**
   * Handles all query directed at the dataset
   * @param {Rdfcsa} rdfcsa
   */

  chosenJoinType = "Merge";
  constructor(rdfcsa) {
    this.rdfcsa = rdfcsa;
  }

  /**
   * Get the triples matching a given `query`
   * @param {QueryTriple[]} queries
   * @returns {Triple[]}
   */
  getTriples(queries) {
    // check if join query
    if (queries.length === 1) {
      const query = queries[0];
      // get number of unbound elements
      const countUnboundType = this.#getQueryType(query);
      var resultArray;
      let result = [];
      switch (countUnboundType) {
        case 0:
          resultArray = this.getBoundTriple(query);
          break;
        case 1:
          resultArray = this.getOneUnboundTriple(query);
          break;
        case 2:
          resultArray = this.getTwoUnboundTriple(query);
          break;
        default:
          resultArray = this.getAllTriples();
          break;
      }
      // convert result array to array with triple elements
      resultArray.forEach((triple) => {
        result.push(new Triple(triple[0], triple[1], triple[2]));
      })
      return result;
    }
    // Query is join query
    return this.#mergeJoin(queries);
  }

  /**
   * Get all triples in psi
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
   * @returns {number[][]}
   */
  getBoundTriple(query) {
    const pattern = [query.subject.id, query.predicate.id, query.object.id];
    const resultRange = this.#getResultList(pattern);
    if (resultRange.length === 2) {
      if (resultRange[0] === resultRange[1]) {
        const resultTriple = [[query.subject.id, query.predicate.id, query.object.id]];
        return resultTriple;
      }
    }
    return [];
  }

  /**
   * Queries the dataset for the given query with one unbound element
   * @param {QueryTriple} query
   * @returns {number[][]} array with the matching triples, empty if none found
   */
  getOneUnboundTriple(query) {
    const pattern = [];
    // check which element is unbound (=== null)
    // push bound elements in right order (starting by unbound element) into pattern array
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
    // get result range (left and right border of first bound element)
    const result_range = this.#getResultList(pattern);
    // get triples based on result range
    const result = this.#decodeRangeToTriple(result_range, query);
    return result;
  }

  /**
   * Queries the dataset for the given query with two unbound elements
   * @param {QueryTriple} query
   * @returns {number[][]} array with the matching triples, empty if none found
   */
  getTwoUnboundTriple(query) {
    const pattern = [];
    // check which element is bound (!== null)
    // push bound element into pattern array
    if (query.subject !== null) {
      pattern.push(query.subject.id);
    } else if (query.predicate !== null) {
      pattern.push(query.predicate.id);
    } else if (query.object !== null) {
      pattern.push(query.object.id);
    }
    // get result range (left and right border of bound element)
    const result_range = this.#getResultList(pattern);
    // get triples based on result range
    const result = this.#decodeRangeToTriple(result_range, query);
    return result;
  }

  /**
   * Decodes a range of indizes in the rdfcsa to the triples that are linked to these elements
   * @param {number[]} range
   * @param {QueryTriple} query
   * @returns {number[][]}
   */
  #decodeRangeToTriple(range, query) {
    const tripleList = [];
    // Check if one unbound
    if (
      (query.subject === null && query.predicate !== null && query.object !== null) ||
      (query.subject !== null && query.predicate === null && query.object !== null) ||
      (query.subject !== null && query.predicate !== null && query.object === null)
    ) {
      // iterate over range
      for (let i = range[0]; i <= range[1]; i++) {
        // find the next referenced element
        const targetIndex = this.rdfcsa.psi[this.rdfcsa.psi[i]];
        // get id of referenced element
        const target = BitvectorTools.rank(this.rdfcsa.D, targetIndex);
        // find empty triple index and add found triple to triple list
        if (query.subject === null) {
          tripleList.push([target, query.predicate.id, query.object.id]);
        } else if (query.predicate === null) {
          tripleList.push([query.subject.id, target, query.object.id]);
        } else if (query.object === null) {
          tripleList.push([query.subject.id, query.predicate.id, target]);
        }
      }
    }
    // Check if two unbound
    else if (
      (query.subject === null && query.predicate === null && query.object !== null) ||
      (query.subject === null && query.predicate !== null && query.object === null) ||
      (query.subject !== null && query.predicate === null && query.object === null)
    ) {
      // iterate over range
      for (let i = range[0]; i <= range[1]; i++) {
        // find the next referenced element
        const targetIndex1 = this.rdfcsa.psi[i];
        // find the next referenced element of the next referenced element
        const targetIndex2 = this.rdfcsa.psi[targetIndex1];
        // get id of elements
        const target1 = BitvectorTools.rank(this.rdfcsa.D, targetIndex1);
        const target2 = BitvectorTools.rank(this.rdfcsa.D, targetIndex2);
        // find empty triple index and add found triple to triple list
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
   * Finds the range of indizes in the rdfcsa which match a given `pattern`
   * @param {QueryTriple} pattern
   * @returns {number[]} array with start and end of indizes range
   */
  #getResultList(pattern) {
    let ranges = [];

    //Calculate ranges where each pattern elements are inside the rdfcsa
    pattern.forEach((elem) => {
      const range_start = BitvectorTools.select(this.rdfcsa.D, elem);
      const range_end = BitvectorTools.select(this.rdfcsa.D, elem + 1) - 1;
      ranges.push([range_start, range_end]);
    });

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

    return range;
  }

  /**
   * Joins multiple query pattern with the merge join strategy
   * TODO: does not work properly
   * @param {QueryTriple[]} queries
   * @returns {number[][]} result list of triples
   */
  #mergeJoin(queries) {
    //TODO: sortieren nach Join Variablen
    const patternResults = [];
    queries.forEach((query) => {
      const countUnboundType = this.#getQueryType(query);
      switch (countUnboundType) {
        case 0:
          patternResults.push(this.getBoundTriple(this.#createNormalQueryFromJoinQuery(query)));
          break;
        case 1:
          patternResults.push(this.getOneUnboundTriple(this.#createNormalQueryFromJoinQuery(query)));
          break;
        case 2:
          patternResults.push(this.getTwoUnboundTriple(this.#createNormalQueryFromJoinQuery(query)));
          break;
        default:
          patternResults.push(this.getAllTriples());
          break;
      }
    });



    var mergedResults = undefined;
    if (patternResults.length > 0) {
      mergedResults = patternResults[0];
    }
    for (var i = 1; i < patternResults.length; i++) {
      // get join variable  ((?x, p1, o1)x(?y, p2, o2)x(?x, p3, ?y),
      //                     (?x, p1, ?y)x(?y, p2, o2)x(?x, p3, o1)x(?y, p1, o4))
      const preJoinVar = this.#getJoinVar(queries[i - 1]); // TODO: noch nicht richtig (Überprüfung aller vorherigen Arrays)
      const curJoinVar = this.#getJoinVar(queries[i]);
      // compare join variable
      var joinVar = undefined;
      for (var j = 0; j < curJoinVar.length; j++) {
        if (curJoinVar[j] >= 0 && joinVar === undefined) {
          switch (j) {
            case 0:
              if (curJoinVar[j] === preJoinVar[0]) {
                joinVar = "S";
              } else if (curJoinVar[j] === preJoinVar[2]) {
                joinVar = "SO";
              }
              break;
            case 2:
              if (curJoinVar[j] === preJoinVar[0]) {
                joinVar = "OS";
              } else if (curJoinVar[j] === preJoinVar[2]) {
                joinVar = "O";
              }
              break;
            default:
              break;
          }
        }
      }
      // get merged results
      mergedResults = this.#intersectTwoResultLists(mergedResults, patternResults[i], joinVar);
    }
    return mergedResults;
  }

  #getMergeType(query1, query2, varId) {
    if (query1.subject?.id === varId && query2.subject?.id === varId) {
      return "S"
    }
    if (query1.object?.id === varId && query2.object?.id === varId) {
      return "O"
    }
    if (query1.subject?.id === varId && query2.object?.id === varId) {
      return "SO"
    }
    if (query1.object?.id === varId && query2.subject?.id === varId) {
      return "OS"
    }
    // Error, should not be reachable
  }

  /**
   * 
   * @param {QueryTriple[]} queries 
   * @param {*} patternResults 
   */
  #prepairMerge(queries, patternResults) {
    const varGroups = this.#groupQueries(queries);
    varGroups.forEach((varGroup) => {
      for (let index = 0; index < varGroup.length; index++) {
        const i = varGroup[index]
        const mergeType = this.#getMergeType(queries[i], queries[i + 1])
        this.#intersectTwoResultListsInplace(patternResults[i], patternResults[i + 1], mergeType);
        
      }
      varGroup.forEach((patternIndex, index) => {
        
      })
    })
  }

  /**
   * Intersects two given lists with triples by the in `joinElement` element.
   * The resulting list contains the matching triples from both lists
   * @param {Triple[]} l1
   * @param {Triple[]} l2
   * @param {string} joinElement:
   *    S: Join on subject
   *    O: Join on Object
   *    SO: Join Subject of `l1` on Object of `l2`
   *    OS: Join Object of `l1` on Subject of `l2`
   */
  #intersectTwoResultListsInplace(l1, l2, joinElement) {
    const result1 = [];
    const result2 = [];
    switch (joinElement) {
      case "S":
        l1.forEach((triple1) => {
          l2.forEach((triple2) => {
            if (triple2.subject === triple1.subject) {
              result1.push(triple1);
              result2.push(triple2);
            }
          });
        });
        break;
      case "O":
        l1.forEach((triple1) => {
          l2.forEach((triple2) => {
            if (triple2.object === triple1.object) {
              result1.push(triple1);
              result2.push(triple2);
            }
          });
        });
        break;
      case "SO":
        l1.forEach((triple1) => {
          l2.forEach((triple2) => {
            if (triple2.object === triple1.subject) {
              result1.push(triple1);
              result2.push(triple2);
            }
          });
        });
        break;
      case "OS":
        l1.forEach((triple1) => {
          l2.forEach((triple2) => {
            if (triple2.subject === triple1.object) {
              result1.push(triple1);
              result2.push(triple2);
            }
          });
        });
    }
    l1 = result1;
    l2 = result2;
    return [result1, result2];
  }

  /**
   * Group the queries by contained variables
   * @param {QueryTriple[]} queries 
   */
  #groupQueries(queries) {
    let varMapping = [];
    queries.forEach((query, index) => {
      if (query.subject?.isJoinVar) {
        if (varMapping.length <= query.subject.id) {
          varMapping.push([]);
        }
        varMapping[query.subject.id].push(index);
      }
      if (query.object?.isJoinVar) {
        if (varMapping.length <= query.object.id) {
          varMapping.push([]);
        }
        varMapping[query.object.id].push(index);
      }
    })
    return varMapping;
  }

  /**
   * calculates for one triple pattern the elements which are join vars
   * @param {QueryTriple} triple the triple pattern of type queryTriple
   * @returns {number[]} array of join variable ids of one Triple -> if id = -1, no join variable; example: [-1,-1,5] -> O is join var
   */
  #getJoinVar(triple) {
    const joinVar = [];
    if (triple.subject.isJoinVar) {
      joinVar.push(triple.subject.id);
    } else {
      joinVar.push(-1);
    }
    if (triple.predicate.isJoinVar) {
      joinVar.push(triple.predicate.id);
    } else {
      joinVar.push(-1);
    }
    if (triple.object.isJoinVar) {
      joinVar.push(triple.object.id);
    } else {
      joinVar.push(-1);
    }
    return joinVar;
  }

  /**
   * Intersects two given lists with triples by the in `joinElement` element.
   * The resulting list contains the matching triples from both lists
   * @param {Triple[]} l1
   * @param {Triple[]} l2
   * @param {string} joinElement:
   *    S: Join on subject
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
              resultList.push(triple1);
              resultList.push(triple2);
              // CHECK: pop of triple2 from l2 faster, to reduce nessecary iterations
            }
          });
        });
        break;
      case "O":
        l1.forEach((triple1) => {
          l2.forEach((triple2) => {
            if (triple2.object === triple1.object) {
              resultList.push(triple1);
              resultList.push(triple2);
            }
          });
        });
        break;
      case "SO":
        l1.forEach((triple1) => {
          l2.forEach((triple2) => {
            if (triple2.object === triple1.subject) {
              resultList.push(triple1);
              resultList.push(triple2);
            }
          });
        });
        break;
      case "OS":
        l1.forEach((triple1) => {
          l2.forEach((triple2) => {
            if (triple2.subject === triple1.object) {
              resultList.push(triple1);
              resultList.push(triple2);
            }
          });
        });
    }
    return resultList;
  }

  /**
   * calculates the query type of one queryTriple
   * 0: triple is bound
   * 1: one element is unbound or join var
   * 2: two elements are unbound or join var
   * 3: three elements are unbound or join var
   * @param {QueryTriple} query
   * @returns {number} possible choices are 0,1,2,3
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

  /**
   * function creates a new query from a given one and sets all
   * triplElements who are join vars to null
   * @param {QueryTriple} query
   * @returns {QueryTriple}
   */
  #createNormalQueryFromJoinQuery(query) {
    const queryTriple = JSON.parse(JSON.stringify(query));
    if (queryTriple.subject !== null && queryTriple.subject.isJoinVar) {
      queryTriple.subject = null;
    }
    if (queryTriple.object !== null && queryTriple.object.isJoinVar) {
      queryTriple.object = null;
    }
    return queryTriple;
  }
}
