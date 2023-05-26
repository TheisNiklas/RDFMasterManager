import React, { ChangeEvent, useState } from "react";
import { styled } from "@mui/system";
import {
  Typography,
  TextField,
  Button,
  Grid,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip
} from "@mui/material";
import { RdfOperations } from "@/rdf/rdf-operations";
import { QueryManager } from "@/rdf/query-manager";
import { QueryTriple } from "@/rdf/models/query-triple";
import { Rdfcsa } from "@/rdf/rdfcsa";
import { Triple } from "@/rdf/models/triple";

const Header = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  marginBottom: theme.spacing(2),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  width: "100%",
}));

const AddButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  width: "100%",
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  width: "100%",
}));

const AddTripleForm = ({ database, setDatabase, currentData, setCurrentData }: { database: Rdfcsa, setDatabase: React.Dispatch<React.SetStateAction<Rdfcsa>>, currentData: Triple[], setCurrentData: React.Dispatch<React.SetStateAction<Triple[]>> }) => {
  const [formFields, setFormFields] = useState({ subject: "", predicate: "", object: "" });

  const [subjectValid, setSubjectValid] = useState(false);
  const [predicateValid, setPredicateValid] = useState(false);
  const [objectValid, setObjectValid] = useState(false);


  const handleIRIValidation = (input: string, type: string) => {
    const iriRegex = /((([A-Za-z]{1,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
    switch (type) {
      case "s":
        // Code for the case "s"
        setSubjectValid(iriRegex.test(input));
        break;
      case "p":
        // Code for the case "p"
        setPredicateValid(iriRegex.test(input));
        break;
      case "o":
        // Code for the case "o"
        setObjectValid(iriRegex.test(input));
        break;
      default:
    }
  };
  //user input for the additional triple subject
  const handleFormChangeAddSubject = (event: ChangeEvent<HTMLInputElement>) => {
    let data = JSON.parse(JSON.stringify(formFields));
    data.subject = event.target.value;
    handleIRIValidation(data.subject, "s");
    setFormFields(data);
  };

  //user input for the additional triple predicat
  const handleFormChangeAddPredicat = (event: ChangeEvent<HTMLInputElement>) => {
    let data = JSON.parse(JSON.stringify(formFields));
    data.predicate = event.target.value;
    handleIRIValidation(data.predicate, "p");
    setFormFields(data);
  };

  //user input for the additional triple object
  const handleFormChangeAddObject = (event: ChangeEvent<HTMLInputElement>) => {
    let data = JSON.parse(JSON.stringify(formFields));
    data.object = event.target.value;
    handleIRIValidation(data.object, "o");
    setFormFields(data);
  };

  //call of the interface function for the additional triple
  const addTriple = () => {
    const rdfOperations = new RdfOperations(database);

    const newDatabase = rdfOperations.addTriple(formFields.subject, formFields.predicate, formFields.object);
    if (newDatabase !== undefined) {
      setDatabase(newDatabase);
      const queryManager = new QueryManager(newDatabase);
      setCurrentData(queryManager.getTriples([new QueryTriple(null, null, null)]));
      setFormFields({ subject: "", predicate: "", object: "" });
      setOpen(false);
    } else {
      setOpen(true);
    }
  };

  //State for the Dialog to open/close
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container maxWidth="md" sx={{ marginBottom: 3 }}>
      <div>
        <Header variant="h6">Add Triple</Header>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Tooltip title="S: beforce the subject" placement="top">
              <StyledTextField
                label="subject"
                value={formFields.subject}
                onChange={(event: ChangeEvent<HTMLInputElement>) => handleFormChangeAddSubject(event)}
                error={!subjectValid}
              />
            </Tooltip>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Tooltip title="P: before the predicate" placement="top">
              <StyledTextField
                label="predicate"
                value={formFields.predicate}
                onChange={(event: ChangeEvent<HTMLInputElement>) => handleFormChangeAddPredicat(event)}
                error={!predicateValid}
              />
            </Tooltip>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Tooltip title="SO: or O: before the object" placement="top">
              <StyledTextField
                label="object"
                value={formFields.object}
                onChange={(event: ChangeEvent<HTMLInputElement>) => handleFormChangeAddObject(event)}
                error={!objectValid}
              />
            </Tooltip>
          </Grid>
          <Grid item xs={12}>
            <SubmitButton variant="contained" color="primary" onClick={() => addTriple()} disabled={!subjectValid || !predicateValid || !objectValid}>
              Submit
            </SubmitButton>
          </Grid>
        </Grid>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Triple kann nicht hinzugefügt werden."}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Bitte ändern Sie ihre Eingaben, da das Triple so nicht hinzugefügt werden kann.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} autoFocus>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </Container>
  );
};

export default AddTripleForm;
