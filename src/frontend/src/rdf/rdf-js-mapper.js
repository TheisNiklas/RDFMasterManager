import { Quad, NamedNode } from "n3";

export class RdfJsMapper {
  /**
   * Map a Rdf.js quad to the internally used format
   * @param {Quad} quad
   * @returns {string[]}
   */
  static rdfJsToInternal(quad) {
    return [quad.subject.value, quad.predicate.value, quad.object.value];
  }

  /**
   * Map an array with Rdf.js quads to the internally used format
   * @param {Quad[]} quads
   * @return {string[][]}
   */
  static rdfJsToInternalList(quads) {
    let tripleList = [];
    quads.forEach((quad) => {
      tripleList.push(RdfJsMapper.rdfJsToInternal(quad));
    });
    return tripleList;
  }

  /**
   * Map a triple in the internal format to a Rdf.js quad
   * @param {string[]} triple
   * @returns {Quad}
   */
  static internalToRdfJs(triple) {
    return new Quad(new NamedNode(triple[0]), new NamedNode(triple[1]), new NamedNode(triple[2]));
  }

  /**
   * Map an array with triples in the internal format to Rdf.js quads
   * @param {string[][]} triples
   * @returns {Quad[]}
   */
  static internalToRdfJsList(triples) {
    let rdfJsQuads = [];
    triples.forEach((triple) => {
      rdfJsQuads.push(RdfJsMapper.internalToRdfJs(triple));
    });
    return rdfJsQuads;
  }
}
