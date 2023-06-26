import {Quad} from "n3"

export class RdfJsMapper {
    /**
     * Map a Rdf.js quad to the internally used format
     * @param {Quad} quad
     * @returns {string[]}
     */
    static rdfJsToInternal(quad: Quad): string[];
    /**
     * Map an array with Rdf.js quads to the internally used format
     * @param {Quad[]} quads
     * @return {string[][]}
     */
    static rdfJsToInternalList(quads: Quad[]): string[][];
    /**
     * Map a triple in the internal format to a Rdf.js quad
     * @param {string[]} triple
     * @returns {Quad}
     */
    static internalToRdfJs(triple: string[]): Quad;
    /**
     * Map an array with triples in the internal format to Rdf.js quads
     * @param {string[][]} triples
     * @returns {Quad[]}
     */
    static internalToRdfJsList(triples: string[][]): Quad[];
}
