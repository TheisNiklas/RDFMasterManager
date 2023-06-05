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
  addTripleCase1,
  addTripleCase2,
  tripleList
} from "./fixtures/rdf-operations.test.json";

describe("RdfOperations", () => {
  test("addTriple", () => {
    let rdfcsa = new Rdfcsa(tripleListReduced);
    let ops = new RdfOperations(rdfcsa);
    const res = ops.addTriple("L. DiCaprio", "awarded", "Oscar 2015");
    expect(res.psi).toEqual(resultPsi);
    expect(res.gaps).toEqual(resultGaps);
    expect(res.D).toEqual(resultD);
  });

  test("addTriple: case 1", () => {
    let rdfcsa = new Rdfcsa(JSON.parse(JSON.stringify(tripleList)));
    let ops = new RdfOperations(rdfcsa);
    const res = ops.addTripleNew("Peter", "has", "Home");
    expect(res.psi).toEqual(addTripleCase1.resultPsi);
    expect(res.gaps).toEqual(addTripleCase1.resultGaps);
    expect(res.D).toEqual(addTripleCase1.resultD);
    expect(res.dictionary.SO).toEqual(addTripleCase1.resultDict.SO);
    expect(res.dictionary.S).toEqual(addTripleCase1.resultDict.S);
    expect(res.dictionary.P).toEqual(addTripleCase1.resultDict.P);
    expect(res.dictionary.O).toEqual(addTripleCase1.resultDict.O);
  });

  test("addTriple: case 2", () => {
    let rdfcsa = new Rdfcsa(JSON.parse(JSON.stringify(tripleList)));
    let ops = new RdfOperations(rdfcsa);
    const res = ops.addTripleNew("E. Page", "awarded", "Oscar 2015");
    expect(res.psi).toEqual(addTripleCase2.resultPsi);
    expect(res.gaps).toEqual(addTripleCase2.resultGaps);
    expect(res.D).toEqual(addTripleCase2.resultD);
    expect(res.dictionary.SO).toEqual(addTripleCase2.resultDict.SO);
    expect(res.dictionary.S).toEqual(addTripleCase2.resultDict.S);
    expect(res.dictionary.P).toEqual(addTripleCase2.resultDict.P);
    expect(res.dictionary.O).toEqual(addTripleCase2.resultDict.O);
  });

  test("addTriple: case 1 - compare to Old", () => {
    const addSubject = "Klaus";
    const addPredicate = "appears in";
    const addObject = "Oscar 2015";
    let rdfcsaRef = new Rdfcsa(JSON.parse(JSON.stringify(tripleList)));
    let opsRef = new RdfOperations(rdfcsaRef);
    const resRef = opsRef.addTriple(addSubject, addPredicate, addObject);

    let rdfcsa = new Rdfcsa(JSON.parse(JSON.stringify(tripleList)));
    let ops = new RdfOperations(rdfcsa);
    const res = ops.addTripleNew(addSubject, addPredicate, addObject);
    expect(res.dictionary.SO).toEqual(resRef.dictionary.SO);
    expect(res.dictionary.S).toEqual(resRef.dictionary.S);
    expect(res.dictionary.P).toEqual(resRef.dictionary.P);
    expect(res.dictionary.O).toEqual(resRef.dictionary.O);
    expect(res.gaps).toEqual(resRef.gaps);
    expect(res.D).toEqual(resRef.D);
    expect(res.psi).toEqual(resRef.psi);
  });
  
  test("addTriple: case 1 - two triples", () => {
    const addSubject = "Klaus";
    const addPredicate = "haut";
    const addObject = "raus";
    const addSubject1 = "Peter";
    const addPredicate1 = "has";
    const addObject1 = "Home";
    let rdfcsaRef = new Rdfcsa(JSON.parse(JSON.stringify(tripleList)));
    let opsRef = new RdfOperations(rdfcsaRef);
    const resRef0 = opsRef.addTriple(addSubject, addPredicate, addObject);
    const resRef = opsRef.addTriple(addSubject1, addPredicate1, addObject1);

    let rdfcsa = new Rdfcsa(JSON.parse(JSON.stringify(tripleList)));
    let ops = new RdfOperations(rdfcsa);
    const res0 = ops.addTripleNew(addSubject, addPredicate, addObject);
    const res = ops.addTripleNew(addSubject1, addPredicate1, addObject1);
    expect(res.dictionary.SO).toEqual(resRef.dictionary.SO);
    expect(res.dictionary.S).toEqual(resRef.dictionary.S);
    expect(res.dictionary.P).toEqual(resRef.dictionary.P);
    expect(res.dictionary.O).toEqual(resRef.dictionary.O);
    expect(res.gaps).toEqual(resRef.gaps);
    expect(res.D).toEqual(resRef.D);
    expect(res.psi).toEqual(resRef.psi);
  });

  test("deleteTriple", () => {
    let rdfcsa = new Rdfcsa(tripleListExtended);
    let ops = new RdfOperations(rdfcsa);
    const res = ops.deleteTriple(new Triple(3, 6, 14));
    expect(res.psi).toEqual(resultPsi);
    expect(res.gaps).toEqual(resultGaps);
    expect(res.D).toEqual(resultD);
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
    expect(res.psi).toEqual(resultPsi);
    expect(res.gaps).toEqual(resultGaps);
    expect(res.D).toEqual(resultD);
  });
  test("changeInDictionary", () => {
    let rdfcsa = new Rdfcsa(tripleListTypo);
    let ops = new RdfOperations(rdfcsa);
    const res = ops.changeInDictionary(1, "Inception");
    expect(res.psi).toEqual(resultPsi);
    expect(res.gaps).toEqual(resultGaps);
    expect(res.D).toEqual(resultD);
  });
});
