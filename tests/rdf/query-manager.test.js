import { Rdfcsa } from "../../src/rdf/rdfcsa";
import { QueryManager } from "../../src/rdf/query-manager";
import { QueryElement } from "../../src/rdf/models/query-element";
import { QueryTriple } from "../../src/rdf/models/query-triple";
import { tripleList } from "./fixtures/rdfcsa.test.json";
import { Triple } from "../../src/rdf/models/triple";

describe("QueryManager", () => {
  let queryManager;
  beforeEach(() => {
    let rdfcsa = new Rdfcsa(tripleList);
    queryManager = new QueryManager(rdfcsa);
  });
  test("getBoundTriple(0,9,12)", () => {
    const subject = new QueryElement(0);
    const predicate = new QueryElement(9);
    const object = new QueryElement(12);
    const queryTriple = new QueryTriple(subject, predicate, object);
    const result = queryManager.getBoundTriple(queryTriple);
    expect(result).toEqual([new Triple(0, 9, 12)]);
  });
  test("getBoundTriple(3,5,11)", () => {
    const subject = new QueryElement(3);
    const predicate = new QueryElement(5);
    const object = new QueryElement(11);
    const queryTriple = new QueryTriple(subject, predicate, object);
    const result = queryManager.getBoundTriple(queryTriple);
    expect(result).toEqual([new Triple(3, 5, 11)]);
  });
  test("getBoundTriple(2,5,11)", () => {
    const subject = new QueryElement(2);
    const predicate = new QueryElement(5);
    const object = new QueryElement(11);
    const queryTriple = new QueryTriple(subject, predicate, object);
    const result = queryManager.getBoundTriple(queryTriple);
    expect(result).toEqual([new Triple(2, 5, 11)]);
  });
  test("getBoundTripleIncorrect(3,7,12)", () => {
    const subject = new QueryElement(3);
    const predicate = new QueryElement(7);
    const object = new QueryElement(12);
    const queryTriple = new QueryTriple(subject, predicate, object);
    const result = queryManager.getBoundTriple(queryTriple);
    expect(result).toEqual([]);
  });
  test("getBoundTripleIncorrect(0,8,12)", () => {
    const subject = new QueryElement(0);
    const predicate = new QueryElement(8);
    const object = new QueryElement(12);
    const queryTriple = new QueryTriple(subject, predicate, object);
    const result = queryManager.getBoundTriple(queryTriple);
    expect(result).toEqual([]);
  });
  test("getBoundTripleIncorrect(0,0,0)", () => {
    const subject = new QueryElement(0);
    const predicate = new QueryElement(0);
    const object = new QueryElement(0);
    const queryTriple = new QueryTriple(subject, predicate, object);
    const result = queryManager.getBoundTriple(queryTriple);
    expect(result).toEqual([]);
  });
  test("getOneUnboundTriple(?,5,11)", () => {
    const subject = null;
    const predicate = new QueryElement(5);
    const object = new QueryElement(11);
    const queryTriple = new QueryTriple(subject, predicate, object);
    const result = queryManager.getOneUnboundTriple(queryTriple);
    expect(result).toEqual([
      [2, 5, 11],
      [3, 5, 11],
      [4, 5, 11],
    ]);
  });
  test("getOneUnboundTriple(1,?,15)", () => {
    const subject = new QueryElement(1);
    const predicate = null;
    const object = new QueryElement(15);
    const queryTriple = new QueryTriple(subject, predicate, object);
    const result = queryManager.getOneUnboundTriple(queryTriple);
    expect(result).toEqual([[1, 8, 15]]);
  });
  test("getOneUnboundTriple(4,7,?)", () => {
    const subject = new QueryElement(4);
    const predicate = new QueryElement(7);
    const object = null;
    const queryTriple = new QueryTriple(subject, predicate, object);
    const result = queryManager.getOneUnboundTriple(queryTriple);
    expect(result).toEqual([[4, 7, 15]]);
  });
  test("getTwoUnboundTriple(3,,)", () => {
    const subject = new QueryElement(3);
    const predicate = null;
    const object = null;
    const queryTriple = new QueryTriple(subject, predicate, object);
    const result = queryManager.getTwoUnboundTriple(queryTriple);
    expect(result).toEqual([
      [3, 5, 11],
      [3, 7, 15],
      [3, 10, 12],
    ]);
  });
  test("getTwoUnboundTriple(4,,)", () => {
    const subject = new QueryElement(4);
    const predicate = null;
    const object = null;
    const queryTriple = new QueryTriple(subject, predicate, object);
    const result = queryManager.getTwoUnboundTriple(queryTriple);
    expect(result).toEqual([
      [4, 5, 11],
      [4, 6, 14],
      [4, 7, 15],
    ]);
  });
  test("getTwoUnboundTriple(,5,)", () => {
    const subject = null;
    const predicate = new QueryElement(5);
    const object = null;
    const queryTriple = new QueryTriple(subject, predicate, object);
    const result = queryManager.getTwoUnboundTriple(queryTriple);
    expect(result).toEqual([
      [2, 5, 11],
      [3, 5, 11],
      [4, 5, 11],
    ]);
  });
  test("getTwoUnboundTriple(,,15)", () => {
    const subject = null;
    const predicate = null;
    const object = new QueryElement(15);
    const queryTriple = new QueryTriple(subject, predicate, object);
    const result = queryManager.getTwoUnboundTriple(queryTriple);
    expect(result).toEqual([
      [1, 8, 15],
      [3, 7, 15],
      [4, 7, 15],
    ]);
  });
  test("getTwoUnboundTriple(,,11)", () => {
    const subject = null;
    const predicate = null;
    const object = new QueryElement(11);
    const queryTriple = new QueryTriple(subject, predicate, object);
    const result = queryManager.getTwoUnboundTriple(queryTriple);
    expect(result).toEqual([
      [2, 5, 11],
      [3, 5, 11],
      [4, 5, 11],
    ]);
  });
  test("getJoin(4,8,11)", () => {
    const subject = new QueryElement(4);
    const predicate = new QueryElement(8);
    const object = new QueryElement(11);
    const queryTriple = new QueryTriple(subject, predicate, object);
    const result = queryManager.getTwoUnboundTriple(queryTriple);
    expect(result).toEqual([
      [2, 5, 11],
      [3, 5, 11],
      [4, 5, 11],
    ]);
  });
});
