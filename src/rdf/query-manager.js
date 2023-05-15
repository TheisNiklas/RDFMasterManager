import { QueryTriple } from "../../src/rdf/models/query-triple";
import { BitvectorTools } from "./bitvector-tools";
import { Triple } from "./models/triple";

export class QueryManager {
  /**
   *
   * @param {Rdfcsa} rdfcsa
   */
  constructor(rdfcsa) {
    this.rdfcsa = rdfcsa;
  }

  /**
   *
   * @param {QueryTriple[]} query
   */
  getTriples(query) {
    query.forEach((pattern) => {
      this.#getResultList(pattern);
    });
  }

  getBoundTriple(query) {
    const pattern = [query.subject.id, query.predicate.id, query.object.id];
    const resultRange = this.#getResultList(pattern);
    if (resultRange.length === 2) {
      if (resultRange[0] === resultRange[1]) {
        const resultTriple = [
          new Triple(query.subject.id, query.predicate.id, query.object.id),
        ];
        return resultTriple;
      }
    }
    return [];
  }

  /**
   *
   * @param {QueryTriple} query
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
   *
   * @param {QueryTriple} query
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
      (query.subject === null &&
        query.predicate !== null &&
        query.object !== null) ||
      (query.subject !== null &&
        query.predicate === null &&
        query.object !== null) ||
      (query.subject !== null &&
        query.predicate !== null &&
        query.object === null)
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
      (query.subject === null &&
        query.predicate === null &&
        query.object !== null) ||
      (query.subject === null &&
        query.predicate !== null &&
        query.object === null) ||
      (query.subject !== null &&
        query.predicate === null &&
        query.object === null)
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

    // const range_subject_start = BitvectorTools.select(this.rdfcsa.D, pattern.subject.id);           // 0
    // const range_subject_end = BitvectorTools.select(this.rdfcsa.D, pattern.subject.id + 1) - 1;     // 0

    // const range_predicate_start = BitvectorTools.select(this.rdfcsa.D, pattern.predicate.id);       // 18
    // const range_predicate_end = BitvectorTools.select(this.rdfcsa.D, pattern.predicate.id + 1) - 1; // 18

    // const range_object_start = BitvectorTools.select(this.rdfcsa.D, pattern.object.id);             // 23
    // const range_object_end = BitvectorTools.select(this.rdfcsa.D, pattern.object.id + 1) - 1;       // 24

    // for (let i = range_subject_start; i <= range_subject_end; i++) {
    //   const val = this.rdfcsa.psi[i]
    //   if (val >= range_predicate_start && val <= range_predicate_end) {
    //     range.push(val);
    //   }
    // }
    // if (range.length === 0) {
    //   return null
    // }
    // range.forEach((index) => {
    //   if (this.rdfcsa.psi[index] > range_object_start && this.rdfcsa.psi[index] > range_object_end) {
    //     return true
    //   }
    // })
    // return null
  }
}
