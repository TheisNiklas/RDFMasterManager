import React, { ChangeEvent, useState, SyntheticEvent } from "react";
import { styled } from "@mui/system";
import {
  Autocomplete,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  Container,
  FormLabel,
  Tooltip,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { QueryCall } from "@/interface/query-call";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Rdfcsa } from "@/rdf/rdfcsa";
import { Triple } from "@/rdf/models/triple";

const Header = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  marginBottom: theme.spacing(2),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  width: "100%",
}));

const DeleteIcon = styled(DeleteForeverIcon)(({ theme }) => ({}));

const AddButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  width: "100%",
}));

const SortFormControl = styled(FormControl)(({ theme }) => ({
  margin: theme.spacing(0),
  width: "100%",
  "& .MuiInputLabel-root": {
    minHeight: "1rem",
  },
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  width: "100%",
}));

const FilterForm = ({ database, currentData, setCurrentData }: { database: Rdfcsa, currentData: Triple[], setCurrentData: React.Dispatch<React.SetStateAction<Triple[]>> }) => {
  //Adds a SPO triple to the previous formField of the filter triple
  //true as default value for the checkboxes
  const addFilterTriple = () => {
    let object = {
      subject: "",
      predicate: "",
      object: "",
    };

    setFormFields([...formFields, object]);
  };

  //Data call of the interface for data adjustment of the triple in the backend
  //Sends the filter data
  const handleSubmit = () => {
    setOpen(!QueryCall.queryCallData(formFields, database, currentData, setCurrentData));
  };

  //Definition of the datastructure for the data tranfer to the interface of the filter elements
  //true as default value for the checkboxes
  const [formFields, setFormFields] = useState([{ subject: "", predicate: "", object: "" }]);

  //Adaptation of the subject filter
  const handleFormChangeSubject = (event: SyntheticEvent<Element, Event>, index: number, newValue: string) => {
    let data = [...formFields];
    data[index]["subject"] = ("" + newValue);
    setFormFields(data);
  };

  //Adaptation of the predicat filter
  const handleFormChangePredicate = (event: SyntheticEvent<Element, Event>, index: number, newValue: string) => {
    let data = [...formFields];
    data[index]["predicate"] = ("" + newValue);
    setFormFields(data);
  };

  //Adaptation of the object filter
  const handleFormChangeObject = (event: SyntheticEvent<Element, Event>, index: number, newValue: string) => {
    let data = [...formFields];
    data[index]["object"] = ("" + newValue);
    setFormFields(data);
  };

  //Removes a triple pair of SPO filter elements with the corresponding join variables
  const deleteFilterTriple = (index: number) => {
    if (index === 0) {
        return;
    }
    let data = [...formFields];
    data.splice(index, 1);
    setFormFields(data);
  };

  //State for the Dialog to open
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Accordion defaultExpanded={true}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
        <Header variant="h6" sx={{ marginBottom: -1 }}>
          Filter
        </Header>
      </AccordionSummary>
      <AccordionDetails>
        <Container maxWidth="md" sx={{ marginBottom: 3 }}>
          <div>
            <Grid container spacing={0}>
              <FormControl sx={{ marginBottom: -3 }}>
                <FormLabel>Join Variablen Namen</FormLabel>
              </FormControl>
              {formFields.map((form, index) => {
                return (
                  <Grid container spacing={2} key={index} columns={13}>
                    <Grid item xs={12} sm={7} sx={{ marginTop: 2 }}>

                    </Grid>
                    <Grid item xs={12} sm={6}></Grid>
                    <Grid item xs={13} sm={4}>
                      <Tooltip title="? bedeutet Join Variable, ?? für ? als String" placement="top">
                        <Autocomplete
                          freeSolo
                          //load all subject strings
                          options={database.dictionary.SO.concat(database.dictionary.S)}
                          renderInput={(params) => (
                            <StyledTextField
                              {...params}
                              label="Subjekt"
                              InputProps={{
                                ...params.InputProps,
                              }}
                            />
                          )}
                          value={form.subject}
                          onInputChange={(event: SyntheticEvent<Element, Event>, newValue) => handleFormChangeSubject(event, index, newValue)}
                        />
                      </Tooltip>
                    </Grid>
                    <Grid item xs={13} sm={4}>
                      <Tooltip title="nur Suchwert, keine Join Variable möglich" placement="top">
                        <Autocomplete
                          freeSolo
                          //load all predicate strings
                          options={database.dictionary.P}
                          renderInput={(params) => (
                            <StyledTextField
                              {...params}
                              label="Prädikat"
                              InputProps={{
                                ...params.InputProps,
                              }}
                            />
                          )}
                          value={form.predicate}
                          onInputChange={(event: SyntheticEvent<Element, Event>, newValue) => handleFormChangePredicate(event, index, newValue)}
                        />
                      </Tooltip>
                    </Grid>
                    <Grid item xs={13} sm={4}>
                      <Tooltip title="? bedeutet Join Variable, ?? für ? als String" placement="top">
                        <Autocomplete
                          freeSolo
                          //load all object strings
                          options={database.dictionary.SO.concat(database.dictionary.O)}
                          renderInput={(params) => (
                            <StyledTextField
                              {...params}
                              label="Objekt"
                              InputProps={{
                                ...params.InputProps,
                              }}
                            />
                          )}
                          value={form.object}
                          onInputChange={(event: SyntheticEvent<Element, Event>, newValue) => handleFormChangeObject(event, index, newValue)}
                        />
                      </Tooltip>
                    </Grid>
                    <Grid item xs={13} sm={1} sx={{ display: "flex", justifyContent: "center" }}>
                      <Tooltip title="Löschen dieses Filter SPO-Triples" placement="top">
                        <IconButton aria-label="delete">
                          <DeleteIcon onClick={() => deleteFilterTriple(index)} />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                );
              })}
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12}>
                  <AddButton variant="contained" color="primary" endIcon={<Add />} onClick={addFilterTriple}>
                    Filter hinzufügen
                  </AddButton>
                </Grid>
                <Grid item xs={12}>
                  <SubmitButton variant="contained" color="primary" onClick={handleSubmit}>
                    Submit
                  </SubmitButton>
                  <Dialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                  >
                    <DialogTitle id="alert-dialog-title">{"Query kann nicht ausgeführt werden."}</DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                        Bitte ändern Sie ihre Eingaben, da die Query so nicht ausgeführt werden kann.
                      </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleClose} autoFocus>
                        OK
                      </Button>
                    </DialogActions>
                  </Dialog>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </Container>
      </AccordionDetails>
    </Accordion>
  );
};

export default FilterForm;
