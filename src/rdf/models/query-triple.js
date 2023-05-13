class QueryTriple {
  /**
   *
   * @param {QueryElement | null} subject
   * @param {QueryElement | null} predicate
   * @param {QueryElement | null} object
   */
  constructor(subject = null, predicate = null, object = null) {
    this.subject = subject;
    this.predicate = predicate;
    this.object = object;
  }
}
