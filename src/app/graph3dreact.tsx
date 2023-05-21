import dynamic from "next/dynamic";
import myData from "./testDataGraph3D";
import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Alert from "@mui/material/Alert";

const NoSSRForceGraph = dynamic(() => import("./lib/NoSSRForceGraph"), {
  ssr: false,
});

/**
 * TODO:
 * Warning hinzufügen, wenn Triple-Umbenennung leer ist
 * Delete Confirmation zu Triple-Delete hinzufügen
 */

export default function Graph3DReact() {
  const [openNodeLeft, setOpenNodeLeft] = React.useState(false);
  const [openLinkLeft, setOpenLinkLeft] = React.useState(false);
  const [openNodeRight, setOpenNodeRight] = React.useState(false);
  const [openLinkRight, setOpenLinkRight] = React.useState(false);

  const [nodeId, setNodeId] = React.useState("");
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

  const handleNodeLeftClick = (node: any) => {
    setNodeId(node.id);
    setOpenNodeLeft(true);
  };

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

  const handleSubmitNodeRight = () => {
    console.log(formField);
    setOpenNodeRight(false);
  };

  const handleSubmitLinkRight = () => {
    console.log(source);
    console.log(target);
    console.log(pred);
    setOpenLinkRight(false);
  };

  const handleDeleteTriple = () => {
    console.log("delete triple");
  };

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
      <Dialog open={openNodeRight} onClose={handleNodeRightClose}>
        <DialogTitle id="node-right-title">Änderungen: {nodeId}</DialogTitle>
        <DialogContent>
          <DialogContentText id="node-right-text">
            <TextField
              label="Name"
              variant="outlined"
              onChange={(event) => setFormField(event.target.value)}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNodeRightClose}>Cancel</Button>
          <Button onClick={handleSubmitNodeRight}>Submit</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openLinkRight} onClose={handleLinkRightClose}>
        <DialogTitle id="link-right-title">
          {" "}
          Triple Löschen oder umbenennen
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleDeleteTriple}>Delete Triple</Button>
        </DialogActions>
        <DialogContent>
          <DialogContentText id="link-right-text">
            <TextField
              label="source"
              variant="outlined"
              onChange={(event) => setSource(event.target.value)}
            />
            <TextField
              label="target"
              variant="outlined"
              onChange={(event) => setTarget(event.target.value)}
            />
            <TextField
              label="pred"
              variant="outlined"
              onChange={(event) => setPred(event.target.value)}
            />
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
