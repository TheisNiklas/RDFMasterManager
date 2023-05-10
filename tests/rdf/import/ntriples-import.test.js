import { readFile } from "fs";
import { NTriplesImporter } from "../../../src/rdf/importer/ntriples-importer";
import { fixture } from "./fixtures/ntriples-import.test.json";

describe("NTriplesImport", () => {
  test("importFromFile", () => {
    let importer = new NTriplesImporter();
    readFile("fixture/nTripleSample.nt", (err, data) => {
      let deb = jest;
      if (!err) {
        let res = importer.importFromFile(data);
        expect(res).toEqual(fixture);
      }
    });
  });
});
