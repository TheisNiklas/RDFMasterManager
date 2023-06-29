/**
 * Contributions made by:
 * Sarah Flohr
 * Tobias Kaps
 * Karl Neitmann
 * Bjarne Küper
 * Niklas Theis
 */

import { Rdfcsa } from "../rdf/rdfcsa";
import { Triple } from "../rdf/models/triple";

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
    const subject = triple.subject;
    const predicate = triple.predicate;
    let object = triple.object;
    let objectOriginalId = -1;

    if (database.dictionary.isSubjectObjectById(object)) {
      objectOriginalId = object;
      object = object - database.gaps![2];
    }
    let subjectValue = database.dictionary.getElementById(subject) as string;

    //Collect all nodes
    if (objectOriginalId !== -1) {
      arrayNodes.push({ id: object, origId: objectOriginalId });
    } else {
      arrayNodes.push({ id: object, origId: triple.object });
    }
    arrayNodes.push({ id: subject, origId: triple.subject });

    //Generate links array
    links.push({
      source: subject,
      target: object,
      id: predicate,
    });
  });

  //Make a set out of all collected nodes
  const resultNodes = [...new Map(arrayNodes.map((item: { id: string; origId: string }) => [item.id, item])).values()];

  resultNodes.forEach((node, index) => {
    const content = database.dictionary.getElementById((node as any).origId);
    nodes.push({
      id: (node as any).id,
      originalId: (node as any).origId,
      group: index,
      content: content,
    });
  });

  //Concatenate nodes and links array
  const result = { nodes: nodes, links: links };

  return result;
}
