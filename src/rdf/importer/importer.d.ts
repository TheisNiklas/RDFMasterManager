export class Importer {
    /**
     * Reads in a file and extracts the triples
     * @param {File} file
     * @returns {string[][]} Array containing the extracted triples as string[]
     */
    importFromFile(file: File): Promise<string[][]>;
}
