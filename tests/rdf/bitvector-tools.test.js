import { BitvectorTools } from "../../src/rdf/bitvector-tools";

describe("BirVectorTools", () => {
  const bitVector = [0, 1, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 1];
  test("rank(0)", () => {
    const result = BitvectorTools.rank(bitVector, 0);
    expect(result).toEqual(0);
  });
  test("rank(6)", () => {
    const result = BitvectorTools.rank(bitVector, 6);
    expect(result).toEqual(2);
  });
  test("rank(12)", () => {
    const result = BitvectorTools.rank(bitVector, 12);
    expect(result).toEqual(6);
  });
  test("select(0)", () => {
    const result = BitvectorTools.select(bitVector, 0);
    expect(result).toEqual(0);
  });
  test("select(4)", () => {
    const result = BitvectorTools.select(bitVector, 4);
    expect(result).toEqual(8);
  });
  test("select(6)", () => {
    const result = BitvectorTools.select(bitVector, 6);
    expect(result).toEqual(12);
  });
});
