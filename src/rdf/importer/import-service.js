import { Importer } from "./importer";
import { JsonldImporter } from "./jsonld-importer";
import { NTriplesImporter } from "./ntriples-importer";
import { TurtleImporter } from "./turtle-importer";
import { Rdfcsa } from "../rdfcsa";
import { RdfOperations } from "../rdf-operations";
import { gunzip, gunzipSync } from "zlib";
import { File, Buffer } from "buffer";

export class ImportService {
  /** @type {{[key: string]: Importer}} */
  #importers = {};
  #rdfcsa;

  /**
   * Service for handling the imports to the database
   * @param {Rdfcsa} rdfcsa Instance of the rdfcsa of this application. Otional.
   */
  constructor(rdfcsa = undefined) {
    this.registerImporter(new NTriplesImporter(), ["nt"]);
    this.registerImporter(new JsonldImporter(), ["json", "jsonld"]);
    this.registerImporter(new TurtleImporter(), ["ttl"]);
    this.registerImporter(undefined, ["rdfcsa"]);
    if (rdfcsa === undefined) {
      this.#rdfcsa = new Rdfcsa([]);
    } else {
      this.#rdfcsa = rdfcsa;
    }
  }
  /**
   * Import a file to create or append to an rdfcsa database
   * @param {File} file file to be imported
   * @param {boolean} replace If `true` the database is replaced with the imported data.
   * If `false` the database is expanded with the imported data.
   * Defaults to false.
   * @returns {Rdfcsa} new or updated RDFCSA
   * @throws {Error} When no importer for the file type is available
   */
  async importFile(file, replace = true, useJsBitvector = true) {
    /** @type {Importer} */
    let importer;
    const fileExtension = file.name.split(".").pop();
    if (fileExtension === "rdfcsa") {
      if (replace) {
        this.#rdfcsa = this.#loadNativeDatabase(file);
        return this.#rdfcsa;
      } else {
        return this.#rdfcsa;
      }
    }
    try {
      importer = this.#importers[fileExtension];
    } catch (error) {
      throw new Error(`No importer available for files with extension ${fileExtension}`);
    }
    let tripleList = await importer.importFromFile(file);
    if (replace) {
      this.#rdfcsa = new Rdfcsa(tripleList, useJsBitvector);
    } else {
      tripleList.forEach((triple) => {
        const rdfOperations = new RdfOperations(this.#rdfcsa);
        rdfOperations.addTriple(triple[0], triple[1], triple[2]);
      });
      return this.#rdfcsa;
    }
    return this.#rdfcsa;
  }

  /**
   * Create a pre defined sample RDFCSA, the sample from the paper is used
   * @returns {Rdfcsa} RDFCSA containing the sample data
   */
  loadSample() {
    this.#rdfcsa = new Rdfcsa(JSON.parse(JSON.stringify(sampleData)));
    return this.#rdfcsa;
  }

  /**
   * Registers a new importer for the specified file extensions
   * If for a given file extensions an importer already exists, it is replaced with the new one
   * @param {Importer} importer Instance of the importer
   * @param {string[]} fileExtensions List of the file extensions the importer should be applied to
   * @throws {Error} When the `importer` is not based on the Importer interface class
   */
  registerImporter(importer, fileExtensions) {
    if (!(importer instanceof Importer) && importer != undefined) {
      throw new Error("The given importer is not based in the interface class Importer");
    }
    fileExtensions.forEach((fileExt) => {
      this.#importers[fileExt] = importer;
    });
  }

  /**
   * Loads a file containing the native database format and creates a new database from it
   * @param {File} file
   */
  async #loadNativeDatabase(file) {
    let deserialized = await new Promise(async (resolve) => {
      const fileContent = await file.arrayBuffer();
      const buffer = Buffer.from(fileContent);
      const decompressed = gunzipSync(buffer);
      resolve(JSON.parse(decompressed.toString()));
    });
    let rdfcsa = new Rdfcsa([]);
    rdfcsa.D.bits = new Uint32Array(Object.values(deserialized.D.bits));
    rdfcsa.D.arrayLength = deserialized.D.arrayLength;
    rdfcsa.dictionary.SO = deserialized.dictionary.SO;
    rdfcsa.dictionary.S = deserialized.dictionary.S;
    rdfcsa.dictionary.P = deserialized.dictionary.P;
    rdfcsa.dictionary.O = deserialized.dictionary.O;
    rdfcsa.gaps = deserialized.gaps;
    rdfcsa.psi = deserialized.psi;
    rdfcsa.tripleCount = deserialized.triple;
    return rdfcsa;
  }
}

const sampleData = [
  ["SO:Inception", "P:filmedin", "SO:L.A."],
  ["SO:L.A.", "P:cityof", "O:USA"],
  ["S:E.Page", "P:appearsin", "SO:Inception"],
  ["S:E.Page", "P:bornin", "O:Canada"],
  ["S:L.DiCaprio", "P:appearsin", "SO:Inception"],
  ["S:L.DiCaprio", "P:bornin", "O:USA"],
  ["S:L.DiCaprio", "P:awarded", "O:Oscar2015"],
  ["S:J.Gordon", "P:appearsin", "SO:Inception"],
  ["S:J.Gordon", "P:bornin", "O:USA"],
  ["S:J.Gordon", "P:livesin", "SO:L.A."],
  ["RDFCSA:METADATA", "METADATA:arrowColor", "METADATA:#8fce00"],
];
