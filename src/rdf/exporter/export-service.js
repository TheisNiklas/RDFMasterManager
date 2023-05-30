import { Dictionary } from "../dictionary";
import { Exporter } from "./exporter";
import { Triple } from "../models/triple";
import { NTriplesExporter } from "./ntriples-exporter";
import { TurtleExporter } from "./turtle-exporter";
import { JsonldExporter } from "./jsonld-exporter";
import { saveAs } from "file-saver";

export class ExportService {
  /** @type {{[key: string]: Exporter}} */
  #exporters = {};

  /**
   * Service for handling the exports
   */
  constructor() {
    this.registerExporter(new NTriplesExporter(), ["N-Triples"], "nt", "application/n-triples");
    this.registerExporter(new JsonldExporter(), ["JSON-LD"], "jsonld", "application/ld+json", true);
    this.registerExporter(new TurtleExporter(), ["Turtle"], "ttl", "text/turtle");
  }

  /**
   * Serializes a tripleList to a given `format` and starts a download
   * @param {Triple[]} tripleList Triples to be exported.
   * @param {Dictionary} dictionary
   * @param {string} format name the exporter is registered with
   * @param {boolean} isStreamExporter true if the chosen exporter is a `StreamExporter`. Defaults to false.
   * @returns {string} serailized `tripleList` to `fromat`
   * @throws {Error} When no matching exporter is available.
   */
  async exportTriples(tripleList, dictionary, format) {
    const exporterData = this.#getExporter(format);

    const result = await this.serializeTriples(tripleList, dictionary, format, exporterData);
    let blob = new Blob([result], { type: exporterData.mimeType });
    saveAs(blob, `export.${exporterData.extension}`);
  }

  /**
   * Serializes a tripleList to a string of the given `format`.
   * @param {Triple[]} tripleList Triples to be exported.
   * @param {Dictionary} dictionary dictionary from rdfcsa.
   * @param {string} format name the exporter is registered with.
   * @param {{instance: Exporter, extension: string, isStreamExporter: boolean, mimeType: string}} exporterData all relevant inforamtions regarding the exporter. Default to undefined.
   * @returns {Promise} serailized `tripleList` to `fromat`.
   * @throws {Error} When no matching exporter is available.
   */
  async serializeTriples(tripleList, dictionary, format, exporterData = undefined) {
    if (exporterData === undefined) {
      exporterData = this.#getExporter(format);
    }

    const tripleStringList = this.#translateTripleIds(tripleList, dictionary);
    if (exporterData.isStreamExporter) {
      const stream = exporterData.instance.exportTriples(tripleStringList);
      const result = await new Promise((resolve) => {
        let resultString = "";
        stream.on("data", (chunk) => (resultString += chunk)).on("end", () => resolve(resultString));
        stream.end();
      });
      return result;
    } else {
      return exporterData.instance.exportTriples(tripleStringList);
    }
  }

  /**
   * Get two lists with the names of the currently registered exporters.
   * @returns {string[]} List containing the format names of the exporters.
   * @example ["N-Triples", "JSON-LD", "Turtle"]
   */
  getAvailableExporters() {
    const exporters = Object.getOwnPropertyNames(this.#exporters);
    return exporters;
  }

  /**
   * Registers a new exporter for the specified format
   * If for a given format an exporter already exists, it is replaced with the new one
   * @param {Exporter} exporter Instance of the exporter
   * @param {string} exporterFormat Format the exporter should be registered with
   * @param {string} extension File extension for the exported file
   * @param {string} mimeType MIME type of the exported format
   * @param {boolean} isStreamExporter
   * @throws {Error} When the `exporter` is not based on the Exporter or StreamExporter interface class
   */
  registerExporter(exporter, exporterFormat, extension, mimeType, isStreamExporter = false) {
    if (exporter.exportTriples === undefined) {
      throw Error("The given exporter is not based on the interface class Importer or StreamImporter");
    }
    this.#exporters[exporterFormat] = {instance: exporter, extension: extension, isStreamExporter: isStreamExporter, mimeType: mimeType};
  }

  /**
   * Translates the ids in a list with `Triple`s to strings
   * @param {Triple[]} tripleList
   * @param {Dictionary} dictionary
   * @returns {string[][]}
   */
  #translateTripleIds(tripleList, dictionary) {
    let resultList = [];
    tripleList.forEach((triple) => {
      resultList.push([
        dictionary.getElementById(triple.subject),
        dictionary.getElementById(triple.predicate),
        dictionary.getElementById(triple.object),
      ]);
    });
    return resultList;
  }

  /**
   * 
   * @param {string} format 
   * @returns {{instance: Exporter, extension: string, isStreamExporter: boolean, mimeType: string}}
   */
  #getExporter(format) {
    let exporter = this.#exporters[format];
    if (exporter === undefined) {
      throw Error(
        `No exporter available for format ${format} in category ${isStreamExporter ? "normal" : "streaming"}`
      );
    }
    return exporter;
  }
}
