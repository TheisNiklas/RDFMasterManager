import { Quad, NamedNode, Literal } from "n3";

/**
 * Class for mapping internat triple format to Rdf.js
 * Used in import and export.
 */
export class RdfJsMapper {
  static iriRegex =
    /((([A-Za-z]{1,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;

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
    let object = new NamedNode(triple[2]);
    if (!this.iriRegex.test(triple[2])) {
      object = new Literal("\"" + triple[2] + "\"");
    }
    return new Quad(new NamedNode(triple[0]), new NamedNode(triple[1]), object);
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
