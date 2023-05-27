import { Writer } from "n3";
import { RdfJsMapper } from "../rdf-js-mapper";
import { Exporter } from "./exporter";
import FileSaver from "file-saver";

export class TurtleExporter extends Exporter {
  /**
   * Export a given triple list to a file
   * @param {string[][]} tripleList
   */
  exportTriples(tripleList) {
    const writer = new Writer({ format: "Turtle" });
    let rdfJsList = RdfJsMapper.internalToRdfJsList(tripleList);
    writer.addQuads(rdfJsList);
    let resultString;
    writer.end((error, result) => {
      if (error) {
        throw error;
      }
      resultString = result;
      // let blob = new Blob([result], { type: "application/turtle;charset=utf-8" });
      // FileSaver.saveAs(blob, `export.ttl`);
    });
    return resultString;
  }
}
