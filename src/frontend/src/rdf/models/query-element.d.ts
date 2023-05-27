export declare class QueryElement {
  id: int | null;
  isJoinVar: bool;
  constructor(id = null, isJoinVar = false) {
    this.id = id;
    this.isJoinVar = isJoinVar;
  }
}
