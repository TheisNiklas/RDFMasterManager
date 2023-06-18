import { Rdfcsa } from "../../src/rdf/rdfcsa";
import { tripleList, resultPsi, resultGaps, resultD } from "./fixtures/rdfcsa.test.json";
import {dataset_1k} from "./fixtures/1k-dataset.json"

describe("Rdfcsa", () => {
  test("init", () => {
    let rdfcsa = new Rdfcsa(tripleList);
    expect(rdfcsa.psi).toEqual(resultPsi);
    expect(rdfcsa.gaps).toEqual(resultGaps);
    expect(rdfcsa.D.toString()).toEqual(resultD);
  });

  test ("init big Database", () => {
    let rdfcsa = new Rdfcsa(dataset_1k.dataset);
    let deb = rdfcsa.D.toString();
    expect(rdfcsa.psi).toEqual(dataset_1k.resultPsi);
    expect(rdfcsa.gaps).toEqual(dataset_1k.resultGaps);
    expect(rdfcsa.D.toString()).toEqual(dataset_1k.resultD);
  })
});
