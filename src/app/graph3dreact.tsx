import dynamic from "next/dynamic";
import myData from "./testDataGraph3D";

const NoSSRForceGraph = dynamic(() => import("./lib/NoSSRForceGraph"), {
  ssr: false,
});

export default function Graph3DReact() {
  const data = {
    nodes: [{ id: "1" }, { id: "2" }, { id: "3" }],
    links: [
      { source: "1", target: "2" },
      { source: "1", target: "3" },
    ],
  };

  const handleNodeLeftClick = (node: any) => {
    console.log(node.id);
    console.log(node);
  };

  return (
    <NoSSRForceGraph
      graphData={myData}
      nodeAutoColorBy="group"
      onNodeClick={(node) => handleNodeLeftClick(node)}
    ></NoSSRForceGraph>
  );
}
