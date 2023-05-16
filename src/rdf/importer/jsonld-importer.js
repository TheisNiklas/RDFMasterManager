import { Importer } from "./importer";
import * as jsonld from "jsonld";

export class JsonldImporter extends Importer {
  async importFromFile(file, replace = false) {
    // let reader = new FileReader();
    const parser = new Parser({ format: "N-Triples" });
    // reader.onload = function () {
    //   parser.parse(reader.result);
    // };
    // reader.readAsText(file);

    const deb = await jsonld.flatten(file);

    return tripleList;
  }
}