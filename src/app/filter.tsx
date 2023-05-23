import React, { ChangeEvent, useState, SyntheticEvent } from "react";
import { styled } from "@mui/system";
import {
  Autocomplete,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Container,
  FormLabel,
  Tooltip,
  SelectChangeEvent,
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
import { queryCallData } from "../interface/QueryCall";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

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

const FilterForm = ({ queryManager, currentData, setCurrentData }) => {
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
    setOpen(!queryCallData(formFields, sortFields, queryManager, currentData, setCurrentData));
  };

  //Definition of the datastructure for the data tranfer to the interface of the filter elements
  //true as default value for the checkboxes
  const [formFields, setFormFields] = useState([{ subject: "", predicate: "", object: "" }]);

  const [sortFields, setSortFields] = useState({ sortElement: "sortSubject", sortOrder: "ascending", visualLimit: 0 });

  //Adaptation of the subject filter
  const handleFormChangeSubject = (event: SyntheticEvent<Element, Event>, index: number) => {
    let data = [...formFields];
    data[index]["subject"] = event.currentTarget.textContent + "";
    setFormFields(data);

    console.log(formFields);
  };

  //Adaptation of the predicat filter
  const handleFormChangePredicate = (event: SyntheticEvent<Element, Event>, index: number) => {
    let data = [...formFields];
    data[index]["predicate"] = event.currentTarget.textContent + "";
    setFormFields(data);

    console.log(formFields);
  };

  //Adaptation of the object filter
  const handleFormChangeObject = (event: SyntheticEvent<Element, Event>, index: number) => {
    let data = [...formFields];
    data[index]["object"] = event.currentTarget.textContent + "";
    setFormFields(data);

    console.log(formFields);
  };

  //Adaptation of the selected sorting order (ascending, descending) the user picked
  const handleFormChangeSortOrderObject = (event: SelectChangeEvent<string>) => {
    let data = sortFields;
    data.sortOrder = event.target.value;
    setSortFields(data);

    console.log(sortFields);
  };

  //Adaptation of the selected element (Subject, Predicate, Object) the user picked by that the list shall get sorted
  const handleFormChangeSortElementObject = (event: SelectChangeEvent<string>) => {
    let data = sortFields;
    data.sortElement = event.target.value;
    setSortFields(data);

    console.log(sortFields);
  };

  //Adaptation of the selected element (Subject, Predicate, Object) the user picked by that the list shall get sorted
  const handleFormChangeLimit = (event: SelectChangeEvent<number>) => {
    let data = sortFields;
    data.visualLimit = Number(event.target.value);
    setSortFields(data);

    console.log(sortFields);
  };

  //Removes a triple pair of SPO filter elements with the corresponding join variables
  const deleteFilterTriple = (index: number) => {
    let data = [...formFields];
    data.splice(index, 1);
    setFormFields(data);

    console.log(formFields);
  };

  //State for the Dialog to open
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Accordion defaultExpanded={true}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
        <Header variant="h6" sx={{ marginBottom: 2 }}>
          Filter
        </Header>
      </AccordionSummary>
      <AccordionDetails>
        <Container maxWidth="md" sx={{ marginBottom: 3 }}>
          <div>
            <Grid container spacing={2}>
              {formFields.map((form, index) => {
                return (
                  <Grid container spacing={2} key={index} columns={13}>
                    <Grid item xs={12} sm={7} sx={{ marginTop: 2 }}>
                      <FormControl>
                        <FormLabel>Join Variablen Namen</FormLabel>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}></Grid>
                    <Grid item xs={13} sm={4}>
                      <Tooltip title="? bedeutet Join Variable, ?? für ? als String" placement="top">
                        <Autocomplete
                          freeSolo
                          disableClearable
                          //load all subjects!!!!!!!
                          options={["ab", "ba", "c"]}
                          //
                          renderInput={(params) => (
                            <StyledTextField
                              {...params}
                              label="Subjekt"
                              InputProps={{
                                ...params.InputProps,
                                type: 'search',
                              }}
                            />
                          )}
                          value={form.subject}
                          onChange={(event: SyntheticEvent<Element, Event>) => handleFormChangeSubject(event, index)}
                        />
                      </Tooltip>
                    </Grid>
                    <Grid item xs={13} sm={4}>
                      <Tooltip title="nur Suchwert, keine Join Variable möglich" placement="top">
                        <Autocomplete
                          freeSolo
                          disableClearable
                          //load all subjects!!!!!!!
                          options={["ab", "ba", "c"]}
                          //
                          renderInput={(params) => (
                            <StyledTextField
                              {...params}
                              label="Prädikat"
                              InputProps={{
                                ...params.InputProps,
                                type: 'search',
                              }}
                            />
                          )}
                          value={form.predicate}
                          onChange={(event: SyntheticEvent<Element, Event>) => handleFormChangePredicate(event, index)}
                        />
                      </Tooltip>
                    </Grid>
                    <Grid item xs={13} sm={4}>
                      <Tooltip title="? bedeutet Join Variable, ?? für ? als String" placement="top">
                        <Autocomplete
                          freeSolo
                          disableClearable
                          //load all subjects!!!!!!!
                          options={["ab", "ba", "c"]}
                          //
                          renderInput={(params) => (
                            <StyledTextField
                              {...params}
                              label="Objekt"
                              InputProps={{
                                ...params.InputProps,
                                type: 'search',
                              }}
                            />
                          )}
                          value={form.object}
                          onChange={(event: SyntheticEvent<Element, Event>) => handleFormChangeObject(event, index)}
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
                <Grid item xs={12} sm={6}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <SortFormControl>
                        <InputLabel id="sort-label">Sortierreihenfolge</InputLabel>
                        <Select
                          labelId="sort-label"
                          onChange={(event: SelectChangeEvent<string>) => handleFormChangeSortOrderObject(event)}
                        >
                          <MenuItem value="ascending">Aufsteigend</MenuItem>
                          <MenuItem value="descending">Absteigend</MenuItem>
                        </Select>
                      </SortFormControl>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <SortFormControl>
                        <InputLabel id="sort-label">Sortierelement</InputLabel>
                        <Select
                          labelId="sort-label"
                          onChange={(event: SelectChangeEvent<string>) => handleFormChangeSortElementObject(event)}
                        >
                          <MenuItem value="sortSubject">Subjekt</MenuItem>
                          <MenuItem value="sortPredicate">Prädikat</MenuItem>
                          <MenuItem value="sortObject">Objekt</MenuItem>
                        </Select>
                      </SortFormControl>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={6}>
                  <Tooltip title="Maximale Anzahl der Triple-Ergebnisse der Querys, > 0" placement="top">
                    <StyledTextField
                      name="visualLimit"
                      label="Limit"
                      type="number"
                      onChange={(event: ChangeEvent<HTMLInputElement>) => handleFormChangeLimit(event)}
                    />
                  </Tooltip>
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
