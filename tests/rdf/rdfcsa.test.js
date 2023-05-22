import { Rdfcsa } from "../../src/rdf/rdfcsa";
import { tripleList, resultPsi, resultGaps, resultD } from "./fixtures/rdfcsa.test.json";

describe("Rdfcsa", () => {
  test("init", () => {
    let rdfcsa = new Rdfcsa(tripleList);
    expect(rdfcsa.psi).toEqual(resultPsi);
    expect(rdfcsa.gaps).toEqual(resultGaps);
    expect(rdfcsa.D).toEqual(resultD);
  });
});
