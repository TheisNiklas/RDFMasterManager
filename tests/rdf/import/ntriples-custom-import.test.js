import { createReadStream } from "fs";
import { NTriplesImporter } from "../../../src/rdf/importer/ntriples-custom-importer";
import { fixture } from "./fixtures/ntriples-import.test.json";

describe("NTriplesImport", () => {
  test("importFromFile", () => {
    let importer = new NTriplesImporter();
    let stream = createReadStream("tests/rdf/import/fixtures/nTriplePaper.nt");
    let res = importer.importFromFile(stream);
    expect(res).toEqual(fixture);
  });
});
