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
import { setCurrentData, setDatabase, setGraphData, setMainFrame, setMetaData } from "../actions";
import load_data from "./triple2graph";
import { QueryCall } from "../interface/query-call";
import { useEffect } from "react";

let widthValue = "30%";

//No-SSR import because react-force-graph does not support SSR
const NoSSRForceGraph2D = dynamic(() => import("../lib/NoSSRForceGraph2D"), {
  ssr: false,
});

/**
 * Visualization of the 2D graph and handling of all interaction with the 3D graph.
 * @returns React Component Graph3DReact
 */
export default function Graph2DReact() {
  //load data into the 2D Graph
  const database = useSelector((state: any) => state.database);
  const currentData = useSelector((state: any) => state.currentData);
  const graphData = useSelector((state: any) => state.graphData);
  const metaData = useSelector((state: any) => state.metaData);

  const dispatch = useDispatch();
  //dispatch(graphData(database, currentData))
  const initial_data = load_data(database, currentData);
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
  const [successToastOpen, setSuccessToastOpen] = React.useState(false);
  const [errorToastOpen, setErrorToastOpen] = React.useState(false);
  const [arrowColor, setArrowColor] = React.useState("FFFFFF");
  const [nodeColor, setNodeColor] = React.useState("e69138");
  const [toastMessage, setToastMessage] = React.useState("");

  useEffect(() => {
    const initial_data = load_data(database, currentData);
    setData(initial_data);
  }, [currentData]);

  useEffect(() => {
    validateMetaData();
  }, [metaData]);

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
    setFormField(node.content);
    setOpenNodeLeft(true);
  };

  function validateMetaData() {
    for (const item of metaData) {
      const predicateValue = database.dictionary.getElementById(item.predicate).replace("METADATA:", "") as string;
      const objectValue = database.dictionary.getElementById(item.object).replace("METADATA:", "") as string;
      switch (predicateValue) {
        case "arrowColor": {
          setArrowColor(objectValue);
          break;
        }
        case "nodeColor": {
          setNodeColor(objectValue);
          break;
        }
        default: {
          // Code for other cases (if needed)
          break;
        }
      }
    }
    return false;
  }

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
    if (formField != "") {
      const rdfOperations = new RdfOperations(database);
      const newDatabase = rdfOperations.changeInDictionary(nodeId, formField);
      dispatch(setDatabase(newDatabase as Rdfcsa));
      const queryManager = new QueryManager(newDatabase);
      dispatch(setCurrentData(queryManager.getTriples([new QueryTriple(null, null, null)])));
      dispatch(setGraphData(newDatabase, currentData));
      setToastMessage("Successfully renamed node");
      setSuccessToastOpen(true);
      setOpenNodeLeft(false);
    } else {
      setToastMessage("Can not rename Node with empty String");
      setErrorToastOpen(true);
      setOpenNodeLeft(false);
    }
  };

  //handle Submit when Triple Data is changed
  const handleSubmitLink = () => {
    if (linkSourceName != "" && linkName != "" && linkTargetName != "") {
      const rdfOperations = new RdfOperations(database);
      const tripleToModify = new Triple(+linkSource, +linkId, +linkTarget);
      const newDatabase = rdfOperations.modifyTriple(tripleToModify, linkSourceName, linkName, linkTargetName);
      dispatch(setDatabase(newDatabase));
      // TODO: Query with the currently set filter

      const queryManager = new QueryManager(newDatabase);
      dispatch(setCurrentData(queryManager.getTriples([new QueryTriple(null, null, null)])));
      dispatch(setGraphData(database, currentData));
      setToastMessage("Successfully renamed triple");
      setSuccessToastOpen(true);
      setOpenLinkLeft(false);

      if (linkSourceName === "RDFCSA:METADATA") {
        let metaData = QueryCall.queryCallData(
          [{ subject: "RDFCSA:METADATA", predicate: "", object: "" }],
          newDatabase
        );
        if (metaData) {
          dispatch(setMetaData(metaData));
        }

        dispatch(setMainFrame("blank"));
        setTimeout(function () {
          dispatch(setMainFrame("3d"));
        }, 1);
      }
    } else {
      setToastMessage("Can't rename Elements with empty String");
      setErrorToastOpen(true);
      setOpenLinkLeft(false);
    }
  };

  //handle Delete of Triple
  const handleDeleteTriple = () => {
    const rdfOperations = new RdfOperations(database);
    const tripleToDelete = new Triple(+linkSource, +linkId, +linkTarget);
    const newDatabase = rdfOperations.deleteTriple(tripleToDelete);
    dispatch(setDatabase(newDatabase as Rdfcsa));
    const queryManager = new QueryManager(newDatabase);
    dispatch(setCurrentData(queryManager.getTriples([new QueryTriple(null, null, null)])));
    dispatch(setGraphData(database, currentData));
    setToastMessage("Successfully deleted triple");
    setSuccessToastOpen(true);
    setOpenLinkLeft(false);
  };

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccessToastOpen(false);
    setErrorToastOpen(false);
  };

  return (
    <div>
      <NoSSRForceGraph2D
        graphData={data}
        nodeColor={(node: any) => (node.color = nodeColor)}
        linkColor={(link: any) => (link.color = arrowColor)}
        linkDirectionalArrowLength={5}
        linkDirectionalArrowRelPos={1.05}
        linkWidth={1}
        onNodeClick={(node: any) => handleNodeLeftClick(node)}
        onLinkClick={(link: any) => handleLinkLeftClick(link)}
      ></NoSSRForceGraph2D>
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
          <Button onClick={handleSubmitNode}>Rename Node</Button>
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
                  onChange={(event) => setLinkSourceName(event.target.value)}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Predicate"
                  variant="outlined"
                  defaultValue={linkName}
                  onChange={(event) => setLinkName(event.target.value)}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Object"
                  variant="outlined"
                  defaultValue={linkTargetName}
                  onChange={(event) => setLinkTargetName(event.target.value)}
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
      <Snackbar open={successToastOpen} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          {toastMessage}
        </Alert>
      </Snackbar>
      <Snackbar open={errorToastOpen} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
