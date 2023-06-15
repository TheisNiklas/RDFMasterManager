export class Rdfcsa {
    /**
     * Creates the rdfcsa datastructure
     * @param {string[][]} tripleList
     */
    constructor(tripleList: string[][]);
    tripleCount: number;
    dictionary: Dictionary;
    D: number[];
    psi: number[];
    gaps: number[];
    #private;
}
import { Dictionary } from "./dictionary";
