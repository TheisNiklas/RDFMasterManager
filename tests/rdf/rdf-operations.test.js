import { Triple } from "../../src/rdf/models/triple";
import { RdfOperations } from "../../src/rdf/rdf-operations";
import { Rdfcsa } from "../../src/rdf/rdfcsa";
import { dataset } from "./fixtures/50k-dataset.json";
import { dataset_1k } from "./fixtures/1k-dataset.json";
import {
  tripleListReduced,
  resultD,
  resultPsi,
  resultGaps,
  tripleListExtended,
  tripleListModified,
  tripleListForDeleteInDict,
  tripleListForDeleteInDict1,
  tripleListTypo,
  addTripleCase1,
  addTripleCase2,
  addTripleCase4,
  tripleList,
} from "./fixtures/rdf-operations.test.json";

describe("RdfOperations", () => {
  test("addTriple", () => {
    let rdfcsa = new Rdfcsa(tripleListReduced);
    let ops = new RdfOperations(rdfcsa);
    const res = ops.addTripleOld("L. DiCaprio", "awarded", "Oscar 2015");
    expect(res.psi).toEqual(resultPsi);
    expect(res.gaps).toEqual(resultGaps);
    expect(res.D.toString()).toEqual(resultD);
  });

  test("addTriple: case 1", () => {
    let rdfcsa = new Rdfcsa(JSON.parse(JSON.stringify(tripleList)));
    let ops = new RdfOperations(rdfcsa);
    const res = ops.addTriple("Peter", "has", "Home");
    expect(res.psi).toEqual(addTripleCase1.resultPsi);
    expect(res.gaps).toEqual(addTripleCase1.resultGaps);
    expect(res.D.toString()).toEqual(addTripleCase1.resultD);
    expect(res.dictionary.SO).toEqual(addTripleCase1.resultDict.SO);
    expect(res.dictionary.S).toEqual(addTripleCase1.resultDict.S);
    expect(res.dictionary.P).toEqual(addTripleCase1.resultDict.P);
    expect(res.dictionary.O).toEqual(addTripleCase1.resultDict.O);
  });

  test("addTriple: case 2", () => {
    let rdfcsa = new Rdfcsa(JSON.parse(JSON.stringify(tripleList)));
    let ops = new RdfOperations(rdfcsa);
    const res = ops.addTriple("E. Page", "awarded", "Oscar 2015");
    expect(res.psi).toEqual(addTripleCase2.resultPsi);
    expect(res.gaps).toEqual(addTripleCase2.resultGaps);
    expect(res.D.toString()).toEqual(addTripleCase2.resultD);
    expect(res.dictionary.SO).toEqual(addTripleCase2.resultDict.SO);
    expect(res.dictionary.S).toEqual(addTripleCase2.resultDict.S);
    expect(res.dictionary.P).toEqual(addTripleCase2.resultDict.P);
    expect(res.dictionary.O).toEqual(addTripleCase2.resultDict.O);
  });

  test("addTriple: case 4 - compare to Old", () => {
    const addSubject = "Inception";
    const addPredicate = "city of";
    const addObject = "J. Gordon";
    let rdfcsaRef = new Rdfcsa(JSON.parse(JSON.stringify(tripleList)));
    let opsRef = new RdfOperations(rdfcsaRef);
    const resRef = opsRef.addTripleOld(addSubject, addPredicate, addObject);

    let rdfcsa = new Rdfcsa(JSON.parse(JSON.stringify(tripleList)));
    let ops = new RdfOperations(rdfcsa);
    const res = ops.addTriple(addSubject, addPredicate, addObject);
    expect(res.dictionary.SO).toEqual(resRef.dictionary.SO);
    expect(res.dictionary.S).toEqual(resRef.dictionary.S);
    expect(res.dictionary.P).toEqual(resRef.dictionary.P);
    expect(res.dictionary.O).toEqual(resRef.dictionary.O);
    expect(res.gaps).toEqual(resRef.gaps);
    expect(res.D).toEqual(resRef.D);
    expect(res.psi).toEqual(resRef.psi);
  });

  test("addTriple: case 4 - failing if subject is new", () => {
    const addSubject = "Hans";
    const addPredicate = "city of";
    const addObject = "J. Gordon";
    let rdfcsaRef = new Rdfcsa(JSON.parse(JSON.stringify(tripleList)));
    let opsRef = new RdfOperations(rdfcsaRef);
    const resRef = opsRef.addTripleOld(addSubject, addPredicate, addObject);

    let rdfcsa = new Rdfcsa(JSON.parse(JSON.stringify(tripleList)));
    let ops = new RdfOperations(rdfcsa);
    const res = ops.addTriple(addSubject, addPredicate, addObject);
    expect(res.dictionary.SO).toEqual(resRef.dictionary.SO);
    expect(res.dictionary.S).toEqual(resRef.dictionary.S);
    expect(res.dictionary.P).toEqual(resRef.dictionary.P);
    expect(res.dictionary.O).toEqual(resRef.dictionary.O);
    expect(res.gaps).toEqual(resRef.gaps);
    expect(res.D).toEqual(resRef.D);
    expect(res.psi).toEqual(resRef.psi);
  });

  test("addTriple: case 4 - failing if subject is new", () => {
    const addSubject = "Zans";
    const addPredicate = "city of";
    const addObject = "J. Gordon";
    let rdfcsaRef = new Rdfcsa(JSON.parse(JSON.stringify(tripleList)));
    let opsRef = new RdfOperations(rdfcsaRef);
    const resRef = opsRef.addTripleOld(addSubject, addPredicate, addObject);

    let rdfcsa = new Rdfcsa(JSON.parse(JSON.stringify(tripleList)));
    let ops = new RdfOperations(rdfcsa);
    const res = ops.addTriple(addSubject, addPredicate, addObject);
    expect(res.dictionary.SO).toEqual(resRef.dictionary.SO);
    expect(res.dictionary.S).toEqual(resRef.dictionary.S);
    expect(res.dictionary.P).toEqual(resRef.dictionary.P);
    expect(res.dictionary.O).toEqual(resRef.dictionary.O);
    expect(res.gaps).toEqual(resRef.gaps);
    expect(res.D).toEqual(resRef.D);
    expect(res.psi).toEqual(resRef.psi);
  });

  test("addTriple: case 4", () => {
    let rdfcsa = new Rdfcsa(JSON.parse(JSON.stringify(tripleList)));
    let ops = new RdfOperations(rdfcsa);
    const res = ops.addTriple("Inception", "city of", "J. Gordon");
    expect(res.psi).toEqual(addTripleCase4.resultPsi);
    expect(res.gaps).toEqual(addTripleCase4.resultGaps);
    expect(res.D.toString()).toEqual(addTripleCase4.resultD);
    expect(res.dictionary.SO).toEqual(addTripleCase4.resultDict.SO);
    expect(res.dictionary.S).toEqual(addTripleCase4.resultDict.S);
    expect(res.dictionary.P).toEqual(addTripleCase4.resultDict.P);
    expect(res.dictionary.O).toEqual(addTripleCase4.resultDict.O);
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
    const resRef0 = opsRef.addTripleOld(addSubject, addPredicate, addObject);

    let rdfcsa = new Rdfcsa(JSON.parse(JSON.stringify(tripleList)));
    let ops = new RdfOperations(rdfcsa);
    const res0 = ops.addTriple(addSubject, addPredicate, addObject);
    expect(res0.D.toString()).toEqual(resRef0.D.toString());
    expect(res0.dictionary.SO).toEqual(resRef0.dictionary.SO);
    expect(res0.dictionary.S).toEqual(resRef0.dictionary.S);
    expect(res0.dictionary.P).toEqual(resRef0.dictionary.P);
    expect(res0.dictionary.O).toEqual(resRef0.dictionary.O);
    expect(res0.gaps).toEqual(resRef0.gaps);
    expect(res0.psi).toEqual(resRef0.psi);
    const resRef = opsRef.addTripleOld(addSubject1, addPredicate1, addObject1);
    const res = ops.addTriple(addSubject1, addPredicate1, addObject1);
    expect(res.dictionary.SO).toEqual(resRef.dictionary.SO);
    expect(res.dictionary.S).toEqual(resRef.dictionary.S);
    expect(res.dictionary.P).toEqual(resRef.dictionary.P);
    expect(res.dictionary.O).toEqual(resRef.dictionary.O);
    expect(res.gaps).toEqual(resRef.gaps);
    expect(res.D.toString()).toEqual(resRef.D.toString());
    expect(res.psi).toEqual(resRef.psi);
  });

  test("addTriple: case 4 - Praesi", () => {
    const addSubject = "USA";
    const addPredicate = "born in";
    const addObject = "Oscar 2015";
    let rdfcsaRef = new Rdfcsa(JSON.parse(JSON.stringify(tripleList)));
    let opsRef = new RdfOperations(rdfcsaRef);
    const resRef = opsRef.addTripleOld(addSubject, addPredicate, addObject);
    let rdfcsa = new Rdfcsa(JSON.parse(JSON.stringify(tripleList)));
    let ops = new RdfOperations(rdfcsa);
    const res = ops.addTriple(addSubject, addPredicate, addObject);
    expect(res.dictionary.SO).toEqual(resRef.dictionary.SO);
    expect(res.dictionary.S).toEqual(resRef.dictionary.S);
    expect(res.dictionary.P).toEqual(resRef.dictionary.P);
    expect(res.dictionary.O).toEqual(resRef.dictionary.O);
    expect(res.gaps).toEqual(resRef.gaps);
    expect(res.D).toEqual(resRef.D);
    expect(res.psi).toEqual(resRef.psi);
  });

  test("addTriple: case 5 - two triples", () => {
    const addSubject = "USA";
    const addPredicate = "born in";
    const addObject = "USB";
    let rdfcsaRef = new Rdfcsa(JSON.parse(JSON.stringify(tripleList)));
    let opsRef = new RdfOperations(rdfcsaRef);
    const resRef = opsRef.addTripleOld(addSubject, addPredicate, addObject);
    let rdfcsa = new Rdfcsa(JSON.parse(JSON.stringify(tripleList)));
    let ops = new RdfOperations(rdfcsa);
    const res = ops.addTriple(addSubject, addPredicate, addObject);
    expect(res.dictionary.SO).toEqual(resRef.dictionary.SO);
    expect(res.dictionary.S).toEqual(resRef.dictionary.S);
    expect(res.dictionary.P).toEqual(resRef.dictionary.P);
    expect(res.dictionary.O).toEqual(resRef.dictionary.O);
    expect(res.gaps).toEqual(resRef.gaps);
    expect(res.D.toString()).toEqual(resRef.D.toString());
    expect(res.psi).toEqual(resRef.psi);
  });

  test("addTriple: case 5 - two triples", () => {
    const addSubject = "USA";
    const addPredicate = "born in";
    const addObject = "ASB";
    let rdfcsaRef = new Rdfcsa(JSON.parse(JSON.stringify(tripleList)));
    let opsRef = new RdfOperations(rdfcsaRef);
    const resRef = opsRef.addTripleOld(addSubject, addPredicate, addObject);
    let rdfcsa = new Rdfcsa(JSON.parse(JSON.stringify(tripleList)));
    let ops = new RdfOperations(rdfcsa);
    const res = ops.addTriple(addSubject, addPredicate, addObject);
    expect(res.dictionary.SO).toEqual(resRef.dictionary.SO);
    expect(res.dictionary.S).toEqual(resRef.dictionary.S);
    expect(res.dictionary.P).toEqual(resRef.dictionary.P);
    expect(res.dictionary.O).toEqual(resRef.dictionary.O);
    expect(res.gaps).toEqual(resRef.gaps);
    expect(res.D).toEqual(resRef.D);
    expect(res.psi).toEqual(resRef.psi);
  });

  test("addTriple: add to empty database", () => {
    const addSubject = "Hans";
    const addPredicate = "city of";
    const addObject = "J. Gordon";
    const addSubject1 = "USA";
    const addPredicate1 = "born in";
    const addObject1 = "ASB";
    let rdfcsaRef = new Rdfcsa([]);
    let opsRef = new RdfOperations(rdfcsaRef);
    const resRef = opsRef.addTripleOld(addSubject, addPredicate, addObject);

    let rdfcsa = new Rdfcsa([]);
    let ops = new RdfOperations(rdfcsa);
    const res = ops.addTriple(addSubject, addPredicate, addObject);
    expect(res.dictionary.SO).toEqual(resRef.dictionary.SO);
    expect(res.dictionary.S).toEqual(resRef.dictionary.S);
    expect(res.dictionary.P).toEqual(resRef.dictionary.P);
    expect(res.dictionary.O).toEqual(resRef.dictionary.O);
    expect(res.gaps).toEqual(resRef.gaps);
    expect(res.D).toEqual(resRef.D);
    expect(res.psi).toEqual(resRef.psi);

    const resRef1 = opsRef.addTripleOld(addSubject1, addPredicate1, addObject1);

    const res1 = ops.addTriple(addSubject1, addPredicate1, addObject1);
    expect(res1.dictionary.SO).toEqual(resRef1.dictionary.SO);
    expect(res1.dictionary.S).toEqual(resRef1.dictionary.S);
    expect(res1.dictionary.P).toEqual(resRef1.dictionary.P);
    expect(res1.dictionary.O).toEqual(resRef1.dictionary.O);
    expect(res1.gaps).toEqual(resRef1.gaps);
    expect(res1.D).toEqual(resRef1.D);
    expect(res1.psi).toEqual(resRef1.psi);
  });

  test("deleteTriple", () => {
    let rdfcsa = new Rdfcsa(tripleListExtended);
    let ops = new RdfOperations(rdfcsa);
    const res = ops.deleteTripleOld(new Triple(3, 6, 14));
    expect(res.psi).toEqual(resultPsi);
    expect(res.gaps).toEqual(resultGaps);
    expect(res.D.toString()).toEqual(resultD);
  });

  test("deleteTriple: case 2 - E.P born_in Canada", () => {
    const deleteSubject = 2;
    const deletePredicate = 7;
    const deleteObject = 13;
    const triple = new Triple(deleteSubject, deletePredicate, deleteObject);

    let rdfcsaRef = new Rdfcsa(JSON.parse(JSON.stringify(tripleList)));
    let opsRef = new RdfOperations(rdfcsaRef);
    const resRef = opsRef.deleteTripleOld(JSON.parse(JSON.stringify(triple)));

    let rdfcsa = new Rdfcsa(JSON.parse(JSON.stringify(tripleList)));
    let ops = new RdfOperations(rdfcsa);
    const res = ops.deleteTriple(JSON.parse(JSON.stringify(triple)));

    expect(res.dictionary.SO).toEqual(resRef.dictionary.SO);
    expect(res.dictionary.S).toEqual(resRef.dictionary.S);
    expect(res.dictionary.P).toEqual(resRef.dictionary.P);
    expect(res.dictionary.O).toEqual(resRef.dictionary.O);
    expect(res.gaps).toEqual(resRef.gaps);
    expect(res.D).toEqual(resRef.D);
    expect(res.psi).toEqual(resRef.psi);
  });

  test("deleteTriple: case 1 - J.G born_in USA", () => {
    const deleteSubject = 3;
    const deletePredicate = 7;
    const deleteObject = 15;
    const triple = new Triple(deleteSubject, deletePredicate, deleteObject);

    let rdfcsaRef = new Rdfcsa(JSON.parse(JSON.stringify(tripleList)));
    let opsRef = new RdfOperations(rdfcsaRef);
    const resRef = opsRef.deleteTripleOld(JSON.parse(JSON.stringify(triple)));

    let rdfcsa = new Rdfcsa(JSON.parse(JSON.stringify(tripleList)));
    let ops = new RdfOperations(rdfcsa);
    const res = ops.deleteTriple(JSON.parse(JSON.stringify(triple)));

    expect(res.dictionary.SO).toEqual(resRef.dictionary.SO);
    expect(res.dictionary.S).toEqual(resRef.dictionary.S);
    expect(res.dictionary.P).toEqual(resRef.dictionary.P);
    expect(res.dictionary.O).toEqual(resRef.dictionary.O);
    expect(res.gaps).toEqual(resRef.gaps);
    expect(res.D).toEqual(resRef.D);
    expect(res.psi).toEqual(resRef.psi);
  });

  test("deleteTriple: case 2 - L.D awarded Oscar_2015", () => {
    const deleteSubject = 4;
    const deletePredicate = 6;
    const deleteObject = 14;
    const triple = new Triple(deleteSubject, deletePredicate, deleteObject);

    let rdfcsaRef = new Rdfcsa(JSON.parse(JSON.stringify(tripleList)));
    let opsRef = new RdfOperations(rdfcsaRef);
    const resRef = opsRef.deleteTripleOld(JSON.parse(JSON.stringify(triple)));

    let rdfcsa = new Rdfcsa(JSON.parse(JSON.stringify(tripleList)));
    let ops = new RdfOperations(rdfcsa);
    const res = ops.deleteTriple(JSON.parse(JSON.stringify(triple)));

    expect(res.dictionary.SO).toEqual(resRef.dictionary.SO);
    expect(res.dictionary.S).toEqual(resRef.dictionary.S);
    expect(res.dictionary.P).toEqual(resRef.dictionary.P);
    expect(res.dictionary.O).toEqual(resRef.dictionary.O);
    expect(res.gaps).toEqual(resRef.gaps);
    expect(res.D).toEqual(resRef.D);
    expect(res.psi).toEqual(resRef.psi);
  });

  test("deleteTriple: case 2 - E.P appears_in Inception", () => {
    const deleteSubject = 2;
    const deletePredicate = 5;
    const deleteObject = 11;
    const triple = new Triple(deleteSubject, deletePredicate, deleteObject);

    let rdfcsaRef = new Rdfcsa(JSON.parse(JSON.stringify(tripleList)));
    let opsRef = new RdfOperations(rdfcsaRef);
    const resRef = opsRef.deleteTripleOld(JSON.parse(JSON.stringify(triple)));

    let rdfcsa = new Rdfcsa(JSON.parse(JSON.stringify(tripleList)));
    let ops = new RdfOperations(rdfcsa);
    const res = ops.deleteTriple(JSON.parse(JSON.stringify(triple)));

    expect(res.dictionary.SO).toEqual(resRef.dictionary.SO);
    expect(res.dictionary.S).toEqual(resRef.dictionary.S);
    expect(res.dictionary.P).toEqual(resRef.dictionary.P);
    expect(res.dictionary.O).toEqual(resRef.dictionary.O);
    expect(res.gaps).toEqual(resRef.gaps);
    expect(res.D).toEqual(resRef.D);
    expect(res.psi).toEqual(resRef.psi);
  });

  test("deleteTriple: case 3 - Inception filmed_in L.A.", () => {
    const deleteSubject = 0;
    const deletePredicate = 9;
    const deleteObject = 12;
    const triple = new Triple(deleteSubject, deletePredicate, deleteObject);

    let rdfcsaRef = new Rdfcsa(JSON.parse(JSON.stringify(tripleList)));
    let opsRef = new RdfOperations(rdfcsaRef);
    const resRef = opsRef.deleteTripleOld(JSON.parse(JSON.stringify(triple)));

    let rdfcsa = new Rdfcsa(JSON.parse(JSON.stringify(tripleList)));
    let ops = new RdfOperations(rdfcsa);
    const res = ops.deleteTriple(JSON.parse(JSON.stringify(triple)));

    expect(res.dictionary.SO).toEqual(resRef.dictionary.SO);
    expect(res.dictionary.S).toEqual(resRef.dictionary.S);
    expect(res.dictionary.P).toEqual(resRef.dictionary.P);
    expect(res.dictionary.O).toEqual(resRef.dictionary.O);
    expect(res.gaps).toEqual(resRef.gaps);
    expect(res.D).toEqual(resRef.D);
    expect(res.psi).toEqual(resRef.psi);
  });

  test("deleteTriple: case 4 - double delete", () => {
    const deleteSubject = 0; // Inception
    const deletePredicate = 9; // filmed in
    const deleteObject = 12; // LA
    const triple = new Triple(deleteSubject, deletePredicate, deleteObject);
    const deleteSubject1 = 2; // J. Gordan
    const deletePredicate1 = 8; // lives in
    const deleteObject1 = 9; // LA
    const triple1 = new Triple(deleteSubject1, deletePredicate1, deleteObject1);

    let rdfcsaRef = new Rdfcsa(JSON.parse(JSON.stringify(tripleList)));
    let opsRef = new RdfOperations(rdfcsaRef);
    const resRef = opsRef.deleteTripleOld(JSON.parse(JSON.stringify(triple)));

    let rdfcsa = new Rdfcsa(JSON.parse(JSON.stringify(tripleList)));
    let ops = new RdfOperations(rdfcsa);
    const res = ops.deleteTriple(JSON.parse(JSON.stringify(triple)));

    expect(res.dictionary.SO).toEqual(resRef.dictionary.SO);
    expect(res.dictionary.S).toEqual(resRef.dictionary.S);
    expect(res.dictionary.P).toEqual(resRef.dictionary.P);
    expect(res.dictionary.O).toEqual(resRef.dictionary.O);
    expect(res.gaps).toEqual(resRef.gaps);
    expect(res.D).toEqual(resRef.D);
    expect(res.psi).toEqual(resRef.psi);

    const resRef1 = opsRef.deleteTripleOld(JSON.parse(JSON.stringify(triple1)));

    const res1 = ops.deleteTriple(JSON.parse(JSON.stringify(triple1)));

    expect(res1.dictionary.SO).toEqual(resRef1.dictionary.SO);
    expect(res1.dictionary.S).toEqual(resRef1.dictionary.S);
    expect(res1.dictionary.P).toEqual(resRef1.dictionary.P);
    expect(res1.dictionary.O).toEqual(resRef1.dictionary.O);
    expect(res1.gaps).toEqual(resRef1.gaps);
    expect(res1.D).toEqual(resRef1.D);
    expect(res1.psi).toEqual(resRef1.psi);
  });

  test("deleteTriple:delete", () => {
    const tripleList1 = [
      ["Inception", "filmed in", "L.A."],
      ["L.A.", "city of", "USA"],
      ["J. Gordon", "born in", "USA"],
    ];

    // "J. Gordon", "LA", "born in", "city" USA

    const deleteSubject = 1; // Inception
    const deletePredicate = 5; // filmed in
    const deleteObject = 6; // LA
    const triple = new Triple(deleteSubject, deletePredicate, deleteObject);
    const deleteSubject1 = 1; // L.A.
    const deletePredicate1 = 3; // city of
    const deleteObject1 = 4; // USA
    const triple1 = new Triple(deleteSubject1, deletePredicate1, deleteObject1);

    let rdfcsaRef = new Rdfcsa(JSON.parse(JSON.stringify(tripleList1)));
    let opsRef = new RdfOperations(rdfcsaRef);
    const resRef = opsRef.deleteTripleOld(JSON.parse(JSON.stringify(triple)));

    let rdfcsa = new Rdfcsa(JSON.parse(JSON.stringify(tripleList1)));
    let ops = new RdfOperations(rdfcsa);
    const res = ops.deleteTriple(JSON.parse(JSON.stringify(triple)));

    expect(res.dictionary.SO).toEqual(resRef.dictionary.SO);
    expect(res.dictionary.S).toEqual(resRef.dictionary.S);
    expect(res.dictionary.P).toEqual(resRef.dictionary.P);
    expect(res.dictionary.O).toEqual(resRef.dictionary.O);
    expect(res.gaps).toEqual(resRef.gaps);
    expect(res.D).toEqual(resRef.D);
    expect(res.psi).toEqual(resRef.psi);

    const resRef1 = opsRef.deleteTripleOld(JSON.parse(JSON.stringify(triple1)));

    const res1 = ops.deleteTriple(JSON.parse(JSON.stringify(triple1)));

    expect(res1.dictionary.SO).toEqual(resRef1.dictionary.SO);
    expect(res1.dictionary.S).toEqual(resRef1.dictionary.S);
    expect(res1.dictionary.P).toEqual(resRef1.dictionary.P);
    expect(res1.dictionary.O).toEqual(resRef1.dictionary.O);
    expect(res1.gaps).toEqual(resRef1.gaps);
    expect(res1.D).toEqual(resRef1.D);
    expect(res1.psi).toEqual(resRef1.psi);
  });

  test("deleteTriple: delete all", () => {
    const tripleList1 = [
      ["Inception", "filmed in", "L.A."],
      ["L.A.", "city of", "USA"],
    ];

    // "LA", "city", USA

    const deleteSubject = 1; // Inception
    const deletePredicate = 3; // filmed in
    const deleteObject = 4; // LA
    const triple = new Triple(deleteSubject, deletePredicate, deleteObject);
    const deleteSubject1 = 0; // L.A.
    const deletePredicate1 = 1; // city of
    const deleteObject1 = 2; // USA
    const triple1 = new Triple(deleteSubject1, deletePredicate1, deleteObject1);

    let rdfcsaRef = new Rdfcsa(JSON.parse(JSON.stringify(tripleList1)));
    let opsRef = new RdfOperations(rdfcsaRef);
    const resRef = opsRef.deleteTripleOld(JSON.parse(JSON.stringify(triple)));

    let rdfcsa = new Rdfcsa(JSON.parse(JSON.stringify(tripleList1)));
    let ops = new RdfOperations(rdfcsa);
    const res = ops.deleteTriple(JSON.parse(JSON.stringify(triple)));

    expect(res.dictionary.SO).toEqual(resRef.dictionary.SO);
    expect(res.dictionary.S).toEqual(resRef.dictionary.S);
    expect(res.dictionary.P).toEqual(resRef.dictionary.P);
    expect(res.dictionary.O).toEqual(resRef.dictionary.O);
    expect(res.gaps).toEqual(resRef.gaps);
    expect(res.D).toEqual(resRef.D);
    expect(res.psi).toEqual(resRef.psi);

    const resRef1 = opsRef.deleteTripleOld(JSON.parse(JSON.stringify(triple1)));

    const res1 = ops.deleteTriple(JSON.parse(JSON.stringify(triple1)));

    expect(res1.dictionary.SO).toEqual(resRef1.dictionary.SO);
    expect(res1.dictionary.S).toEqual(resRef1.dictionary.S);
    expect(res1.dictionary.P).toEqual(resRef1.dictionary.P);
    expect(res1.dictionary.O).toEqual(resRef1.dictionary.O);
    expect(res1.gaps).toEqual(resRef1.gaps);
    expect(res1.D).toEqual(resRef1.D);
    expect(res1.psi).toEqual(resRef1.psi);
  });

  test("deleteTriple:delete", () => {
    const tripleList1 = [
      ["Inception", "filmed in", "L.A."],
      ["Inception", "city of", "USA"],
    ];

    // Inception, city, filmed in, L.A., USA

    const deleteSubject = 0; // Inception
    const deletePredicate = 2; // filmed in
    const deleteObject = 3; // LA
    const triple = new Triple(deleteSubject, deletePredicate, deleteObject);

    let rdfcsaRef = new Rdfcsa(JSON.parse(JSON.stringify(tripleList1)));
    let opsRef = new RdfOperations(rdfcsaRef);
    const resRef = opsRef.deleteTripleOld(JSON.parse(JSON.stringify(triple)));

    let rdfcsa = new Rdfcsa(JSON.parse(JSON.stringify(tripleList1)));
    let ops = new RdfOperations(rdfcsa);
    const res = ops.deleteTriple(JSON.parse(JSON.stringify(triple)));

    expect(res.dictionary.SO).toEqual(resRef.dictionary.SO);
    expect(res.dictionary.S).toEqual(resRef.dictionary.S);
    expect(res.dictionary.P).toEqual(resRef.dictionary.P);
    expect(res.dictionary.O).toEqual(resRef.dictionary.O);
    expect(res.gaps).toEqual(resRef.gaps);
    expect(res.D).toEqual(resRef.D);
    expect(res.psi).toEqual(resRef.psi);
  });

  test("modifyTriple", () => {
    const newSubject = "J. Gordon";
    const newPredicate = "appears in";
    const newObject = "Inception";
    const oldTriple = new Triple(3, 10, 12);
    let rdfcsaRef = new Rdfcsa(JSON.parse(JSON.stringify(tripleList)));
    let opsRef = new RdfOperations(rdfcsaRef);
    const resRef = opsRef.modifyTripleOld(JSON.parse(JSON.stringify(oldTriple)), newSubject, newPredicate, newObject);
    let rdfcsa = new Rdfcsa(JSON.parse(JSON.stringify(tripleList)));
    let ops = new RdfOperations(rdfcsa);
    const res = ops.modifyTriple(JSON.parse(JSON.stringify(oldTriple)), newSubject, newPredicate, newObject);

    expect(res.dictionary.SO).toEqual(resRef.dictionary.SO);
    expect(res.dictionary.S).toEqual(resRef.dictionary.S);
    expect(res.dictionary.P).toEqual(resRef.dictionary.P);
    expect(res.dictionary.O).toEqual(resRef.dictionary.O);
    expect(res.gaps).toEqual(resRef.gaps);
    expect(res.D).toEqual(resRef.D);
    expect(res.psi).toEqual(resRef.psi);
  });

  test("modifyTriple", () => {
    let rdfcsa = new Rdfcsa(tripleListModified);
    let ops = new RdfOperations(rdfcsa);
    const res = ops.modifyTriple(new Triple(3, 10, 12), "J. Gordon", "appears in", "Inception");
    expect(res.psi).toEqual(resultPsi);
    expect(res.gaps).toEqual(resultGaps);
    expect(res.D.toString()).toEqual(resultD);
  });
  test("deleteElementInDict", () => {
    let resRef = new Rdfcsa(tripleListForDeleteInDict);

    let rdfcsa = new Rdfcsa(JSON.parse(JSON.stringify(tripleList)));
    let ops = new RdfOperations(rdfcsa);
    const res = ops.deleteElementInDictionary(1); // delete SO: LA
    expect(res.psi).toEqual(resRef.psi);
    expect(res.gaps).toEqual(resRef.gaps);
    expect(res.D.toString()).toEqual(resRef.D.toString());
  });
  test("deleteElementInDict - Inception", () => {
    let resRef = new Rdfcsa(tripleListForDeleteInDict1);

    let rdfcsa = new Rdfcsa(JSON.parse(JSON.stringify(tripleList)));
    let ops = new RdfOperations(rdfcsa);
    const res = ops.deleteElementInDictionary(0); // delete SO: Inception
    expect(res.D.toString()).toEqual(resRef.D.toString());
    expect(res.psi).toEqual(resRef.psi);
    expect(res.gaps).toEqual(resRef.gaps);
  });

  test("deleteElementInDict - xInception", () => {
    let resRef = new Rdfcsa(JSON.parse(JSON.stringify(tripleListForDeleteInDict)));

    let rdfcsa = new Rdfcsa(JSON.parse(JSON.stringify(tripleList)));
    let ops = new RdfOperations(rdfcsa);
    const res = ops.deleteElementInDictionary(1); // delete SO: xInception
    expect(res.D.toString()).toEqual(resRef.D.toString());
    expect(res.psi).toEqual(resRef.psi);
    expect(res.gaps).toEqual(resRef.gaps);
  });
  test("changeInDictionary", () => {
    let rdfcsa = new Rdfcsa(JSON.parse(JSON.stringify(tripleListTypo)));
    let ops = new RdfOperations(rdfcsa);
    const res = ops.changeInDictionary(1, "Inception");
    expect(res.gaps).toEqual(resultGaps);
    expect(res.D.toString()).toEqual(resultD);
    expect(res.psi).toEqual(resultPsi);
  });

  test.skip("bugfix test for changeInDictionary", () => {
    const input = [
      ["L.A.", "city of", "USA"],
      ["J. Gordon", "born in", "USA"],
      ["J. Gordon", "lives in", "L.A."],
      ["E. Page", "born in", "Canada"],
      ["L. DiCaprio", "born in", "USA"],
      ["L. DiCaprio", "awarded", "Oscar 2015"],
      ["Inception", "filmed in", "L.A."],
    ];
    const toAdd1 = ["Inception", "filmed in", "L.A."];
    const toAdd = ["E. Page", "appears in", "Inception"];
    const toAdd3 = ["L. DiCaprio", "appears in", "Inception"];
    const toAdd4 = ["J. Gordon", "appears in", "Inception"];
    let rdfcsaRef = new Rdfcsa(JSON.parse(JSON.stringify(input)));
    let opsRef = new RdfOperations(rdfcsaRef);
    const resRef = opsRef.addTripleOld(toAdd[0], toAdd[1], toAdd[2]);
    let rdfcsa = new Rdfcsa(JSON.parse(JSON.stringify(input)));
    let ops = new RdfOperations(rdfcsa);
    const res = ops.addTriple(toAdd[0], toAdd[1], toAdd[2]);
    expect(res.dictionary.SO).toEqual(resRef.dictionary.SO);
    expect(res.dictionary.S).toEqual(resRef.dictionary.S);
    expect(res.dictionary.P).toEqual(resRef.dictionary.P);
    expect(res.dictionary.O).toEqual(resRef.dictionary.O);
    expect(res.gaps).toEqual(resRef.gaps);
    expect(res.psi).toEqual(resRef.psi);
    expect(res.D).toEqual(resRef.D);
  });
});

describe("RDFOperation inserts Test", () => {
  test("test paper insert", () => {
    let rdfcsaOld = new Rdfcsa(JSON.parse(JSON.stringify(tripleList)));

    let rdfcsa = new Rdfcsa([]);
    let ops = new RdfOperations(rdfcsa);
    tripleList.forEach((triple) => {
      ops.addTriple(triple[0], triple[1], triple[2]);
    });

    expect(rdfcsa.dictionary.SO).toEqual(rdfcsaOld.dictionary.SO);
    expect(rdfcsa.dictionary.S).toEqual(rdfcsaOld.dictionary.S);
    expect(rdfcsa.dictionary.P).toEqual(rdfcsaOld.dictionary.P);
    expect(rdfcsa.dictionary.O).toEqual(rdfcsaOld.dictionary.O);
    expect(rdfcsa.gaps).toEqual(rdfcsaOld.gaps);
    expect(rdfcsa.D).toEqual(rdfcsaOld.D);
    expect(rdfcsa.psi).toEqual(rdfcsaOld.psi);
  });

  test("maxiTest 1000 triples insert, bitvector js", () => {
    let rdfcsaOld = new Rdfcsa(JSON.parse(JSON.stringify(dataset_1k.dataset)), true);

    let rdfcsa = new Rdfcsa([], true);
    let ops = new RdfOperations(rdfcsa);
    dataset_1k.dataset.forEach((triple) => {
      ops.addTriple(triple[0], triple[1], triple[2]);
    });

    expect(rdfcsa.dictionary.SO).toEqual(rdfcsaOld.dictionary.SO);
    expect(rdfcsa.dictionary.S).toEqual(rdfcsaOld.dictionary.S);
    expect(rdfcsa.dictionary.P).toEqual(rdfcsaOld.dictionary.P);
    expect(rdfcsa.dictionary.O).toEqual(rdfcsaOld.dictionary.O);
    expect(rdfcsa.gaps).toEqual(rdfcsaOld.gaps);
    expect(rdfcsa.D.toString()).toEqual(rdfcsaOld.D.toString());
    expect(rdfcsa.psi).toEqual(rdfcsaOld.psi);
  });

  test("maxiTest 1000 triples insert, custom bitvector for creation, bitvector js array for insert", () => {
    let rdfcsaOld = new Rdfcsa(JSON.parse(JSON.stringify(dataset_1k.dataset)));

    let rdfcsa = new Rdfcsa([], true);
    let ops = new RdfOperations(rdfcsa);
    dataset_1k.dataset.forEach((triple) => {
      ops.addTriple(triple[0], triple[1], triple[2]);
    });

    expect(rdfcsa.dictionary.SO).toEqual(rdfcsaOld.dictionary.SO);
    expect(rdfcsa.dictionary.S).toEqual(rdfcsaOld.dictionary.S);
    expect(rdfcsa.dictionary.P).toEqual(rdfcsaOld.dictionary.P);
    expect(rdfcsa.dictionary.O).toEqual(rdfcsaOld.dictionary.O);
    expect(rdfcsa.gaps).toEqual(rdfcsaOld.gaps);
    expect(rdfcsa.D.toString()).toEqual(rdfcsaOld.D.toString());
    expect(rdfcsa.psi).toEqual(rdfcsaOld.psi);
  });

  test.skip("maxiTest 1000 triples insert, custom bitvector", () => {
    // Runs forever due to bad performing custom bitvector
    let rdfcsaOld = new Rdfcsa(JSON.parse(JSON.stringify(dataset_1k.dataset)));

    let rdfcsa = new Rdfcsa([]);
    let ops = new RdfOperations(rdfcsa);
    dataset_1k.dataset.forEach((triple) => {
      ops.addTriple(triple[0], triple[1], triple[2]);
    });

    expect(rdfcsa.dictionary.SO).toEqual(rdfcsaOld.dictionary.SO);
    expect(rdfcsa.dictionary.S).toEqual(rdfcsaOld.dictionary.S);
    expect(rdfcsa.dictionary.P).toEqual(rdfcsaOld.dictionary.P);
    expect(rdfcsa.dictionary.O).toEqual(rdfcsaOld.dictionary.O);
    expect(rdfcsa.gaps).toEqual(rdfcsaOld.gaps);
    expect(rdfcsa.D).toEqual(rdfcsaOld.D);
    expect(rdfcsa.psi).toEqual(rdfcsaOld.psi);
  });
});

describe.skip("RDFOperation MaxiTest", () => {
  // funzt
  test("maxiTest 50000 Triples", () => {
    let rdfcsaOld = new Rdfcsa(JSON.parse(JSON.stringify(dataset)));

    let rdfcsa = new Rdfcsa([]);
    let ops = new RdfOperations(rdfcsa);
    dataset.forEach((triple) => {
      ops.addTriple(triple[0], triple[1], triple[2]);
    });

    expect(rdfcsa.dictionary.SO).toEqual(rdfcsaOld.dictionary.SO);
    expect(rdfcsa.dictionary.S).toEqual(rdfcsaOld.dictionary.S);
    expect(rdfcsa.dictionary.P).toEqual(rdfcsaOld.dictionary.P);
    expect(rdfcsa.dictionary.O).toEqual(rdfcsaOld.dictionary.O);
    expect(rdfcsa.gaps).toEqual(rdfcsaOld.gaps);
    expect(rdfcsa.D).toEqual(rdfcsaOld.D);
    expect(rdfcsa.psi).toEqual(rdfcsaOld.psi);
  });
});
