import { Triple } from "../../src/rdf/models/triple";
import { RdfOperations } from "../../src/rdf/rdf-operations";
import { Rdfcsa } from "../../src/rdf/rdfcsa";
import {
  tripleListReduced,
  resultD,
  resultPsi,
  resultGaps,
  tripleListExtended,
  tripleListModified,
  tripleListForDeleteInDict,
  tripleListTypo,
} from "./fixtures/rdf-operations.test.json";

describe("RdfOperations", () => {
  test("addTriple", () => {
    let rdfcsa = new Rdfcsa(tripleListReduced);
    let ops = new RdfOperations(rdfcsa);
    const res = ops.addTriple("L. DiCaprio", "awarded", "Oscar 2015");
    expect(res?.psi).toEqual(resultPsi);
    expect(res?.gaps).toEqual(resultGaps);
    expect(res?.D).toEqual(resultD);
  });
  test("deleteTriple", () => {
    let rdfcsa = new Rdfcsa(tripleListExtended);
    let ops = new RdfOperations(rdfcsa);
    const res = ops.deleteTriple(new Triple(3, 6, 14));
    expect(res?.psi).toEqual(resultPsi);
    expect(res?.gaps).toEqual(resultGaps);
    expect(res?.D).toEqual(resultD);
  });
  test("modifyTriple", () => {
    let rdfcsa = new Rdfcsa(tripleListModified);
    let ops = new RdfOperations(rdfcsa);
    const res = ops.modifyTriples(new Triple(3, 10, 12), "J. Gordon", "appears in", "Inception");
    expect(res.psi).toEqual(resultPsi);
    expect(res.gaps).toEqual(resultGaps);
    expect(res.D).toEqual(resultD);
  });
  test("deleteElementInDict", () => {
    let rdfcsa = new Rdfcsa(tripleListForDeleteInDict);
    let ops = new RdfOperations(rdfcsa);
    const res = ops.deleteElementInDictionary(10);
    expect(res?.psi).toEqual(resultPsi);
    expect(res?.gaps).toEqual(resultGaps);
    expect(res?.D).toEqual(resultD);
  });
  test("changeInDictionary", () => {
    let rdfcsa = new Rdfcsa(tripleListTypo);
    let ops = new RdfOperations(rdfcsa);
    const res = ops.changeInDictionary(1, "Inception");
    expect(res?.psi).toEqual(resultPsi);
    expect(res?.gaps).toEqual(resultGaps);
    expect(res?.D).toEqual(resultD);
  });
});
