import { readFileSync } from "fs";
import { NTriplesImporter } from "../../../src/rdf/importer/ntriples-importer";
import { expectedResult } from "./fixtures/ntriples-import.test.json";

describe("NTriplesImport", () => {
  test("importFromFile", async () => {
    let importer = new NTriplesImporter();
    let res = undefined;
    try {
      var data = readFileSync("tests/rdf/importer/fixtures/paper-sample.nt");
      let blob = new Blob([data.toString()]);
      let file = new File([blob], "temp.nt");
      res = await importer.importFromFile(file);
    } catch (error) {
      fail("loading fixture file failed");
    }
    expect(res).toEqual(expectedResult);
  });
});
