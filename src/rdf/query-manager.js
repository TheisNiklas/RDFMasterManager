import { QueryTriple } from "../../src/rdf/models/query-triple";
import { Triple } from "./models/triple";
import { QueryElement } from "./models/query-element";
import { Rdfcsa } from "./rdfcsa";

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
   *
   * @param {Rdfcsa} rdfcsa
   */
  setRdfcsa(rdfcsa) {
    this.rdfcsa = rdfcsa;
  }

  /**
   * Get the triples matching a given `query`
   * @param {QueryTriple[]} queries
   * @returns {Triple[]}
   */
  getTriples(queries) {
    // check if join query
    var resultArray;
    let result = [];
    if (queries.length === 1) {
      const query = queries[0];
      // get number of unbound elements
      resultArray = this.#getQueryTripleResult(query);
      // convert result array to array with triple elements
      resultArray.forEach((triple) => {
        result.push(new Triple(triple[0], triple[1], triple[2]));
      });
      return result;
    }
    // Query is join query
    resultArray = this.#mergeJoin(queries);

    resultArray.forEach((triple) => {
      result.push(new Triple(triple[0], triple[1], triple[2]));
    });
    return result;
  }

  /**
   * Get all triples in psi
   * @returns {Triple[]}
   */
  getAllTriples() {
    // TODO: return all triples
    const tripleList = [];
    for (let i = 0; i < this.rdfcsa.psi.length / 3; i++) {
      // find the next referenced element
      const targetIndex1 = this.rdfcsa.psi[i];
      // find the next referenced element of the next referenced element
      const targetIndex2 = this.rdfcsa.psi[targetIndex1];
      const targetIndex3 = this.rdfcsa.psi[targetIndex2];
      // get id of elements
      const target1 = this.rdfcsa.D.rank(targetIndex1);
      const target2 = this.rdfcsa.D.rank(targetIndex2);
      const target3 = this.rdfcsa.D.rank(targetIndex3);
      // find empty triple index and add found triple to triple list
      tripleList.push([target3, target1, target2]);
    }
    return tripleList;
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
        const target = this.rdfcsa.D.rank(targetIndex);
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
        const target1 = this.rdfcsa.D.rank(targetIndex1);
        const target2 = this.rdfcsa.D.rank(targetIndex2);
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
      const range_start = this.rdfcsa.select(elem);
      const range_end = this.rdfcsa.select(elem + 1) - 1;
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

  // <?y,p1,?x> <?y,p2,o1> <s,p3,?x>
  // <s1,p1,?x> <s2,p2,?x> <?x,p3,o1>

  // <s1,p1,?y> <?x,p2,o2> <?y,p3,?x>
  // <s1,p1,?y> <?y,p3,?x> <?x,p2,o2>

  // step 1 solve: <?s,p,?o>
  // step 2: search for the first query var in first triple -> ?y
  // step 3: execute <?y,p,o> with all results of <?y,p,?x> --> <y!,p2,o1> <y!,p1,o>
  // step 4: search for the second query var in first triple -> ?x
  // step 5: execute <s,p,?x> with all results of <y!,p,?x> --> <y!,p,!x> ------- <!y,p,!x> <!y,p,o> <s,p,!x>

  // <?y,p1,?x> <?y,p2,?x> is this join valid?

  // <?y,p1,o1> <?y,p2,o2>
  // step 1 solve: <?y,p1,o1>
  // step 2: search for the first query var in first triple -> ?y
  // step 3: execute <?y,p2,o2> with all results of <?y,p1,o1> --> <y!,p2,o2>
  // step 4: append all solutions for each results of step3
  leftChainingJoinTwoQueries(queries) {
    let result1;
    result1 = this.#getQueryTripleResult(queries[0]);
    
    // find query var in left triple

    let result2 = [];
    if (queries[0].subject?.isJoinVar && queries[1].subject?.isJoinVar) {
      // Subject subject join
      result1.forEach((resultElem) => {
        const temp = this.getBoundTriple(
          new QueryTriple(new QueryElement(resultElem[0]), queries[1].predicate, queries[1].object)
        );
        if (temp.length === 1) {
          result2.push(temp[0]);
        }
      });
    } else if (queries[0].object?.isJoinVar && queries[1].subject?.isJoinVar) {
      // Object subject join
      result1.forEach((resultElem) => {
        const temp = this.getBoundTriple(
          new QueryTriple(new QueryElement(resultElem[2]), queries[1].predicate, queries[1].object)
        );
        if (temp.length === 1) {
          result2.push(temp[0]);
        }
      });
    } else if (queries[0].object?.isJoinVar && queries[1].object?.isJoinVar) {
      // object object join
      result1.forEach((resultElem) => {
        const temp = this.getBoundTriple(
          new QueryTriple(queries[1].subject, queries[1].predicate, new QueryElement(resultElem[2]))
        );
        if (temp.length === 1) {
          result2.push(temp[0]);
        }
      });
    } else if (queries[0].subject?.isJoinVar && queries[1].object?.isJoinVar) {
      // subject object join
      result1.forEach((resultElem) => {
        const temp = this.getBoundTriple(
          new QueryTriple(queries[1].subject, queries[1].predicate, new QueryElement(resultElem[0]))
        );
        if (temp.length === 1) {
          result2.push(temp[0]);
        }
      });
    }
    const result = [];
    result2.forEach((triple) => {
      result.push(new Triple(triple[0], triple[1], triple[2]));
    });
    return result;
    // TODO: abschließend merge beider results
  }

  rightChainingJoinTwoQueries(queries) {
    return this.leftChainingJoinTwoQueries([queries[1], queries[0]]);
  }

  /**
   * Joins multiple query pattern with the merge join strategy
   * TODO: does not work properly
   * @param {QueryTriple[]} queries
   * @returns {number[][]} result list of triples
   */
  #mergeJoin(queries) {
    //TODO: sortieren nach Join Variablen
    //TODO: Check whether set is faster
    console.log(queries)
    const resultList = [];
    const varAssignmentByQuery = []
    var maxJoinVar = -1;
    var resultVars = []
    var allTriples = []
    var allJoinVars = []
    queries.forEach((query, queryIndex) => {
      varAssignmentByQuery[queryIndex] = [];
      const queryResult = this.#getQueryTripleResult(query);
      allTriples.push(queryResult);
      const queryJoinVars = this.#getJoinVars(query);
      allJoinVars.push(queryJoinVars)
      queryJoinVars.forEach((joinVar, joinIndex) => {
        if(joinVar >= 0) {
          maxJoinVar = Math.max(joinVar, maxJoinVar);
          if (varAssignmentByQuery[queryIndex][joinVar] === undefined) {
            varAssignmentByQuery[queryIndex][joinVar] = new Set();
          }
      }
      });
      const mergeResult =  []
      queryResult.forEach((triple) => {
        queryJoinVars.forEach((joinVar, joinIndex) => {
          if(joinVar >= 0) {
              varAssignmentByQuery[queryIndex][joinVar].add(triple[joinIndex]);
          }
        });
      });
      resultList.push([queryResult, queryJoinVars]);
    });
    console.log(varAssignmentByQuery);
    console.log("MaxJoinVar: " + maxJoinVar)
    for (var i = 0; i <= maxJoinVar; i++) {
      var result1 = varAssignmentByQuery.map(x => x[i]).filter(element => element !== undefined)
      console.log(result1);
      resultVars[i] = new Set(result1.reduce((a, b) => [...a].filter(c => [...b].includes(c))))
      console.log("Variable " + i + ":" + [...resultVars[i]]);
    }

    const resultTriples = new Set();
    for (var i = 0; i < allTriples.length; i++) {
      // console.log(i + "--" + allTriples[i])
      allTriples[i].forEach((triple) => {
        var add = true;
        allJoinVars[i].forEach((joinVar, joinIndex) => {
          if(add && joinVar >= 0 && !resultVars[joinVar].has(triple[joinIndex])) {
            add = false;
          }
        });
        if(add) {
          resultTriples.add(triple);
        }
      });
    }
    return [...resultTriples];
  }

  #getResult(listOfSets) {
    if (listOfSets.length === 0) {
      return new Set();
    }
  
    return listOfSets.reduce((intersectionSet, currentSet) => {
      console.log("CurrentSet:" + currentSet);
      return new Set([...intersectionSet].filter(element => currentSet.has(element)));
    });
  }

  /**
   * calculates for one triple pattern the elements which are join vars
   * @param {QueryTriple} triple the triple pattern of type queryTriple
   * @returns {number[]} array of join variable ids of one Triple -> if id = -1, no join variable; example: [-1,-1,5] -> O is join var
   */
  #getJoinVars(triple) {
    const joinVars = [];
    if (triple.subject && triple.subject.isJoinVar) {
      joinVars.push(triple.subject.id);
    } else {
      joinVars.push(-1);
    }
    if (triple.predicate && triple.predicate.isJoinVar) {
      joinVars.push(triple.predicate.id);
    } else {
      joinVars.push(-1);
    }
    if (triple.object && triple.object.isJoinVar) {
      joinVars.push(triple.object.id);
    } else {
      joinVars.push(-1);
    }
    return joinVars;
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
  #getQueryTripleResult(query) {
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
    switch (countUnbound) {
      case 0:
        return this.getBoundTriple(this.#createNormalQueryFromJoinQuery(query));
      case 1:
        return this.getOneUnboundTriple(this.#createNormalQueryFromJoinQuery(query));
      case 2:
        return this.getTwoUnboundTriple(this.#createNormalQueryFromJoinQuery(query));
      default:
        return this.getAllTriples();
    }
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
