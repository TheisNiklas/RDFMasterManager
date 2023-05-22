import { Dictionary } from "../dictionary";
import { Exporter } from "./exporter";
import { Triple } from "../models/triple";
import { NTriplesExporter } from "./ntriples-exporter";
import { TurtleExporter } from "./turtle-exporter";
import { JsonldExporter } from "./jsonld-exporter";
import { StreamExporter } from "./stream-exporter";

export class ExportServer {
  /** @type {{[key: string]: Exporter}} */
  #exporters = {};
  // TODO: check as far this could be nessecary and how usable is it?
  /** @type {{[key: string]: StreamExporter}} */
  #streamExporters = {};

  /**
   * Service for handling the exports
   */
  constructor() {
    this.registerExporter(new NTriplesExporter(), ["N-Triples"]);
    this.registerExporter(new JsonldExporter(), ["JSON-LD"]);
    this.registerExporter(new TurtleExporter(), ["Turtle"]);
  }

  /**
   *
   * @param {Triple[]} tripleList Triples to be exported.
   * @param {string} format name the exporter is registered with
   * @param {Dictionary} dictionary
   * @param {boolean} isStreamExporter true if the chosen exporter is a `StreamExporter`. Defaults to false.
   * @throws {Error} When no matching exporter is available.
   */
  async exportTriples(tripleList, dictionary, format, isStreamExporter = false) {
    /** @type {Exporter | StreamExporter} */
    let exporter;
    try {
      if (isStreamExporter) {
        exporter = this.#streamExporters[format];
      } else {
        exporter = this.#exporters[format];
      }
    } catch (error) {
      throw Error(
        `No exporter available for format ${format} in category ${isStreamExporter ? "normal" : "streaming"}`
      );
    }

    const tripleStringList = this.#translateTripleIds(tripleList, dictionary);
    exporter.exportTriples(tripleStringList);
  }

  /**
   * Get two lists with the names of the currently registered exporters
   * @returns {string[][]} Tuple containing two list.
   * First list contains the names of the normal exporters.
   * Second list contains the names of the stream exporters.
   */
  getAvailableExporters() {
    const normalExporters = Object.getOwnPropertyNames(this.#exporters);
    const streamExporters = Object.getOwnPropertyNames(this.#streamExporters);
    return [normalExporters, streamExporters];
  }

  /**
   * Registers a new exporter for the specified format
   * If for a given format an exporter already exists, it is replaced with the new one
   * @param {Exporter} exporter Instance of the exporter
   * @param {string} exporterFormat Format the exporter should be registered with
   * @throws {Error} When the `exporter` is not based on the Exporter or StreamExporter interface class
   */
  registerExporter(exporter, exporterFormat) {
    if (exporter instanceof Exporter) {
      this.#exporters[exporterFormat] = exporter;
    } else if (exporter instanceof StreamExporter) {
      this.#streamExporters[exporterFormat] = exporter;
    } else {
      throw Error("The given exporter is not based in the interface class Importer or StreamImporter");
    }
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
        dictionary.getSubjectById(triple.subject),
        dictionary.getPredicateById(triple.predicate),
        dictionary.getObjectById(triple.object),
      ]);
    });
    return resultList;
  }
}