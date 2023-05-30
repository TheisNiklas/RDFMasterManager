export declare class QueryElement {
  id: int | null;
  isJoinVar: boolean;
  constructor(id: number | null = null, isJoinVar: boolean = false) {
    this.id = id;
    this.isJoinVar = isJoinVar;
  }
}
