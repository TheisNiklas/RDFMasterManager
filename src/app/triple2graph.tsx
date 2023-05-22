import { QueryManager } from "@/rdf/query-manager";
import { Rdfcsa } from "@/rdf/rdfcsa";
import { QueryTriple } from "@/rdf/models/query-triple";

/**
 * Transform the RDF-Dictionary into an input format for the
 * 3D and 2D graph visualization (react-force-graph)
 * @returns input for the force-graph in JSON syntax
 */
export default function load_data(database, data) {
  if (data === undefined) {
    return { nodes: [], links: [] };
  }

  const nodes: any = [];
  const links: any = [];
  const arrayNodes = [];

  for (var i = 0; i < data.length; i = +i + 1) {
    var subject = data[i].subject;
    var object = data[i].object;
    var predicate = data[i].predicate;

    //collect all nodes
    arrayNodes.push(subject);
    arrayNodes.push(object);

    //generate links array
    links.push({
      source: subject,
      target: object,
      name: predicate,
    });
  }

  //make a set out of all collected nodes
  const uniqueArray = new Set(arrayNodes);
  const resultNodes = Array.from(uniqueArray);

  for (var i = 0; i < resultNodes.length; i = +i + 1) {
    //generate nodes array
    const content = database.current.dictionary.getElementById(resultNodes[i]);
    nodes.push({
      id: resultNodes[i],
      group: i,
      content: content,
    });
  }

  //concatenate nodes and links array
  const result = { nodes: nodes, links: links };

  console.log(result);
  return result;
}
