import { RdfJsMapper } from "../../src/rdf/rdf-js-mapper";
import { quads, internalList } from "./fixtures/rdf-js-mapper.test.json";

describe("RdfJsMapper", () => {
  test("rdfJsToInternal", () => {
    quads.forEach((quad, index) => {
      const result = RdfJsMapper.rdfJsToInternal(quad);
      expect(result).toEqual(internalList[index]);
    });
  });
  test("rdfJsToInternalList", () => {
    const result = RdfJsMapper.rdfJsToInternalList(quads);
    expect(result).toEqual(internalList);
  });
  test("internalToRdfJs", () => {
    internalList.forEach((internal, index) => {
      const result = RdfJsMapper.internalToRdfJs(internal);
      expect(JSON.parse(JSON.stringify(result))).toEqual(quads[index]);
    });
  });
  test("internalToRdfJsList", () => {
    const result = RdfJsMapper.internalToRdfJsList(internalList);
    expect(JSON.parse(JSON.stringify(result))).toEqual(quads);
  });
});
