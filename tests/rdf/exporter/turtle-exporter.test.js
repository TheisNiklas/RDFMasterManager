import { TurtleExporter } from "../../../src/rdf/exporter/turtle-exporter";
import { tripleList } from "./fixtures/tripleList.json";
import { expectedResult } from "./fixtures/turtle-exporter.test.json";

describe("NTriplesExporter", () => {
  test("exportTriples", () => {
    let exporter = new TurtleExporter();
    const result = exporter.exportTriples(tripleList);

    expect(result).toEqual(expectedResult);
  });
})
