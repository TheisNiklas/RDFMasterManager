/**
 * Contributions made by:
 * Niklas Theis
 * Tobias Kaps
 * Bjarne Küper
 * Sarah Flohr
 * Kai Joshua Martin
 */

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
  const [warningToastOpen, setWarningToastOpen] = React.useState(false);
  const [arrowColor, setArrowColor] = React.useState("FFFFFF");
  const [nodeColor, setNodeColor] = React.useState("e69138");
  const [errorToastMessage, setErrorToastMessage] = React.useState("");
  const [successToastMessage, setSuccessToastMessage] = React.useState("");
  const [warningToastMessage, setWarningToastMessage] = React.useState("");

  // Transform current data into data format for graph
  useEffect(() => {
    const initial_data = load_data(database, currentData);
    setData(initial_data);
  }, [currentData]);

  // Update graph depending on meta data
  useEffect(() => {
    validateMetaData();
  }, [metaData]);

  // Close popup
  const handleNodeLeftClose = () => {
    setOpenNodeLeft(false);
  };

  // Close popup
  const handleLinkLeftClose = () => {
    setOpenLinkLeft(false);
  };

  /**
   * Display information about a node
   * @param node Node that should be displayed
   */
  const handleNodeLeftClick = (node: any) => {
    setNodeId(node.id);
    setNodeName(node.content);
    setFormField(node.content);
    setOpenNodeLeft(true);
  };

  /**
   * Display information about a link
   * @param link Link that should be displayed
   */
  const handleLinkLeftClick = (link: any) => {
    setLinkSourceName(database.dictionary.getElementById(link.source.id) as string);
    setLinkName(database.dictionary.getElementById(link.id) as string);
    setLinkTargetName(database.dictionary.getElementById(link.target.id) as string);
    setLinkSource(link.source.id);
    setLinkTarget(link.target.originalId);
    setLinkId(link.id);
    setOpenLinkLeft(true);
  };

  /**
   * Update colors for arrows and nodes depending on metadata.
   */
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
          break;
        }
      }
    }
    return false;
  }

  /**
   * Show a toast msg.
   * @param msg Message that should be displayed
   * @param type Type of the toast. Valid types are: success, warning, error.
   */
  const showToast = (msg: string, type: string) => {
    switch (type) {
      case "success":
        setSuccessToastMessage(msg);
        setSuccessToastOpen(true);
        break;
      case "warning":
        setWarningToastMessage(msg);
        setWarningToastOpen(true);
        break;
      case "error":
        setErrorToastMessage(msg);
        setErrorToastOpen(true);
        break;
      default:
        break;
    }
  };

  /**
   * Update current data.
   * @param newDatabase Updated database
   */
  const updateCurrentData = (newDatabase) => {
    if (newDatabase.tripleCount < 10000) {
      // Query new data
      const queryManager = new QueryManager(newDatabase);
      dispatch(setCurrentData(queryManager.getTriples([new QueryTriple(null, null, null)])));
      dispatch(setGraphData(newDatabase, currentData));
    } else {
      // Don't query automatically for better usability
      showToast("Dataset exceeds 10k triples - Data not queries - query manually", "warning");

      dispatch(setCurrentData([]));
      dispatch(setGraphData(newDatabase, currentData));
    }
  };

  /**
   * Update metadata if meta data node has changed
   * @param newDatabase Updated database
   */
  const updateMetaData = (newDatabase) => {
    if (linkSourceName === "RDFCSA:METADATA") {
      let metaData = QueryCall.queryCallData([{ subject: "RDFCSA:METADATA", predicate: "", object: "" }], newDatabase);
      if (metaData) {
        dispatch(setMetaData(metaData));
      }

      dispatch(setMainFrame("blank"));
      setTimeout(function () {
        dispatch(setMainFrame("2d"));
      }, 1);
    }
  };

  /**
   * Change value of a node. Update database.
   */
  const handleSubmitNode = () => {
    // Early exit
    if (formField === "") {
      showToast("Can not rename Node with empty String", "error");
      setOpenNodeLeft(false);
      return;
    }

    const rdfOperations = new RdfOperations(database);
    const newDatabase = rdfOperations.changeInDictionary(nodeId, formField);
    dispatch(setDatabase(newDatabase as Rdfcsa));

    showToast("Successfully renamed node", "success");

    setOpenNodeLeft(false);

    updateCurrentData(newDatabase);
  };

  /**
   * Rename elements of triple. Update database and metadata.
   */
  const handleSubmitLink = () => {
    // Early exit
    if (linkSourceName === "" && linkName === "" && linkTargetName === "") {
      showToast("Can't rename Elements with empty String", "error");
      setOpenLinkLeft(false);
      return;
    }

    // Modify triple
    const rdfOperations = new RdfOperations(database);
    const tripleToModify = new Triple(+linkSource, +linkId, +linkTarget);
    const newDatabase = rdfOperations.modifyTriple(tripleToModify, linkSourceName, linkName, linkTargetName);
    dispatch(setDatabase(newDatabase));

    showToast("Successfully renamed triple", "success");

    setOpenLinkLeft(false);

    updateCurrentData(newDatabase);

    updateMetaData(newDatabase);
  };

  /**
   * Delete a Triple. Update database and metadata.
   */
  const handleDeleteTriple = () => {
    // Delete triple
    const rdfOperations = new RdfOperations(database);
    const tripleToDelete = new Triple(+linkSource, +linkId, +linkTarget);
    const newDatabase = rdfOperations.deleteTriple(tripleToDelete);
    dispatch(setDatabase(newDatabase as Rdfcsa));

    showToast("Successfully deleted triple", "success");

    updateCurrentData(newDatabase);

    setOpenLinkLeft(false);

    updateMetaData(newDatabase);
  };

  /**
   * Delete a node. Update database and metadata.
   */
  const handleDeleteNode = () => {
    // Delete node
    const rdfOperations = new RdfOperations(database);
    const newDatabase = rdfOperations.deleteElementInDictionary(nodeId);
    dispatch(setDatabase(newDatabase as Rdfcsa));

    showToast("Successfully deleted node", "success");

    setOpenNodeLeft(false);

    updateCurrentData(newDatabase);

    updateMetaData(newDatabase);
  };

  // Close popup
  const handleErrorClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setErrorToastOpen(false);
  };

  // Close popup
  const handleSuccessClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccessToastOpen(false);
  };

  // Close popup
  const handleWarningClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setWarningToastOpen(false);
  };

  return (
    <div style={{ marginLeft: -16, marginTop: -16 }}>
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
          <Button onClick={handleDeleteNode}>Delete Node</Button>
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
      <Snackbar open={successToastOpen} autoHideDuration={6000} onClose={handleSuccessClose}>
        <Alert onClose={handleSuccessClose} severity="success" sx={{ width: "100%" }}>
          {successToastMessage}
        </Alert>
      </Snackbar>
      <Snackbar open={errorToastOpen} autoHideDuration={6000} onClose={handleErrorClose}>
        <Alert onClose={handleErrorClose} severity="error" sx={{ width: "100%" }}>
          {errorToastMessage}
        </Alert>
      </Snackbar>
      <Snackbar
        open={warningToastOpen}
        autoHideDuration={6000}
        onClose={handleWarningClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleWarningClose} severity="warning" sx={{ width: "100%" }}>
          {warningToastMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}
