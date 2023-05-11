import { ReadStream } from "fs";
import { Importer } from "./importer";
import { createInterface } from "readline/promises";

export class NTriplesImporter extends Importer {
  /**
   *
   * @param {ReadStream} stream
   * @returns
   */
  importFromFile(stream) {
    // let reader = new FileReader();
    const parser = new Parser({ format: "N-Triples" });
    // reader.onload = function () {
    //   parser.parse(reader.result);
    // };
    // reader.readAsText(file);
    let rl = createInterface(stream);
    rl.on("line", (line) => {
      let lineParts = line.split(" ");
      lineParts.forEach((part) => {
        part.trim().replace(/^</, "").replace(/^>/, "");
      });
    });
    let fileContent = stream.toString();
    lines = fileContent.split("\n");
    let parserResult = parser.parse(stream.toString());

    let tripleList = [];

    parserResult.forEach((item) => {
      tripleList.push([
        item.subject.value,
        item.predicate.value,
        item.object.value,
      ]);
    });

    return tripleList;
  }
}
