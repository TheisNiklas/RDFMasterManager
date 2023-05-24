import { QueryManager } from "@/rdf/query-manager";
import { Rdfcsa } from "@/rdf/rdfcsa";
import { QueryTriple } from "@/rdf/models/query-triple";
import { Triple } from "@/rdf/models/triple";

/**
 * Transform the RDF-Dictionary into an input format for the
 * 3D and 2D graph visualization (react-force-graph)
 * @returns input for the force-graph in JSON syntax
 */
export default function load_data(database: Rdfcsa, data: Triple[]) {
  if (data === undefined) {
    return { nodes: [], links: [] };
  }

  const nodes: any = [];
  const links: any = [];
  const arrayNodes: any = [];

  data.forEach((triple) => {
    var subject = triple.subject;
    var predicate = triple.predicate;
    var object = triple.object;

    if (database.dictionary.isSubjectObjectByObjectId(object)) {
      object = object - database.gaps![2];
    }

    //collect all nodes
    arrayNodes.push({id: subject, origId: triple.subject});
    arrayNodes.push({id: object, origId: triple.object});

    //generate links array
    links.push({
      source: subject,
      target: object,
      id: predicate
    });
  });

  //make a set out of all collected nodes
  const resultNodes = [...new Map(arrayNodes.map((item: { id: string, origId: string }) => [item.id, item])).values()]

  resultNodes.forEach((node, index) => {
    const content = database.dictionary.getElementById((node as any).origId);
    nodes.push({
      id: (node as any).id,
      originalId: (node as any).origId,
      group: index,
      content: content,
    });
  })

  //concatenate nodes and links array
  const result = { nodes: nodes, links: links };

  return result;
}
