import { Rdfcsa } from "../../src/rdf/rdfcsa";
import { RdfcsaNew } from "../../src/rdf/rdfcsa-new";
import { tripleList, resultPsi, resultGaps, resultD } from "./fixtures/rdfcsa.test.json";

describe("Rdfcsa", () => {
  test("init", () => {
    let rdfcsa = new Rdfcsa(tripleList);
    expect(rdfcsa.psi).toEqual(resultPsi);
    expect(rdfcsa.gaps).toEqual(resultGaps);
    expect(rdfcsa.D).toEqual(resultD);
  });
  
  test("init new", () => {
    let rdfcsa = new RdfcsaNew(tripleList);
    expect(rdfcsa.psi).toEqual(resultPsi);
    expect(rdfcsa.gaps).toEqual(resultGaps);
    expect(rdfcsa.D).toEqual(resultD);
  });
});
