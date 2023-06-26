export class JsonldImporter extends Importer {
    /**
     *
     * @param {File} file
     * @returns
     */
    importFromFile(file: File): Promise<any[]>;
}
import { Importer } from "./importer";
