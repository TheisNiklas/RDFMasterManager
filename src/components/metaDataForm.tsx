import { Accordion, AccordionDetails, AccordionSummary, Container, FormControl, FormLabel, Grid, Tooltip,Typography, TextField, Button } from "@mui/material";
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

const MetaDataForm = () => {
  const [nodeColorValue, setNodeColorValue] = useState("");
  const [nodeColorValid, setNodeColorValid] = useState(true);

  const [linkColorValue, setLinkColorValue] = useState("");
  const [linkColorValid, setLinkColorValid] = useState(true);
  const database = useSelector((state: any) => state.database);
  const metaData = useSelector((state: any) => state.metaData);
  const currentData = useSelector((state: any) => state.currentData);
  const colorRegex = /^(#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}))?$/;

  const dispatch = useDispatch();
  
  const handleChangeLinkColor = (event: ChangeEvent<HTMLInputElement>) => {
    setLinkColorValue(event.target.value);
    setLinkColorValid(colorRegex.test(event.target.value)); 
  };

  const handleChangeNodeColor = (event: ChangeEvent<HTMLInputElement>) => {
    setNodeColorValue(event.target.value);
    setNodeColorValid(colorRegex.test(event.target.value));  
  };

  const submitMetdata = () => {
    const metaDataPossibilities = ["arrowColor","nodeColor"];
    for (const possibility of metaDataPossibilities){
      var updated = false;
      for (const item of metaData) {
        const predicateValue = database.dictionary.getElementById(item.predicate).replace("METADATA:", "") as string;
        if(predicateValue == possibility){
          switch (predicateValue) {
            case "arrowColor": {
              if(linkColorValue != ""){
                setMetadataElement(item.object, linkColorValue)
              }
              updated = true;
              break;
            }
            case "nodeColor": {
              if(nodeColorValue != ""){
                setMetadataElement(item.object, nodeColorValue);
              }
              updated = true;
              break;
            }
            default: {
              // Code for other cases (if needed)
              break;
            }
          }
        }
      }
      //Triple doesnt exist in Database
      if(!updated){
        //ADD TRIPLE
        switch (possibility) {
          case "arrowColor": {
            if(linkColorValue != ""){
              addMetadataElement(possibility, linkColorValue)
            }
            break;
          }
          case "nodeColor": {
            if(nodeColorValue != ""){
              addMetadataElement(possibility, nodeColorValue);
            }
            break;
          }
          default: {
            // Code for other cases (if needed)
            break;
          }
        }
      }
    }
    let metaDataQueried = QueryCall.queryCallData([{ subject: "RDFCSA:METADATA", predicate: "", object: "" }], database);
    if (metaDataQueried) {
      dispatch(setMetaData(metaDataQueried));
    }
  }

  const setMetadataElement = (objectId:number, newValue: string) => {
    const rdfOperations = new RdfOperations(database);
    const newDatabase = rdfOperations.changeInDictionary(objectId, newValue);
    dispatch(setDatabase(newDatabase as Rdfcsa));
    const queryManager = new QueryManager(newDatabase);
    dispatch(setCurrentData(queryManager.getTriples([new QueryTriple(null, null, null)])));
    dispatch(setGraphData(newDatabase, currentData));
  }

  const addMetadataElement = (possibility: string, value: string) => {
    const rdfOperations = new RdfOperations(database);
    const newDatabase = rdfOperations.addTriple("RDFCSA:METADATA", "METADATA:" + possibility, value );
    dispatch(setDatabase(newDatabase));
    const queryManager = new QueryManager(newDatabase);
    dispatch(setCurrentData(queryManager.getTriples([new QueryTriple(null, null, null)])));
  }
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
              <SubmitButton variant="contained" color="primary" onClick={() => submitMetdata()} disabled={!linkColorValid || !nodeColorValid}>
                Submit
              </SubmitButton>
            </Grid>
          </div>
        </Container>
  );
};
export default MetaDataForm;
