/**
 * Contributions made by:
 * Bjarne Küper
 * Kai Joshua Martin
 * Niklas Theis
 */

import { Container, Grid, Typography, TextField, Button, Snackbar, Alert } from "@mui/material";
import React, { ChangeEvent, useState } from "react";
import { styled } from "@mui/system";
import { setCurrentData, setDatabase, setGraphData, setMetaData } from "../actions";
import { RdfOperations } from "../rdf/rdf-operations";
import { useDispatch, useSelector } from "react-redux";
import { Rdfcsa } from "../rdf/rdfcsa";
import { QueryManager } from "../rdf/query-manager";
import { QueryTriple } from "../rdf/models/query-triple";
import { QueryCall } from "../interface/query-call";

const Header = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  marginBottom: theme.spacing(2),
}));

const StyledTextField = styled(TextField)(() => ({
  width: "100%",
}));

const SubmitButton = styled(Button)(() => ({
  width: "100%",
}));

/**
 * Form to add and modify metadata
 * @returns React Component MetaDataForm
 */
const MetaDataForm = () => {
  const [nodeColorValue, setNodeColorValue] = useState("");
  const [nodeColorValid, setNodeColorValid] = useState(true);

  const [linkColorValue, setLinkColorValue] = useState("");
  const [linkColorValid, setLinkColorValid] = useState(true);
  const [toastOpen, setToastOpen] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState("");

  const database = useSelector((state: any) => state.database);
  const metaData = useSelector((state: any) => state.metaData);
  const currentData = useSelector((state: any) => state.currentData);
  const colorRegex = /^(#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}))?$/;

  const dispatch = useDispatch();

  /**
   * Update link color. Check if value is valid.
   * Only local var is updated. MetaData is not changed yet!
   * @param event Change event that has been triggered
   */
  const handleChangeLinkColor = (event: ChangeEvent<HTMLInputElement>) => {
    setLinkColorValue(event.target.value);
    setLinkColorValid(colorRegex.test(event.target.value));
  };

  /**
   * Update node color. Check if value is valid.
   * Only local var is updated. MetaData is not changed yet!
   * @param event Change event that has been triggered
   */
  const handleChangeNodeColor = (event: ChangeEvent<HTMLInputElement>) => {
    setNodeColorValue(event.target.value);
    setNodeColorValid(colorRegex.test(event.target.value));
  };

  /**
   * Show a toast msg.
   * @param msg Message that should be displayed
   */
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setToastOpen(true);
  };

  /**
   * Update database. Query all triples.
   * @param newDatabase Updated database
   */
  const updateCurrentData = (newDatabase) => {
    if (newDatabase.tripleCount < 10000) {
      // Query new data
      const queryManager = new QueryManager(newDatabase);
      dispatch(setCurrentData(queryManager.getTriples([new QueryTriple(null, null, null)])));
    } else {
      // Don't query automatically for better usability
      showToast("Dataset exceeds 10k triples - Data not queries - query manually");
    }
  };

  /**
   * Update the object of a a meta data triple.
   * @param element Meta data triple that should be updated
   * @param possibility Predicate of meta data triple
   * @param newValue New value that should be set as the triple object
   */
  const updateMetaTriple = (element: any, possibility: string, newValue: string) => {
    const rdfOperations = new RdfOperations(database);
    const newDatabase = rdfOperations.modifyTriple(element, "RDFCSA:METADATA", "METADATA:" + possibility, newValue);
    dispatch(setDatabase(newDatabase as Rdfcsa));

    updateCurrentData(newDatabase);
  };

  const insertMetaTriple = (possibility: string, value: string) => {
    const rdfOperations = new RdfOperations(database);
    const newDatabase = rdfOperations.addTriple(
      "RDFCSA:METADATA",
      "METADATA:" + possibility,
      JSON.parse(JSON.stringify(value))
    );
    dispatch(setDatabase(newDatabase));

    updateCurrentData(newDatabase);
  };

  /**
   * Update or insert a meta data Triple.
   * @param possibility Predicate of Meta Triple that should be updated or inserted.
   * @param metaTriple Meta Triple that will be updated. If null a new triple will be inserted.
   */
  const setMetaTriple = (possibility: string, metaTriple: any) => {
    let value = "";
    switch (possibility) {
      case "arrowColor": {
        if (linkColorValue !== "") {
          value = linkColorValue;
        }
        break;
      }
      case "nodeColor": {
        if (nodeColorValue !== "") {
          value = nodeColorValue;
        }
        break;
      }
      default: {
        break;
      }
    }
    // Early exit
    if (value === "") {
      return;
    }

    if (metaTriple !== null) {
      // Update
      updateMetaTriple(metaTriple, possibility, value);
    } else {
      // Insert
      insertMetaTriple(possibility, value);
    }
  };

  /**
   * Update current meta data. Query for meta data and set it into state.
   */
  const updateMetaData = () => {
    let metaDataQueried = QueryCall.queryCallData(
      [{ subject: "RDFCSA:METADATA", predicate: "", object: "" }],
      database
    );
    if (metaDataQueried) {
      dispatch(setMetaData(metaDataQueried));
    }
  };

  /**
   * Update metadata on submit. Update existing nodes or insert new node if meta data node doesnt exists yet.
   */
  const submitMetdata = () => {
    const metaDataPossibilities = ["arrowColor", "nodeColor"];
    // Loop over all meta data possibilities
    for (const possibility of metaDataPossibilities) {
      var triple_exists = false;
      // Loop over existing meta data triples and check if they match current possibility.
      for (const item of metaData) {
        const predicateValue = database.dictionary.getElementById(item.predicate).replace("METADATA:", "") as string;

        if (predicateValue === possibility) {
          triple_exists = true;
          setMetaTriple(possibility, item);
        }
      }

      //Triple doesn't exist in Database. We need to insert a new triple.
      if (!triple_exists) {
        setMetaTriple(possibility, null);
      }

      updateMetaData();
    }
  };

  // Close Popup
  const handleToastClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setToastOpen(false);
  };

  return (
    <Container maxWidth="md" sx={{ marginBottom: 3 }}>
      <Header variant="h6">Change Metadata</Header>
      <div>
        <Grid container spacing={0}>
          <Grid item xs={12} sm={12}>
            <StyledTextField
              label="Link Color"
              placeholder="Value in Hex e.g #FE1000"
              value={linkColorValue}
              onChange={(event: ChangeEvent<HTMLInputElement>) => handleChangeLinkColor(event)}
              error={!linkColorValid}
              sx={{ mb: 2 }}
            />
            <StyledTextField
              label="Node Color"
              placeholder="Value in Hex e.g #FE1000"
              value={nodeColorValue}
              onChange={(event: ChangeEvent<HTMLInputElement>) => handleChangeNodeColor(event)}
              error={!nodeColorValid}
              sx={{ mb: 2 }}
            />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <SubmitButton
            variant="contained"
            color="primary"
            onClick={() => submitMetdata()}
            disabled={!linkColorValid || !nodeColorValid}
          >
            Submit
          </SubmitButton>
        </Grid>
      </div>
      <Snackbar
        open={toastOpen}
        autoHideDuration={6000}
        onClose={handleToastClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleToastClose} severity="warning" sx={{ width: "100%" }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};
export default MetaDataForm;
