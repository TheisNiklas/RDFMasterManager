import { Rdfcsa } from "../../src/rdf/rdfcsa";
import {
  exampleTripleList,
  resultT,
  resultTid,
} from "./fixtures/rdfcsa.test.json";

describe("Rdfcsa", () => {
  test("init", () => {
    const fixture = exampleTripleList;
    let rdfcsa = new Rdfcsa();
    rdfcsa.constructTArrays(fixture);
    expect(rdfcsa.gaps).toEqual([0, 5, 11]);
    expect(rdfcsa.T).toEqual(resultT);
    expect(rdfcsa.Tid).toEqual(resultTid);
  });
});
