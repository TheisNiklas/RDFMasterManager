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
  ];

  const nodes: any = [];
  const links: any = [];

  const arrayNodes = [];

  for (var i = 0; i < data.length; i = +i + 1) {
    var subject = data[i].subject;
    var object = data[i].object;
    var predicate = data[i].predicate;

    arrayNodes.push(subject);
    arrayNodes.push(object);

    links.push({
      source: subject,
      target: object,
      name: predicate,
    });
  }

  const uniqueArray = new Set(arrayNodes);
  const resultNodes = Array.from(uniqueArray);

  for (var i = 0; i < resultNodes.length; i = +i + 1) {
    nodes.push({
      id: resultNodes[i],
      group: i,
    });
  }
  const result = { nodes: nodes, links: links };

  return result;
}
