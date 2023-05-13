import { readFile } from "fs";
import { NTriplesImporter } from "../../../src/rdf/importer/ntriples-importer";
import { fixture } from "./fixtures/ntriples-import.test.json";

describe("NTriplesImport", () => {
  test("importFromFile", () => {
    let importer = new NTriplesImporter();
    readFile("tests/rdf/import/fixtures/nTriplePaper.nt", (err, data) => {
      if (!err) {
        let res = importer.importFromFile(data);
        expect(res).toEqual(fixture);
      } else {
        fail("loading fixture file failed");
      }
    });
  });
});
