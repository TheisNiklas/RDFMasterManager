import { Dictionary } from "../../src/rdf/dictionary";
import { Triple } from "../../src/rdf/models/triple";
import { exampleTripleList } from "./fixtures/dictionary.test.json";

describe("Rdfcsa", () => {
  let dictionary;
  beforeEach(() => {
    dictionary = new Dictionary();
    dictionary.createDictionaries(exampleTripleList);
  });
  test("constructTArrays", () => {
    expect(dictionary.SO).toEqual(["Inception", "L.A."]);
    expect(dictionary.S).toEqual(["E. Page", "J. Gordon", "L. DiCaprio"]);
    expect(dictionary.P).toEqual(["appears in", "awarded", "born in", "city of", "filmed in", "lives in"]);
    expect(dictionary.O).toEqual(["Canada", "Oscar 2015", "USA"]);
  });
  test("addTriple", () => {
    dictionary.addTriple("Oscar 2015", "presented by", "N. P. Harris");
    expect(dictionary.SO).toEqual(["Inception", "L.A.", "Oscar 2015"]);
    expect(dictionary.S).toEqual(["E. Page", "J. Gordon", "L. DiCaprio"]);
    expect(dictionary.P).toEqual([
      "appears in",
      "awarded",
      "born in",
      "city of",
      "filmed in",
      "lives in",
      "presented by",
    ]);
    expect(dictionary.O).toEqual(["Canada", "N. P. Harris", "USA"]);
  });
  test("deleteSubjectObject", () => {
    dictionary.deleteSubjectObject("Inception");
    expect(dictionary.SO).toEqual(["L.A."]);
    expect(dictionary.S).toEqual(["E. Page", "J. Gordon", "L. DiCaprio"]);
    expect(dictionary.P).toEqual(["appears in", "awarded", "born in", "city of", "filmed in", "lives in"]);
    expect(dictionary.O).toEqual(["Canada", "Oscar 2015", "USA"]);
  });
  test("deleteSubject", () => {
    dictionary.deleteSubject("J. Gordon");
    expect(dictionary.SO).toEqual(["Inception", "L.A."]);
    expect(dictionary.S).toEqual(["E. Page", "L. DiCaprio"]);
    expect(dictionary.P).toEqual(["appears in", "awarded", "born in", "city of", "filmed in", "lives in"]);
    expect(dictionary.O).toEqual(["Canada", "Oscar 2015", "USA"]);
  });
  test("deleteObject", () => {
    dictionary.deleteObject("USA");
    expect(dictionary.SO).toEqual(["Inception", "L.A."]);
    expect(dictionary.S).toEqual(["E. Page", "J. Gordon", "L. DiCaprio"]);
    expect(dictionary.P).toEqual(["appears in", "awarded", "born in", "city of", "filmed in", "lives in"]);
    expect(dictionary.O).toEqual(["Canada", "Oscar 2015"]);
  });
  test("deletePredicate", () => {
    dictionary.deletePredicate("born in");
    expect(dictionary.SO).toEqual(["Inception", "L.A."]);
    expect(dictionary.S).toEqual(["E. Page", "J. Gordon", "L. DiCaprio"]);
    expect(dictionary.P).toEqual(["appears in", "awarded", "city of", "filmed in", "lives in"]);
    expect(dictionary.O).toEqual(["Canada", "Oscar 2015", "USA"]);
  });
  test("deleteDictionary", () => {
    dictionary.deleteDictionary();
    expect(dictionary.SO).toEqual([]);
    expect(dictionary.S).toEqual([]);
    expect(dictionary.P).toEqual([]);
    expect(dictionary.O).toEqual([]);
  });
  test("getIdBySubject from SO", () => {
    let res = dictionary.getIdBySubject("Inception");
    expect(res).toEqual(0);
  });
  test("getIdBySubject from S", () => {
    let res = dictionary.getIdBySubject("J. Gordon");
    expect(res).toEqual(3);
  });
  test("getIdByObject from SO", () => {
    let res = dictionary.getIdByObject("L.A.");
    expect(res).toEqual(12);
  });
  test("getIdByObject from O", () => {
    let res = dictionary.getIdByObject("Oscar 2015");
    expect(res).toEqual(14);
  });
  test("getIdByPredicate from O", () => {
    let res = dictionary.getIdByPredicate("awarded");
    expect(res).toEqual(6);
  });
  test("getSubjectById from SO", () => {
    let res = dictionary.getSubjectById(1);
    expect(res).toEqual("L.A.");
  });
  test("getSubjectById from S", () => {
    let res = dictionary.getSubjectById(3);
    expect(res).toEqual("J. Gordon");
  });
  test("getObjectById from SO", () => {
    let res = dictionary.getObjectById(0);
    expect(res).toEqual("Inception");
  });
  test("getObjectById from S", () => {
    let res = dictionary.getObjectById(4);
    expect(res).toEqual("USA");
  });
  test("getPredicateById from P", () => {
    let res = dictionary.getPredicateById(4);
    expect(res).toEqual("filmed in");
  });
  test("decodeTriple(2,7,13)", () => {
    let res = dictionary.decodeTriple(new Triple(2, 7, 13));
    expect(res).toEqual(["E. Page", "born in", "Canada"]);
  });
});
