import { Parser } from "n3";
import { Importer } from "./importer";

export class NTriplesImporter extends Importer {
  importFromFile(file, replace = false) {
    // let reader = new FileReader();
    const parser = new Parser({ format: "N-Triples" });
    // reader.onload = function () {
    //   parser.parse(reader.result);
    // };
    // reader.readAsText(file);

    return parser.parse(file.toString());
  }
}
