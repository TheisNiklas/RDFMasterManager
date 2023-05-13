import { QueryTriple } from "models/query-triple";

class QueryManager {
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
    const result_range = this.#getResultList(pattern);
    if (result_range.length === 1) {
      const resultTriple = [
        Triple(query.subject.id, query.predicate.id, query.object.id),
      ];
      return resultTriple;
    }
    return [];
  }

  /**
   *
   * @param {QueryTriple} pattern
   */
  #getResultList(pattern) {
    // [0,9,12] [0,9]
    let ranges = [];

    pattern.forEach((elem) => {
      range_start = BitvectorTools.select(this.rdfcsa.D, elem);
      range_end = BitvectorTools.select(this.rdfcsa.D, elem) - 1;
      ranges.push([range_start, range_end]);
    });

    let range = ranges.shift();
    ranges.forEach((range) => {
      let new_range = [];
      for (let i = range[0]; i <= range[1]; i++) {
        const val = this.rdfcsa.psi[i];
        if (val >= range[index + 1][0] && val <= range[index + 1][1]) {
          new_range.push(val);
        }
      }
      if (new_range.length === 0) {
        return null;
      }
      range = new_range;
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
