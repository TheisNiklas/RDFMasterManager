export class NTriplesExporter extends Exporter {
    /**
     * Export a given triple list to a file
     * @param {string[][]} tripleList
     * @returns {string}
     */
    exportTriples(tripleList: string[][]): string;
}
import { Exporter } from "./exporter";
