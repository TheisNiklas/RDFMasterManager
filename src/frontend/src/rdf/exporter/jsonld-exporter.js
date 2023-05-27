import { Writer } from "n3";
import { RdfJsMapper } from "../rdf-js-mapper";
import { StreamExporter } from "./stream-exporter";
import FileSaver from "file-saver";
import { JsonLdSerializer } from "jsonld-streaming-serializer";

export class JsonldExporter extends StreamExporter {
  /**
   * Export a given triple list to a file
   * @param {string[][]} tripleList
   * @returns {}
   */
  exportTriples(tripleList) {
    const serializer = new JsonLdSerializer({ space: "  " });
    let rdfJsList = RdfJsMapper.internalToRdfJsList(tripleList);

    rdfJsList.forEach((rdfJsQuad) => {
      serializer.write(rdfJsQuad);
    });
    return serializer;
  }
}