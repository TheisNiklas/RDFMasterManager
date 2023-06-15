export class NTriplesImporter extends Importer {
    /**
     *
     * @param {File} file
     * @returns
     */
    importFromFile(file: File): Promise<string[][]>;
}
import { Importer } from "./importer";
