import { Writer } from "n3";
import { RdfJsMapper } from "../rdf-js-mapper";
import { Exporter } from "./exporter";

export class NTriplesExporter extends Exporter {
  /**
   * Export a given triple list to a file
   * @param {string[][]} tripleList
   * @returns {string}
   */
  exportTriples(tripleList) {
    const writer = new Writer({ format: "N-Triples" });
    let rdfJsList = RdfJsMapper.internalToRdfJsList(tripleList);
    writer.addQuads(rdfJsList);
    let resultString;
    writer.end((error, result) => {
      if (error) {
        throw error;
      }
      resultString = result;
      // let blob = new Blob([result], { type: "application/n-triples;charset=utf-8" });
      // FileSaver.saveAs(blob, `export.nt`);
    });
    return resultString;
  }
}