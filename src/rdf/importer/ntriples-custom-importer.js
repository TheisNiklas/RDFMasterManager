import { ReadStream } from "fs";
import { Importer } from "./importer";
import { createInterface } from "readline/promises";

export class NTriplesImporter extends Importer {
  /**
   *
   * @param {ReadStream} stream
   * @returns {string[][]}
   */
  importFromFile(stream) {
    let tripleList = [];
    let rl = createInterface({ input: stream, crlfDelay: Infinity });
    rl.on("line", (line) => {
      let lineParts = line.split(" ");
      let triple = [];
      lineParts.forEach((part) => {
        part
          .trim()
          .replace(/^</, "")
          .replace(/>$/, "")
          .replace(/^\"/, "")
          .replace(/\"$/, "");
        triple.push(part);
      });
      tripleList.push(triple);
    });
    return tripleList;
  }
}
