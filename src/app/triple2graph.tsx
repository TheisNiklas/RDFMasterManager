/**
 * Transform the RDF-Dictionary into an input format for the
 * 3D and 2D graph visualization (react-force-graph)
 * @returns input for the force-graph in JSON syntax
 */
export default function load_data() {
  var data = [
    {
      subject: "Tom",
      predicate: "wohnt",
      object: "Berlin",
    },
    {
      subject: "Jessica",
      predicate: "geboren",
      object: "Berlin",
    },
    {
      subject: "Tom",
      predicate: "arbeitet",
      object: "Stuttgart",
    },
    {
      subject: "Jessica",
      predicate: "arbeitet",
      object: "Stuttgart",
    },
    {
      subject: "Gustav",
      predicate: "fährt",
      object: "Stuttgart",
    },
  ];

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
    nodes.push({
      id: resultNodes[i],
      group: i,
    });
  }

  //concatenate nodes and links array
  const result = { nodes: nodes, links: links };

  console.log(result);
  return result;
}
