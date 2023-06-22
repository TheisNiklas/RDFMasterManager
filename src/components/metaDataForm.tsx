import { Accordion, AccordionDetails, AccordionSummary, Container, FormControl, FormLabel, Grid, Tooltip,Typography, TextField, Button } from "@mui/material";
import React, { ChangeEvent, useState } from "react";
import { styled } from "@mui/system";
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
  const colorRegex = /^(#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}))?$/;

  const handleChangeLinkColor = (event: ChangeEvent<HTMLInputElement>) => {
    setLinkColorValue(event.target.value);
    setLinkColorValid(colorRegex.test(event.target.value)); 
  };

  const handleChangeNodeColor = (event: ChangeEvent<HTMLInputElement>) => {
    setNodeColorValue(event.target.value);
    setNodeColorValid(colorRegex.test(event.target.value));  
  };

  const addMetdata = () => {
    //TODO: METADATA aus Form hinzufügen
    // let metaData = QueryCall.queryCallData([{subject:"RDFCSA:METADATA", predicate:"", object: ""}], newDatabase);
      // if (metaData)
      // {
      //   dispatch(setMetaData(metaData));
      // }
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
              <SubmitButton variant="contained" color="primary" onClick={() => addMetdata()} disabled={!linkColorValid || !nodeColorValid}>
                Submit
              </SubmitButton>
            </Grid>
          </div>
        </Container>
  );
};
export default MetaDataForm;
