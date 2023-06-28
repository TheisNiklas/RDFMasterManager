/**
 * Contributions made by:
 * Niklas Theis
 * Tobias Kaps
 */

import { Parser } from "n3";
import { Importer } from "./importer";
import { RdfJsMapper } from "../rdf-js-mapper";

export class NTriplesImporter extends Importer {
  /**
   * Reads in a file and extracts the triples
   * @param {File} file
   * @returns
   */
  async importFromFile(file) {
    let fileContent = await new Promise((resolve) => {
      let fileReader = new FileReader();
      fileReader.onload = (e) => resolve(fileReader.result.toString());
      fileReader.readAsText(file);
    });
    const parser = new Parser({ format: "N-Triples" });

    const parserResult = parser.parse(fileContent);

    return RdfJsMapper.rdfJsToInternalList(parserResult);
  }
}
