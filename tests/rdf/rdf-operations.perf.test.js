/*

ONLY FOR DOCUMENTATION PURPOSES, NON FUNCTIONAL

*/

import { Dictionary } from "../../src/rdf/dictionary";
import { exampleTripleList } from "./fixtures/dictionary.test.json";
import { dataset } from "./fixtures/50k-dataset.json";
import { Rdfcsa } from "../../src/rdf/rdfcsa";
import { RdfOperations } from "../../src/rdf/rdf-operations";

describe.skip("Rdfcsa Performance", () => {
  // Result:
  // 7320.471000015736,
  // 7361.938499987125,
  // 7329.729666054249,
  // 7337.786749958992,
  // 7337.0517919659615,
  test("oldVersion", () => {
    let times = [];
    for (let i = 0; i < 5; i++) {
      let rdfcsa = new Rdfcsa(JSON.parse(JSON.stringify(dataset)));
      let ops = new RdfOperations(rdfcsa);
      const start = performance.now();
      ops.addTriple("Peter", "has", "Home");
      const end = performance.now();
      times.push(end-start)
    }
    expect(times).toEqual([])
  });


  // Result:
  // 16.54770803451538,
  // 12.995624959468842,
  // 13.12483298778534,
  // 12.959207952022552,
  // 12.879624962806702,
  test("newVersion", () => {
    let times = [];
    for (let i = 0; i < 5; i++) {
      let rdfcsa = new Rdfcsa(JSON.parse(JSON.stringify(dataset)));
      let ops = new RdfOperations(rdfcsa);
      const start = performance.now();
      ops.addTripleNew("Peter", "has", "Home");
      const end = performance.now();
      times.push(end-start)
    }
    expect(times).toEqual([])
  });
});

describe.skip("Rdfcsa Performance ", () => {

  // Result: 185941.39262497425,
  test("newVersion", () => {
    let times = [];
    for (let i = 0; i < 1; i++) {
      let rdfcsa = new Rdfcsa([["Hans", "haut", "raus"]]);
      const start = performance.now();
      let ops = new RdfOperations(rdfcsa);
      dataset.forEach((triple) => {
        ops.addTripleNew(triple[0], triple[1], triple[2]);
      })
      const end = performance.now();
      times.push(end-start)
    }
    expect(times).toEqual([])
  });
});

