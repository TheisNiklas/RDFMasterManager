import dynamic from "next/dynamic";
import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import load_data from "./triple2graph";
import { Rdfcsa } from "@/rdf/rdfcsa";
import { QueryManager } from "@/rdf/query-manager";

//No-SSR import because react-force-graph does not support SSR
const NoSSRForceGraph = dynamic(() => import("./lib/NoSSRForceGraph"), {
  ssr: false,
});

/**
 * Visualization of the 3D graph and handling of all interaction with the 3D graph.
 * @returns React Component Graph3DReact
 */
export default function Graph3DReact({ database, queryManager, currentData, setCurrentData }) {
  //load data into the 3D Graph
  const [data, setData] = React.useState(load_data(database, currentData));

  const [openNodeLeft, setOpenNodeLeft] = React.useState(false);
  const [openNodeRight, setOpenNodeRight] = React.useState(false);
  const [openLinkLeft, setOpenLinkLeft] = React.useState(false);
  const [openLinkRight, setOpenLinkRight] = React.useState(false);
  const [nodeId, setNodeId] = React.useState("");
  const [nodeContent, setNodeContent] = React.useState("");
  const [linkSource, setLinkSource] = React.useState("");
  const [linkTarget, setLinkTarget] = React.useState("");
  const [formField, setFormField] = React.useState("");
  const [source, setSource] = React.useState("");
  const [target, setTarget] = React.useState("");
  const [pred, setPred] = React.useState("");

  const handleNodeLeftClose = () => {
    setOpenNodeLeft(false);
  };

  const handleLinkLeftClose = () => {
    setOpenLinkLeft(false);
  };

  const handleNodeRightClose = () => {
    setOpenNodeRight(false);
  };

  const handleLinkRightClose = () => {
    setOpenLinkRight(false);
  };

  //display information about the node
  const handleNodeLeftClick = (node: any) => {
    setNodeId(node.id);
    setNodeContent(node.content);
    setOpenNodeLeft(true);
  };

  //display information about the link
  const handleLinkLeftClick = (link: any) => {
    setLinkSource(link.source.id);
    setLinkTarget(link.target.id);
    setOpenLinkLeft(true);
  };

  const handleNodeRightClick = (node: any) => {
    setNodeId(node.id);
    setOpenNodeRight(true);
  };

  const handleLinkRightClick = (link: any) => {
    setOpenLinkRight(true);
  };

  //handle Submit when Node Data is changed
  const handleSubmitNodeRight = () => {
    console.log(formField);
    setOpenNodeRight(false);
  };

  //handle Submit when Triple Data is changed
  const handleSubmitLinkRight = () => {
    console.log(source);
    console.log(target);
    console.log(pred);
    setOpenLinkRight(false);
  };

  //handle Delete of Triple
  const handleDeleteTriple = () => {
    console.log("delete triple");
  };

  React.useEffect(() => {
    console.log("TODO: Refresh GUI");
    setData(load_data(database, currentData));
  }, [currentData])

  return (
    <div>
      <NoSSRForceGraph
        graphData={data}
        nodeAutoColorBy="group"
        onNodeClick={(node) => handleNodeLeftClick(node)}
        onNodeRightClick={(node) => handleNodeRightClick(node)}
        onLinkClick={(link) => handleLinkLeftClick(link)}
        onLinkRightClick={(link) => handleLinkRightClick(link)}
      ></NoSSRForceGraph>
      <Dialog open={openNodeLeft} onClose={handleNodeLeftClose}>
        <DialogTitle id="node-left-title">{"Informationen"}</DialogTitle>
        <DialogContentText id="node-left-text">Die NodeId ist: {nodeContent}</DialogContentText>
      </Dialog>
      <Dialog open={openLinkLeft} onClose={handleLinkLeftClose}>
        <DialogTitle id="link-left-title">{"Informationen"}</DialogTitle>
        <DialogContentText id="link-left-text">
          Source: {linkSource}
          Target: {linkTarget}
        </DialogContentText>
      </Dialog>
      <Dialog open={openNodeRight} onClose={handleNodeRightClose}>
        <DialogTitle id="node-right-title">Änderungen: {nodeId}</DialogTitle>
        <DialogContent>
          <DialogContentText id="node-right-text">
            <TextField label="Name" variant="outlined" onChange={(event) => setFormField(event.target.value)} />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNodeRightClose}>Cancel</Button>
          <Button onClick={handleSubmitNodeRight}>Submit</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openLinkRight} onClose={handleLinkRightClose}>
        <DialogTitle id="link-right-title"> Triple Löschen oder umbenennen</DialogTitle>
        <DialogActions>
          <Button onClick={handleDeleteTriple}>Delete Triple</Button>
        </DialogActions>
        <DialogContent>
          <DialogContentText id="link-right-text">
            <TextField label="source" variant="outlined" onChange={(event) => setSource(event.target.value)} />
            <TextField label="target" variant="outlined" onChange={(event) => setTarget(event.target.value)} />
            <TextField label="pred" variant="outlined" onChange={(event) => setPred(event.target.value)} />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLinkRightClose}>Cancel</Button>
          <Button onClick={handleSubmitLinkRight}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
