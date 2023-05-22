import { Writer } from "n3";
import { RdfJsMapper } from "../rdf-js-mapper";
import { Exporter } from "./exporter";
import FileSaver from "file-saver";
import { JsonLdSerializer } from "jsonld-streaming-serializer";

export class JsonldExporter extends Exporter {
  /**
   * Export a given triple list to a file
   * @param {string[][]} tripleList
   */
  exportTriples(tripleList) {
    const serializer = new JsonLdSerializer({ space: "  " });
    let rdfJsList = RdfJsMapper.internalToRdfJsList(tripleList);

    const fileStream = streamSaver.createWriteStream("export.jsonld");

    serializer.pipe(fileStream);

    rdfJsList.forEach((rdfJsQuad) => {
      serializer.write(rdfJsQuad);
    });
    serializer.end();
  }
}
