import React, { ChangeEvent, useState } from "react";
import { styled } from '@mui/system';
import { Typography, TextField, Button, Grid, Container, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import { addTripleInterface } from '../interface/AddTriple';

const Header = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginBottom: theme.spacing(2),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  width: '100%',
}));

const AddButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  width: '100%',
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  width: '100%',
}));

const AddTripleForm = () => {

  const [formFields, setFormFields] = useState(
    { subject: "", predicat: "", object: "" });

  //user input for the additional triple subject
  const handleFormChangeAddSubject = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    let data = formFields;
    data.subject = event.target.value;
    setFormFields(data);

    console.log(formFields);
  };

  //user input for the additional triple predicat
  const handleFormChangeAddPredicat = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    let data = formFields;
    data.predicat = event.target.value;
    setFormFields(data);

    console.log(formFields);
  };

  //user input for the additional triple object
  const handleFormChangeAddObject = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    let data = formFields;
    data.object = event.target.value;
    setFormFields(data);

    console.log(formFields);
  };

  //call of the interface function for the additional triple
  const addTriple = (
  ) => {
    setOpen(!addTripleInterface(formFields));

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
            <StyledTextField label="Subjekt" onChange={(event: ChangeEvent<HTMLInputElement>) => handleFormChangeAddSubject(event)} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StyledTextField label="Prädikat" onChange={(event: ChangeEvent<HTMLInputElement>) => handleFormChangeAddPredicat(event)} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StyledTextField label="Objekt" onChange={(event: ChangeEvent<HTMLInputElement>) => handleFormChangeAddObject(event)} />
          </Grid>
          <Grid item xs={12}>
            <SubmitButton variant="contained" color="primary" onClick={() => addTriple()}>
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
          <DialogTitle id="alert-dialog-title">
            {"Triple kann nicht hinzugefügt werden."}
          </DialogTitle>
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