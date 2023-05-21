import dynamic from "next/dynamic";
import myData from "./testDataGraph3D";
import * as React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";

const NoSSRForceGraph = dynamic(() => import("./lib/NoSSRForceGraph"), {
  ssr: false,
});

/**
 * TODO:
 * leftClickNode: Info
 * leftClickRelation: Info
 * rightClickNode: alle umbenenne
 * rightClickRelation: individuell umbenenne, löschen
 */

export default function Graph3DReact() {
  const data = {
    nodes: [{ id: "1" }, { id: "2" }, { id: "3" }],
    links: [
      { source: "1", target: "2" },
      { source: "1", target: "3" },
    ],
  };

  const [openNodeLeft, setOpenNodeLeft] = React.useState(false);
  const [openLinkLeft, setOpenLinkLeft] = React.useState(false);

  const [nodeId, setNodeId] = React.useState("");
  const [linkSource, setLinkSource] = React.useState("");
  const [linkTarget, setLinkTarget] = React.useState("");

  const handleNodeLeftClose = () => {
    setOpenNodeLeft(false);
  };

  const handleLinkLeftClose = () => {
    setOpenLinkLeft(false);
  };

  const handleNodeLeftClick = (node: any) => {
    setNodeId(node.id);
    setOpenNodeLeft(true);
  };

  const handleLinkLeftClick = (link: any) => {
    setLinkSource(link.source.id);
    setLinkTarget(link.target.id);
    setOpenLinkLeft(true);
  };

  const handleNodeRightClick = (node: any) => {};

  const handleLinkRightClick = (link: any) => {};

  return (
    <div>
      <NoSSRForceGraph
        graphData={myData}
        nodeAutoColorBy="group"
        onNodeClick={(node) => handleNodeLeftClick(node)}
        onNodeRightClick={(node) => handleNodeRightClick(node)}
        onLinkClick={(link) => handleLinkLeftClick(link)}
        onLinkRightClick={(link) => handleLinkRightClick(link)}
      ></NoSSRForceGraph>
      <Dialog open={openNodeLeft} onClose={handleNodeLeftClose}>
        <DialogTitle id="node-left-title">{"Informationen"}</DialogTitle>
        <DialogContentText id="node-left-text">
          Die NodeId ist: {nodeId}
        </DialogContentText>
      </Dialog>
      <Dialog open={openLinkLeft} onClose={handleLinkLeftClose}>
        <DialogTitle id="link-left-title">{"Informationen"}</DialogTitle>
        <DialogContentText id="link-left-text">
          Source: {linkSource}
          Target: {linkTarget}
        </DialogContentText>
      </Dialog>
    </div>
  );
}
