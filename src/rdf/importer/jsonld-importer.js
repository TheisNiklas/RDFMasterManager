import { Importer } from "./importer";
import { JsonLdParser } from "jsonld-streaming-parser";

export class JsonldImporter extends Importer {
  /**
   *
   * @param {File} file
   * @returns
   */
  async importFromFile(file) {
    let tripleList = [];
    let fileContent = await new Promise((resolve) => {
      let fileReader = new FileReader();
      fileReader.onload = (e) => resolve(fileReader.result.toString());
      fileReader.readAsText(file);
    });
    let parserResult = await new Promise((resolve) => {
      let parserResult = [];
      const parser = new JsonLdParser();
      parser
        .on("data", (data) => parserResult.push(data))
        .on("error", console.error)
        .on("end", () => resolve(parserResult));
      parser.write(fileContent);
      parser.end();
    });

    parserResult.forEach((item) => {
      tripleList.push([item.subject.value, item.predicate.value, item.object.value]);
    });

    return tripleList;
  }
}
