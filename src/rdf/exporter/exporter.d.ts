export class Exporter {
    /**
     * Export a given triple list to a file
     * @param {string[][]} tripleList
     * @returns {_Readable._Writable}
     */
    exportTriples(tripleList: string[][]): _Readable._Writable;
}
