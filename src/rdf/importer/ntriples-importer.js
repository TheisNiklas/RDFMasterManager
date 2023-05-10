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

    let parserResult =  parser.parse(file.toString());

    let tripleList = []

    parserResult.forEach((item) => {
      tripleList.push([
        item.subject.value,
        item.predicate.value,
        item.object.value
      ]);
    })

    return tripleList;
  }
}
