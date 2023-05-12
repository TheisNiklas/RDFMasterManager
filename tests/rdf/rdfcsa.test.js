import { Rdfcsa } from "../../src/rdf/rdfcsa";
import {
  exampleTripleList,
  resultT,
  resultTid,
} from "./fixtures/rdfcsa.test.json";

describe("Rdfcsa", () => {
  // let dictionary;
  // beforeEach(() => {
  //   dictionary = new Dictionary();
  //   dictionary.createDictionaries(exampleTripleList)
  // });
  test("init", () => {
    const fixture = exampleTripleList;
    let rdfcsa = new Rdfcsa();
    rdfcsa.construct(fixture);
    expect(rdfcsa.psi).toEqual([18, 17, 10, 14, 11, 15, 19, 12, 13, 16, 20, 21, 22, 26, 25, 28, 29, 27, 23, 24, 2, 4, 7, 0, 6, 3, 8, 1, 5, 9]);
    expect(rdfcsa.gaps).toEqual([0, 5, 11]);
    expect(rdfcsa.D).toEqual([1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 0, 0]);
  });
});
