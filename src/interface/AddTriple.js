import { RdfOperations } from "@/rdf/rdf-operations";

//Formats the triple to be inserted into the overall data set. Returns false if the entered data is incorrect.
/**
 *
 * @param {*} tripleData
 * @param {React.MutableRefObject<QueryManager>} queryManager
 * @param {*} currentData
 * @param {*} setCurrentData
 * @returns
 */
function addTripleInterface(tripleData, queryManager, currentData, setCurrentData) {
  console.log("tripleData start: ");
  console.log(tripleData);
  console.log("tripleData end");
  // TODO: does not work!!!
  const rdfcsaOperations = new RdfOperations();
  rdfcsaOperations.rdfcsa = queryManager.rdfcsa;
  rdfcsaOperations.addTriple(tripleData.subject, tripleData.predicate, tripleData.object);
  queryManager.rdfcsa = rdfcsaOperations.rdfcsa;

  //call RDF mit tripleData
  return true;
}

export { addTripleInterface };
