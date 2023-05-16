import dynamic from "next/dynamic";

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
  return <NoSSRForceGraph graphData={data}></NoSSRForceGraph>;
}
