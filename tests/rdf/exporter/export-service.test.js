import { ExportService } from "../../../src/rdf/exporter/export-service";

import { Triple } from "../../../src/rdf/models/triple";
import { Rdfcsa } from "../../../src/rdf/rdfcsa";
import { tripleList } from "./fixtures/tripleList.json";

describe("ExportService", () => {
  /** @type {ExportService} */
  let exportService;
  /** @type {Rdfcsa} */
  let rdfcsa;
  beforeEach(() => {
    exportService = new ExportService();
    rdfcsa = new Rdfcsa(JSON.parse(JSON.stringify(tripleList)));
  });
  test("serializeTriples(N-Triples)", async () => {
    const input = [
      { subject: 0, predicate: 9, object: 12 },
      { subject: 1, predicate: 8, object: 15 },
      { subject: 2, predicate: 5, object: 11 },
      { subject: 2, predicate: 7, object: 13 },
      { subject: 3, predicate: 5, object: 11 },
      { subject: 3, predicate: 7, object: 15 },
      { subject: 3, predicate: 10, object: 12 },
      { subject: 4, predicate: 5, object: 11 },
      { subject: 4, predicate: 6, object: 14 },
      { subject: 4, predicate: 7, object: 15 },
    ];
    const result = await exportService.serializeTriples(input, rdfcsa.dictionary, "N-Triples");
    expect(result).toEqual(
      "<SO:Inception> <P:filmedin> <SO:L.A.> .\n<SO:L.A.> <P:cityof> <O:USA> .\n<S:E.Page> <P:appearsin> <SO:Inception> .\n<S:E.Page> <P:bornin> <O:Canada> .\n<S:J.Gordon> <P:appearsin> <SO:Inception> .\n<S:J.Gordon> <P:bornin> <O:USA> .\n<S:J.Gordon> <P:livesin> <SO:L.A.> .\n<S:L.DiCaprio> <P:appearsin> <SO:Inception> .\n<S:L.DiCaprio> <P:awarded> <O:Oscar2015> .\n<S:L.DiCaprio> <P:bornin> <O:USA> .\n"
    );
  });
  test("serializeTriples(Turtle)", async () => {
    const input = [
      { subject: 0, predicate: 9, object: 12 },
      { subject: 1, predicate: 8, object: 15 },
      { subject: 2, predicate: 5, object: 11 },
      { subject: 2, predicate: 7, object: 13 },
      { subject: 3, predicate: 5, object: 11 },
      { subject: 3, predicate: 7, object: 15 },
      { subject: 3, predicate: 10, object: 12 },
      { subject: 4, predicate: 5, object: 11 },
      { subject: 4, predicate: 6, object: 14 },
      { subject: 4, predicate: 7, object: 15 },
    ];
    const result = await exportService.serializeTriples(input, rdfcsa.dictionary, "Turtle");
    expect(result).toEqual(
      "<SO:Inception> <P:filmedin> <SO:L.A.>.\n<SO:L.A.> <P:cityof> <O:USA>.\n<S:E.Page> <P:appearsin> <SO:Inception>;\n    <P:bornin> <O:Canada>.\n<S:J.Gordon> <P:appearsin> <SO:Inception>;\n    <P:bornin> <O:USA>;\n    <P:livesin> <SO:L.A.>.\n<S:L.DiCaprio> <P:appearsin> <SO:Inception>;\n    <P:awarded> <O:Oscar2015>;\n    <P:bornin> <O:USA>.\n"
    );
  });
  test("serializeTriples(JSON-LD)", async () => {
    const input = [
      { subject: 0, predicate: 9, object: 12 },
      { subject: 1, predicate: 8, object: 15 },
      { subject: 2, predicate: 5, object: 11 },
      { subject: 2, predicate: 7, object: 13 },
      { subject: 3, predicate: 5, object: 11 },
      { subject: 3, predicate: 7, object: 15 },
      { subject: 3, predicate: 10, object: 12 },
      { subject: 4, predicate: 5, object: 11 },
      { subject: 4, predicate: 6, object: 14 },
      { subject: 4, predicate: 7, object: 15 },
    ];
    const result = await exportService.serializeTriples(input, rdfcsa.dictionary, "JSON-LD", true);
    expect(result).toEqual(
      '[\n  {\n    "@id": "SO:Inception",\n    "P:filmedin": [\n      {\n        "@id": "SO:L.A."\n      }\n    ]\n  },\n  {\n    "@id": "SO:L.A.",\n    "P:cityof": [\n      {\n        "@id": "O:USA"\n      }\n    ]\n  },\n  {\n    "@id": "S:E.Page",\n    "P:appearsin": [\n      {\n        "@id": "SO:Inception"\n      }\n    ],\n    "P:bornin": [\n      {\n        "@id": "O:Canada"\n      }\n    ]\n  },\n  {\n    "@id": "S:J.Gordon",\n    "P:appearsin": [\n      {\n        "@id": "SO:Inception"\n      }\n    ],\n    "P:bornin": [\n      {\n        "@id": "O:USA"\n      }\n    ],\n    "P:livesin": [\n      {\n        "@id": "SO:L.A."\n      }\n    ]\n  },\n  {\n    "@id": "S:L.DiCaprio",\n    "P:appearsin": [\n      {\n        "@id": "SO:Inception"\n      }\n    ],\n    "P:awarded": [\n      {\n        "@id": "O:Oscar2015"\n      }\n    ],\n    "P:bornin": [\n      {\n        "@id": "O:USA"\n      }\n    ]\n  }\n]\n'
    );
  });

  ("Turtle");
});
