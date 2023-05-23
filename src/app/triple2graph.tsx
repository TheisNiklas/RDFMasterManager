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
      object = object - database.gaps[2];
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
  const resultNodes = [...new Map(arrayNodes.map(item => [item["id"], item])).values()]
//   const uniqueArray = new Set(arrayNodes);
//   const resultNodes = Array.from(uniqueArray);

  resultNodes.forEach((node, index) => {
    const content = database.dictionary.getElementById(node.origId);
    nodes.push({
      id: node.id,
      originalId: node.origId,
      group: index,
      content: content,
    });
  })

//   for (var i = 0; i < resultNodes.length; i = +i + 1) {
//     //generate nodes array
//     const content = database.dictionary.getElementById(resultNodes[i][1]);
//     nodes.push({
//       id: resultNodes[i][0],
//       originalId: resultNodes[i][1],
//       group: i,
//       content: content,
//     });
//   }

  //concatenate nodes and links array
  const result = { nodes: nodes, links: links };

  console.log(result);
  return result;
}
