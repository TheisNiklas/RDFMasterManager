import { readFileSync } from "fs";
import { ImportService } from "../../../src/rdf/importer/import-service";
import { Rdfcsa } from "../../../src/rdf/rdfcsa";
import { ourSample, paperSample } from "../fixtures/rdfcsa.test.json";

describe("ImportService", () => {
  /** @type {ImportService} */
  let importService;
  beforeEach(() => {
    importService = new ImportService();
  });
  test("import N-Triples file", async () => {
    let res = undefined;
    try {
      var data = readFileSync("tests/rdf/importer/fixtures/paper-sample.nt");
      let blob = new Blob([data.toString()]);
      let file = new File([blob], "temp.nt");
      res = await importService.importFile(file, true);
    } catch (error) {
      fail("loading fixture file failed");
    }
    expect(res).toBeInstanceOf(Rdfcsa);
    expect(res.D.toString()).toEqual(paperSample.resultD);
    expect(res.psi).toEqual(paperSample.resultPsi);
    expect(res.gaps).toEqual(paperSample.resultGaps);
    expect(res.dictionary.SO).toEqual(["SO:Inception", "SO:L.A."]);
    expect(res.dictionary.S).toEqual(["S:E.Page", "S:J.Gordon", "S:L.DiCaprio"]);
    expect(res.dictionary.P).toEqual(["P:appearsin", "P:awarded", "P:bornin", "P:cityof", "P:filmedin", "P:livesin"]);
    expect(res.dictionary.O).toEqual(["O:Canada", "O:Oscar2015", "O:USA"]);
  });
  test("import Turtle file", async () => {
    let res = undefined;
    try {
      var data = readFileSync("tests/rdf/importer/fixtures/paper-sample.ttl");
      let blob = new Blob([data.toString()]);
      let file = new File([blob], "temp.ttl");
      res = await importService.importFile(file, true);
    } catch (error) {
      fail("loading fixture file failed");
    }
    expect(res).toBeInstanceOf(Rdfcsa);
    expect(res.D.toString()).toEqual(paperSample.resultD);
    expect(res.psi).toEqual(paperSample.resultPsi);
    expect(res.gaps).toEqual(paperSample.resultGaps);
    expect(res.dictionary.SO).toEqual(["SO:Inception", "SO:L.A."]);
    expect(res.dictionary.S).toEqual(["S:E.Page", "S:J.Gordon", "S:L.DiCaprio"]);
    expect(res.dictionary.P).toEqual(["P:appearsin", "P:awarded", "P:bornin", "P:cityof", "P:filmedin", "P:livesin"]);
    expect(res.dictionary.O).toEqual(["O:Canada", "O:Oscar2015", "O:USA"]);
  });
  test("import json-ld file", async () => {
    let res = undefined;
    try {
      var data = readFileSync("tests/rdf/importer/fixtures/paper-sample.jsonld");
      let blob = new Blob([data.toString()]);
      let file = new File([blob], "temp.jsonld");
      res = await importService.importFile(file, true);
    } catch (error) {
      fail("loading fixture file failed");
    }
    expect(res).toBeInstanceOf(Rdfcsa);
    expect(res.D.toString()).toEqual(paperSample.resultD);
    expect(res.psi).toEqual(paperSample.resultPsi);
    expect(res.gaps).toEqual(paperSample.resultGaps);
    expect(res.dictionary.SO).toEqual(["SO:Inception", "SO:L.A."]);
    expect(res.dictionary.S).toEqual(["S:E.Page", "S:J.Gordon", "S:L.DiCaprio"]);
    expect(res.dictionary.P).toEqual(["P:appearsin", "P:awarded", "P:bornin", "P:cityof", "P:filmedin", "P:livesin"]);
    expect(res.dictionary.O).toEqual(["O:Canada", "O:Oscar2015", "O:USA"]);
  });

  test("load sample", () => {
    let res = undefined;
    res = importService.loadSample();
    expect(res).toBeInstanceOf(Rdfcsa, true);
    expect(res.D.toString()).toEqual(ourSample.resultD);
    expect(res.psi).toEqual(ourSample.resultPsi);
    expect(res.gaps).toEqual(ourSample.resultGaps);
    expect(res.dictionary.SO).toEqual(["SO:Inception", "SO:L.A."]);
    expect(res.dictionary.S).toEqual(["RDFCSA:METADATA", "S:E.Page", "S:J.Gordon", "S:L.DiCaprio"]);
    expect(res.dictionary.P).toEqual([
      "METADATA:arrowColor",
      "P:appearsin",
      "P:awarded",
      "P:bornin",
      "P:cityof",
      "P:filmedin",
      "P:livesin",
    ]);
    expect(res.dictionary.O).toEqual(["METADATA:#8fce00", "O:Canada", "O:Oscar2015", "O:USA"]);
  });
});
