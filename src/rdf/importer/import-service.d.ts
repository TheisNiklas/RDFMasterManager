export class ImportService {
    /**
     * Service for handling the imports to the database
     * @param {Rdfcsa} rdfcsa Instance of the rdfcsa of this application. Otional.
     */
    constructor(rdfcsa?: Rdfcsa);
    /**
     *
     * @param {File} file file to be imported
     * @param {boolean} replace If `true` the database is replaced with the imported data.
     * If `false` the database is expanded with the imported data.
     * Defaults to false.
     * @returns {Rdfcsa} new or updated RDFCSA
     * @throws {Error} When no importer for the file type is available
     */
    importFile(file: File, replace?: boolean): Rdfcsa;
    /**
     * Create a pre defined sample RDFCSA
     * @returns {Rdfcsa} RDFCSA containing the sample data
     */
    loadSample(): Rdfcsa;
    /**
     * Registers a new importer for the specified file extensions
     * If for a given file extensions an importer already exists, it is replaced with the new one
     * @param {Importer} importer Instance of the importer
     * @param {string[]} fileExtensions List of the file extensions the importer should be applied to
     * @throws {Error} When the `importer` is not based on the Importer interface class
     */
    registerImporter(importer: Importer, fileExtensions: string[]): void;
    #private;
}
import { Rdfcsa } from "../rdfcsa";
import { Importer } from "./importer";
