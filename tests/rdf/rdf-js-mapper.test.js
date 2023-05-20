import { RdfJsMapper } from "../../src/rdf/rdf-js-mapper";
import { quads, internalList } from "./.fixtures/rdf-js-mapper.test.json";

describe("RdfJsMapper", () => {
  test("rdfJsToInternal", () => {
    quads.forEach((quad, index) => {
      let result = RdfJsMapper.rdfJsToInternal(quad);
      expect(result).toEqual(internalList[index]);
    });
  });
  test("rdfJsToInternalList", () => {
    let result = RdfJsMapper.rdfJsToInternalList(quads);
    expect(result).toEqual(internalList);
  });
  test("internalToRdfJs", () => {
    internalList.forEach((internal, index) => {
      let result = RdfJsMapper.internalToRdfJs(internal);
      expect(JSON.parse(JSON.stringify(result))).toEqual(quads[index]);
    });
  });
  test("internalToRdfJsList", () => {
    let result = RdfJsMapper.internalToRdfJsList(internalList);
    expect(JSON.parse(JSON.stringify(result))).toEqual(quads);
  });
});
