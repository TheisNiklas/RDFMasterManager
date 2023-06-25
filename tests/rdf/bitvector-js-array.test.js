import { BitVectorJsArray } from "../../src/rdf/bitvector-js-array";

describe("BitvectorJsArray", () => {
  let bitvector;
  beforeEach(() => {
    bitvector = new BitVectorJsArray([0, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1]);
  });
  test("rank(0)", () => {
    const result = bitvector.rank(0);
    expect(result).toEqual(0);
  });
  test("rank(6)", () => {
    const result = bitvector.rank(6);
    expect(result).toEqual(2);
  });
  test("rank(12)", () => {
    const result = bitvector.rank(12);
    expect(result).toEqual(6);
  });
  test("select(0)", () => {
    const result = bitvector.select(0);
    expect(result).toEqual(0);
  });
  test("select(4)", () => {
    const result = bitvector.select(4);
    expect(result).toEqual(8);
  });
  test("select(6)", () => {
    const result = bitvector.select(6);
    expect(result).toEqual(12);
  });

  test("push bit (1)", () => {
    bitvector.pushBit(1);
    expect(bitvector.bits).toEqual([0, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1]);
  });

  test("add zero bit at index 3", () => {
    bitvector.addBit(3);
    expect(bitvector.bits).toEqual([0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1]);
  });

  test("delete bit at index 11", () => {
    bitvector.deleteBit(11);
    expect(bitvector.bits).toEqual([0, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1]);
  });

  test("set bit at index ", () => {
    bitvector.setBit(5);
    expect(bitvector.bits).toEqual([0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1, 1]);
  });
});
