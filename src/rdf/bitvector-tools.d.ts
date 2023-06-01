export class BitvectorTools {
    static rank(bitvector: any, index: any): number;
    static select(bitvector: any, count: any): any;
}
export class BitVector {
    static rank(index: any): number;
    static select(count: any): any;
    constructor(size: any);
    size: any;
    getBit(index: any): 0 | 1;
    setBit(pos: any): void;
    unsetBit(pos: any): void;
    toString(): any;
}
