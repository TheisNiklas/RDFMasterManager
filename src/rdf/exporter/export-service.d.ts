export class ExportService {
    /**
     * Serializes a tripleList to a given `format` and starts a download
     * @param {Triple[]} tripleList Triples to be exported.
     * @param {Dictionary} dictionary
     * @param {string} format name the exporter is registered with
     * @param {boolean} isStreamExporter true if the chosen exporter is a `StreamExporter`. Defaults to false.
     * @returns {string} serailized `tripleList` to `fromat`
     * @throws {Error} When no matching exporter is available.
     */
    exportTriples(tripleList: Triple[], dictionary: Dictionary, format: string): string;
    /**
     * Serializes a tripleList to a string of the given `format`.
     * @param {Triple[]} tripleList Triples to be exported.
     * @param {Dictionary} dictionary dictionary from rdfcsa.
     * @param {string} format name the exporter is registered with.
     * @param {{instance: Exporter, extension: string, isStreamExporter: boolean, mimeType: string}} exporterData all relevant inforamtions regarding the exporter. Default to undefined.
     * @returns {Promise} serailized `tripleList` to `fromat`.
     * @throws {Error} When no matching exporter is available.
     */
    serializeTriples(tripleList: Triple[], dictionary: Dictionary, format: string, exporterData?: {
        instance: Exporter;
        extension: string;
        isStreamExporter: boolean;
        mimeType: string;
    }): Promise<any>;
    /**
     * Get two lists with the names of the currently registered exporters.
     * @returns {string[]} List containing the format names of the exporters.
     * @example ["N-Triples", "JSON-LD", "Turtle"]
     */
    getAvailableExporters(): string[];
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
    registerExporter(exporter: Exporter, exporterFormat: string, extension: string, mimeType: string, isStreamExporter?: boolean): void;
    #private;
}
