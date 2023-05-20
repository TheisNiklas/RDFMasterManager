import { readFileSync } from "fs";
import { JsonldImporter } from "../../../src/rdf/importer/jsonld-importer";
import { expectedResult } from "./.fixtures/ntriples-import.test.json";

describe("NTriplesImport", () => {
  test("importFromFile", async () => {
    let importer = new JsonldImporter();
    let res = undefined;
    try {
      var data = readFileSync("tests/rdf/import/fixtures/paper-sample.jsonld");
      let blob = new Blob([data.toString()]);
      let file = new File([blob], "temp.json");
      res = await importer.importFromFile(file);
    } catch (error) {
      fail("loading fixture file failed");
    }
    expect(res).toEqual(expectedResult);
  });
});
