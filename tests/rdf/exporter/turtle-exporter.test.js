import { TurtleExporter } from "../../../src/rdf/exporter/turtle-exporter";
import { tripleList } from "./.fixtures/tripleList.json";
import { expectedResult } from "./.fixtures/turtle-exporter.test.json";
import FileSaver from "file-saver";

describe("NTriplesExporter", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  test("exportTriples", () => {
    // Init mocks for FileSaver.saveAs and new Blob()
    const spy = jest.spyOn(FileSaver, "saveAs");
    global.Blob = function (content, options) {
      return { content, options };
    };

    let exporter = new TurtleExporter();
    exporter.exportTriples(tripleList);

    expect(spy).toHaveBeenCalledWith(
      { content: expectedResult, options: { type: "application/turtle;charset=utf-8" } },
      "export.ttl"
    );
  });
});
