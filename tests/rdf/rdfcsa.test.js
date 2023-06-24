import { Rdfcsa } from "../../src/rdf/rdfcsa";
import { tripleList, resultPsi, resultGaps, resultD } from "./fixtures/rdfcsa.test.json";
import {dataset_1k} from "./fixtures/1k-dataset.json"

describe("Rdfcsa", () => {
  test("Init with paper sample", () => {
    let rdfcsa = new Rdfcsa(JSON.parse(JSON.stringify(tripleList)));
    expect(rdfcsa.psi).toEqual(resultPsi);
    expect(rdfcsa.gaps).toEqual(resultGaps);
    expect(rdfcsa.D.toString()).toEqual(resultD);
  });

  test ("Init with 1k dataset", () => {
    let rdfcsa = new Rdfcsa(JSON.parse(JSON.stringify(dataset_1k.dataset)));
    expect(rdfcsa.psi).toEqual(dataset_1k.resultPsi);
    expect(rdfcsa.gaps).toEqual(dataset_1k.resultGaps);
    expect(rdfcsa.D.toString()).toEqual(dataset_1k.resultD);
  })

  test("Init with paper sample with JsBitvector", () => {
    let rdfcsa = new Rdfcsa(JSON.parse(JSON.stringify(tripleList)), true);
    expect(rdfcsa.psi).toEqual(resultPsi);
    expect(rdfcsa.gaps).toEqual(resultGaps);
    expect(rdfcsa.D.toString()).toEqual(resultD + "00");
  });

  test ("Init with 1k dataset with JsBitvector", () => {
    let rdfcsa = new Rdfcsa(JSON.parse(JSON.stringify(dataset_1k.dataset)), true);
    expect(rdfcsa.psi).toEqual(dataset_1k.resultPsi);
    expect(rdfcsa.gaps).toEqual(dataset_1k.resultGaps);
    expect(rdfcsa.D.toString()).toEqual(dataset_1k.resultD);
  })
});
