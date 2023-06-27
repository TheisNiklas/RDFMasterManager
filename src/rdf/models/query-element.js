/**
 * Contributions made by:
 * Niklas Theis
 * Tobias Kaps
 */

export class QueryElement {
  /**
   * @param {number | null} id
   * @param {boolean} isJoinVar
   */
  constructor(id = null, isJoinVar = false) {
    this.id = id;
    this.isJoinVar = isJoinVar;
  }
}
