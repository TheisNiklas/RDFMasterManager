import { Importer } from "./importer";
// import { JsonldImporter } from "./jsonld-importer";
// import { NTriplesImporter } from "./ntriples-importer";
// import { TurtleImporter } from "./turtle-importer";
import { Rdfcsa } from "../rdfcsa";

export class ImportService {
  /** @type {{[key: string]: Importer}} */
  #importers = {};
  #rdfcsa;

  /**
   * Service for handling the imports to the database
   * @param {Rdfcsa} rdfcsa Instance of the rdfcsa of this application. Otional.
   */
  constructor(rdfcsa = undefined) {
    // this.registerImporter(new NTriplesImporter(), ["nt"]);
    // this.registerImporter(new JsonldImporter(), ["json", "jsonld"]);
    // this.registerImporter(new TurtleImporter(), ["ttl"]);
    if (rdfcsa === undefined) {
      this.#rdfcsa = new Rdfcsa([]);
    } else {
      this.#rdfcsa = rdfcsa;
    }
  }
  /**
   *
   * @param {File} file file to be imported
   * @param {boolean} replace If `true` the database is replaced with the imported data.
   * If `false` the database is expanded with the imported data.
   * Defaults to false.
   * @returns {Rdfcsa} new or updated RDFCSA
   * @throws {Error} When no importer for the file type is available
   */
  // async importFile(file, replace = false) {
  //   /** @type {Importer} */
  //   let importer;
  //   const fileExtension = file.name.split(".").pop();
  //   try {
  //     importer = this.#importers[fileExtension];
  //   } catch (error) {
  //     throw new Error(`No importer available for files with extension ${fileExtension}`);
  //   }
  //   let tripleList = await importer.importFromFile(file);
  //   if (replace) {
  //     this.#rdfcsa = new Rdfcsa(tripleList);
  //   } else {
  //     // TODO: call appending to database
  //     return;
  //   }
  //   return this.#rdfcsa;
  // }

  /**
   * Create a pre defined sample RDFCSA
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
  // registerImporter(importer, fileExtensions) {
  //   if (!(importer instanceof Importer)) {
  //     throw new Error("The given importer is not based in the interface class Importer");
  //   }
  //   fileExtensions.forEach((fileExt) => {
  //     this.#importers[fileExt] = importer;
  //   });
  // }
}

// TODO: move to better place
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
];
