import { Rdfcsa } from "../../src/rdf/models/rdfcsa"
import { exampleTripleList } from "./fixtures"

describe("Rdfcsa", () => {
  test("init", () => {
    const fixture = exampleTripleList
    let rdfcsa = new Rdfcsa();
    rdfcsa.constructTid(fixture);
  });
});
