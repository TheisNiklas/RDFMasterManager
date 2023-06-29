import { JsonldExporter } from "../../../src/rdf/exporter/jsonld-exporter";
import { tripleList } from "./fixtures/tripleList.json";
import { expectedResult } from "./fixtures/jsonld-exporter.test.json";
import { Jest } from "jest";

describe("JsonldExporter", () => {
  test("exportTriples", (done) => {
    let exporter = new JsonldExporter();
    const stream = exporter.exportTriples(tripleList);
    let result = "";
    stream
      .on("data", (data) => {
        result += data;
      })
      .on("end", () => {
        expect(result).toEqual(expectedResult);
        done();
      });
    stream.end();
  });
});
