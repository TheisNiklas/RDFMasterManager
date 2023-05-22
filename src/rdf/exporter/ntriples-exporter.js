import { Writer } from "n3";
import { RdfJsMapper } from "../rdf-js-mapper";
import { Exporter } from "./exporter";
import FileSaver from "file-saver";

export class NTriplesExporter extends Exporter {
  /**
   * Export a given triple list to a file
   * @param {string[][]} tripleList
   */
  exportTriples(tripleList) {
    const writer = new Writer({ format: "N-Triples" });
    let rdfJsList = RdfJsMapper.internalToRdfJsList(tripleList);
    writer.addQuads(rdfJsList);
    writer.end((error, result) => {
      if (error) {
        throw error;
      }
      let blob = new Blob([result], { type: "application/n-triples;charset=utf-8" });
      FileSaver.saveAs(blob, `export.nt`);
    });
  }
}
