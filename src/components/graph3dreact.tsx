import dynamic from "next/dynamic";
import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Rdfcsa } from "../rdf/rdfcsa";
import { Triple } from "../rdf/models/triple";
import { RdfOperations } from "../rdf/rdf-operations";
import { QueryManager } from "../rdf/query-manager";
import { QueryTriple } from "../rdf/models/query-triple";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Grid from "@mui/material/Grid";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentData, setDatabase, setGraphData } from "../actions";
import load_data from "./triple2graph";
import { Box, Hidden } from "@mui/material";

let widthValue = "30%";

//No-SSR import because react-force-graph does not support SSR
const NoSSRForceGraph = dynamic(() => import("../lib/NoSSRForceGraph"), {
  ssr: false,
});

/**
 * Visualization of the 3D graph and handling of all interaction with the 3D graph.
 * @returns React Component Graph3DReact
 */
export default function Graph3DReact() {
  //load data into the 3D Graph
  const database = useSelector((state: any) => state.database);
  const currentData = useSelector((state: any) => state.currentData);
  const graphData = useSelector((state: any) => state.graphData);

  const dispatch = useDispatch();
  //dispatch(graphData(database, currentData))
  const initial_data = load_data(database, currentData)
  const [data, setData] = React.useState(initial_data);

  const [openNodeLeft, setOpenNodeLeft] = React.useState(false);
  const [openLinkLeft, setOpenLinkLeft] = React.useState(false);
  const [nodeId, setNodeId] = React.useState("");
  const [nodeName, setNodeName] = React.useState("");
  const [linkSource, setLinkSource] = React.useState("");
  const [linkId, setLinkId] = React.useState("");
  const [linkTarget, setLinkTarget] = React.useState("");
  const [linkName, setLinkName] = React.useState("");
  const [linkSourceName, setLinkSourceName] = React.useState("");
  const [linkTargetName, setLinkTargetName] = React.useState("");
  const [formField, setFormField] = React.useState("");
  const [source, setSource] = React.useState("");
  const [target, setTarget] = React.useState("");
  const [pred, setPred] = React.useState("");
  const [toastOpen, setToastOpen] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState("");

  const handleNodeLeftClose = () => {
    setOpenNodeLeft(false);
  };

  const handleLinkLeftClose = () => {
    setOpenLinkLeft(false);
  };

  //display information about the node
  const handleNodeLeftClick = (node: any) => {
    setNodeId(node.id);
    setNodeName(node.content);
    setOpenNodeLeft(true);
  };

  //display information about the link
  const handleLinkLeftClick = (link: any) => {
    setLinkSourceName(database.dictionary.getElementById(link.source.id) as string);
    setLinkName(database.dictionary.getElementById(link.id) as string);
    setLinkTargetName(database.dictionary.getElementById(link.target.id) as string);
    setLinkSource(link.source.id);
    setLinkTarget(link.target.originalId);
    setLinkId(link.id);
    setOpenLinkLeft(true);
  };

  //handle Submit when Node Data is changed
  const handleSubmitNode = () => {
    const rdfOperations = new RdfOperations(database);
    const newDatabase = rdfOperations.changeInDictionary(nodeId, formField);
    dispatch(setDatabase(newDatabase as Rdfcsa));
    const queryManager = new QueryManager(newDatabase);
    dispatch(setCurrentData(queryManager.getTriples([new QueryTriple(null, null, null)])));
    dispatch(setGraphData(database, currentData));
    setToastMessage("Successfully renamed node");
    setToastOpen(true);
    setOpenNodeLeft(false);
  };

  //handle Submit when Triple Data is changed
  const handleSubmitLink = () => {
    setToastMessage("Successfully renamed triple");
    setToastOpen(true);
    setOpenLinkLeft(false);
  };

  //handle Delete of Triple
  const handleDeleteTriple = () => {
    const rdfOperations = new RdfOperations(database);
    const tripleToDelete = new Triple(linkSource, linkId, linkTarget);
    const newDatabase = rdfOperations.deleteTriple(tripleToDelete);
    dispatch(setDatabase(newDatabase as Rdfcsa));
    const queryManager = new QueryManager(newDatabase);
    dispatch(setCurrentData(queryManager.getTriples([new QueryTriple(null, null, null)])));
    dispatch(setGraphData(database, currentData));
    setToastMessage("Successfully deleted triple");
    setToastOpen(true);
    setOpenLinkLeft(false);
  };

  const handleResizeGraph3 = (userViewPerspectiv: string) => {
    console.log("handleResizeGraph3");

    if (userViewPerspectiv === "landscape-primary") {
      widthValue = "30%";
    }
    else {
      widthValue = "100%";
    }

    const rdfOperations = new RdfOperations(database);
    const tripleToDelete = new Triple(linkSource, linkId, linkTarget);
    const newDatabase = rdfOperations.deleteTriple(tripleToDelete);
    dispatch(setDatabase(newDatabase as Rdfcsa));
    const queryManager = new QueryManager(newDatabase);
    dispatch(setCurrentData(queryManager.getTriples([new QueryTriple(null, null, null)])));
    dispatch(setGraphData(database, currentData));
    setToastMessage("Successfully deleted triple");
    setToastOpen(true);
    setOpenLinkLeft(false);
  };

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }

    setToastOpen(false);
  };

  return (
    <Grid sx={{ marginTop: -5, marginLeft: -2, marginRight: -2 }}>
      <NoSSRForceGraph
        graphData={data}
        nodeAutoColorBy="group"
        linkDirectionalArrowLength={5}
        linkDirectionalArrowRelPos={1.05}
        linkWidth={1}
        linkOpacity={1}
        nodeOpacity={1}
        onNodeClick={(node: any) => handleNodeLeftClick(node)}
        onLinkClick={(link: any) => handleLinkLeftClick(link)}
      // width = {1150}
      // height = {450}
      ></NoSSRForceGraph>
      <Dialog open={openNodeLeft} onClose={handleNodeLeftClose}>
        <DialogTitle id="node-left-title">{"Node Informationen"}</DialogTitle>
        <DialogContent style={{ paddingTop: "10px" }}>
          <TextField
            label="Name"
            variant="outlined"
            defaultValue={nodeName}
            onChange={(event) => setFormField(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNodeLeftClose}>Cancel</Button>
          <Button onClick={handleSubmitNode}>Rename Triple</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openLinkLeft} onClose={handleLinkLeftClose}>
        <DialogTitle id="link-left-title">{"Triple Informationen"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="link-left-text">
            <Grid container spacing={2} style={{ paddingTop: "10px" }}>
              <Grid item xs={4}>
                <TextField
                  label="Subject"
                  variant="outlined"
                  defaultValue={linkSourceName}
                  onChange={(event) => setSource(event.target.value)}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Predicate"
                  variant="outlined"
                  defaultValue={linkName}
                  onChange={(event) => setPred(event.target.value)}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Object"
                  variant="outlined"
                  defaultValue={linkTargetName}
                  onChange={(event) => setTarget(event.target.value)}
                />
              </Grid>
            </Grid>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenLinkLeft(false);
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleDeleteTriple}>Delete Triple</Button>
          <Button onClick={handleSubmitLink}>Submit</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={toastOpen} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </Grid>
  );
}