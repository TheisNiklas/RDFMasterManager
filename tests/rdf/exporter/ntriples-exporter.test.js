import { NTriplesExporter } from "../../../src/rdf/exporter/ntriples-exporter";
import { tripleList } from "./fixtures/tripleList.json";
import { expectedResult } from "./fixtures/ntriples-exporter.test.json";

describe("NTriplesExporter", () => {
  test("exportTriples", () => {
    let exporter = new NTriplesExporter();
    const result = exporter.exportTriples(tripleList);
    expect(result).toEqual(expectedResult);
  });
});
