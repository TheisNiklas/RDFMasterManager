/*

ONLY FOR DOCUMENTATION PURPOSES, NON FUNCTIONAL

*/

import { Dictionary } from "../../src/rdf/dictionary";
import { exampleTripleList } from "./fixtures/dictionary.test.json";
import { dataset } from "./fixtures/50k-dataset.json";
import { Rdfcsa } from "../../src/rdf/rdfcsa";

describe.skip("Rdfcsa Performance", () => {
  // Result:
  //   28044.61419999972,
  //   10408.972900001332,
  //   10629.306599998847,
  //   10591.830099999905,
  //   10441.939799999818,
  test("oldVersion", () => {
    let times = [];
    for (let i = 0; i < 5; i++) {
      const start = performance.now();
      const data = dataset;
      let rdfcsa = new RdfcsaOld(data);
      const end = performance.now();
      times.push(end-start)
    }
    expect(times).toEqual([])
  });

  // Result:
  //   211.08789999969304,
  //   202.7312000002712,
  //   181.13099999912083,
  //   201.02410000003874,
  //   180.18569999933243,
  test("newVersion", () => {
    let times = [];
    for (let i = 0; i < 5; i++) {
      const start = performance.now();
      const data = dataset;
      let rdfcsa = new RdfcsaNew(data);
      const end = performance.now();
      times.push(end-start)
    }
    expect(times).toEqual([])
  });
});

describe.skip("Dictionary Performance", () => {

  // Result:
  //  2244.7050000000745,
  //  2242.3101000003517,
  //  2235.4105999991298,
  //  2245.219999998808,
  //  2313.2874999996275
  test("oldVersion", () => {
    let times = [];
    for (let i = 0; i < 5; i++) {
      const start = performance.now();
      let dictionary = new Dictionary();
      const data = dataset;
      dictionary.createDictionaries(data);
      const end = performance.now();
      times.push(end-start)
    }
    expect(times).toEqual([])
  });

  // Result:
  //   48.461799999699,
  //   47.788799999281764,
  //   45.72999999858439,
  //   41.03899999894202,
  //   54.7723999992013,

  test("newVersion", () => {
    let times = [];
    for (let i = 0; i < 5; i++) {
      const start = performance.now();
      let dictionary = new DictionaryNew();
      const data = dataset;
      dictionary.createDictionariesNew(data);
      const end = performance.now();
      times.push(end-start)
    }
    expect(times).toEqual([])
  });
});
