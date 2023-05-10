import { readFile } from "fs";
import { NTriplesImporter } from "../../../src/rdf/importer/ntriples-importer";

describe("NTriplesImport", () => {
  test("importFromFile", () => {
    let importer = new NTriplesImporter();
    readFile("tests/rdf/exampleData.nt", (err, data) => {
      if (!err) {
        res = importer.importFromFile(data);
        expect(res).toBe(null);
      }
    });
  });
});
