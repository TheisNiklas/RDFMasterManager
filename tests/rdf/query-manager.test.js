import { Rdfcsa } from "../../src/rdf/rdfcsa";
import { QueryManager } from "../../src/rdf/query-manager";
import { QueryElement } from "../../src/rdf/models/query-element";
import { QueryTriple } from "../../src/rdf/models/query-triple";
import { tripleList } from "./fixtures/rdfcsa.test.json";

describe("QueryManager", () => {
  let queryManager;
  beforeEach(() => {
    let rdfcsa = new Rdfcsa();
    rdfcsa.construct(tripleList);
    queryManager = new QueryManager(rdfcsa);
  });
  test("getBoundTriple", () => {
    const subject = new QueryElement(0);
    const predicate = new QueryElement(8);
    const object = new QueryElement(12);
    const queryTriple = new QueryTriple(subject, predicate, object);
    const result = queryManager.getBoundTriple([queryTriple]);
    let deb = 0;
  });
});
