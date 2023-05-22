import { readFileSync } from "fs";
import { TurtleImporter } from "../../../src/rdf/importer/turtle-importer";
import { expectedResult } from "./fixtures/ntriples-import.test.json";

describe("NTriplesImport", () => {
  test("importFromFile", async () => {
    let importer = new TurtleImporter();
    let res = undefined;
    try {
      var data = readFileSync("tests/rdf/importer/fixtures/paper-sample.ttl");
      let blob = new Blob([data.toString()]);
      let file = new File([blob], "temp.nt");
      res = await importer.importFromFile(file);
    } catch (error) {
      fail("loading fixture file failed");
    }
    expect(res).toEqual(expectedResult);
  });
});
