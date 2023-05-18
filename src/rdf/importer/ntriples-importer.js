import { Parser } from "n3";
import { Importer } from "./importer";

export class NTriplesImporter extends Importer {
  /**
   *
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

    let tripleList = [];
    const parserResult = parser.parse(fileContent);

    parserResult.forEach((item) => {
      tripleList.push([item.subject.value, item.predicate.value, item.object.value]);
    });
    return tripleList;
  }
}
