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
  createFilterOptions,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { QueryCall } from "../../../interface/query-call";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Rdfcsa } from "../rdf/rdfcsa";
import { Triple } from "../rdf/models/triple";
import { useSelector, useDispatch } from "react-redux";
import { updateObject, updatePredicate, updateSubject, addQueryTriple, removeQueryTriple, setCurrentData } from "./../actions";
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

const FilterForm = () => {
  //Redux
  const filterTriples = useSelector((state: any) => state.filterTriples);
  const database = useSelector((state: any) => state.database);
  const currentData = useSelector((state: any) => state.currentData);
  const dispatch = useDispatch();
  //Adds a SPO triple to the previous formField of the filter triple
  //true as default value for the checkboxes
  const addFilterTriple = () => {
    let object = {
      subject: "",
      predicate: "",
      object: "",
    };

    dispatch(addQueryTriple(object));
  };

  //Data call of the interface for data adjustment of the triple in the backend
  //Sends the filter data
  //check if the query is correct
  const handleSubmit = () => {
    let queryResult = QueryCall.queryCallData(filterTriples, database)
    if (queryResult)
    {
      dispatch(setCurrentData(queryResult));
    }  
    else
    {
      //change popup
      setOpen(true);
    }
  };

  //Adaptation of the subject filter
  const handleFormChangeSubject = (event: SyntheticEvent<Element, Event>, index: number, newValue: string) => {
    dispatch(updateSubject(index, ("" + newValue)));
  };

  //Adaptation of the predicat filter
  const handleFormChangePredicate = (event: SyntheticEvent<Element, Event>, index: number, newValue: string) => {
    dispatch(updatePredicate(index, ("" + newValue)));
  };

  //Adaptation of the object filter
  const handleFormChangeObject = (event: SyntheticEvent<Element, Event>, index: number, newValue: string) => {
    dispatch(updateObject(index, ("" + newValue)));
  };

  //Removes a triple pair of SPO filter elements with the corresponding join variables
  const deleteFilterTriple = (index: number) => {
    if (index === 0) {
        return;
    }
    dispatch(removeQueryTriple(index));
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
                <FormLabel>Join variables names</FormLabel>
              </FormControl>
              {filterTriples.map((form: any, index: number) => {
                return (
                  <Grid container spacing={2} key={index} columns={13}>
                    <Grid item xs={12} sm={7} sx={{ marginTop: 2 }}>

                    </Grid>
                    <Grid item xs={12} sm={6}></Grid>
                    <Grid item xs={13} sm={4}>
                      <Tooltip title="? means join variable, ?? for ? as string" placement="top">
                        <Autocomplete
                          freeSolo
                          //load all subject strings
                          options={database.dictionary.SO.concat(database.dictionary.S)}
                          renderInput={(params) => (
                            <StyledTextField
                              {...params}
                              label="subject"
                              InputProps={{
                                ...params.InputProps,
                              }}
                            />
                          )}
                          filterOptions={createFilterOptions({ matchFrom: 'any', limit: 500})}
                          value={form.subject}
                          onInputChange={(event: SyntheticEvent<Element, Event>, newValue) => handleFormChangeSubject(event, index, newValue)}
                        />
                      </Tooltip>
                    </Grid>
                    <Grid item xs={13} sm={4}>
                      <Tooltip title="only search value, no join variable possible" placement="top">
                        <Autocomplete
                          freeSolo
                          //load all predicate strings
                          options={database.dictionary.P}
                          renderInput={(params) => (
                            <StyledTextField
                              {...params}
                              label="predicate"
                              InputProps={{
                                ...params.InputProps,
                              }}
                            />
                          )}
                          filterOptions={createFilterOptions({ matchFrom: 'any', limit: 500})}
                          value={form.predicate}
                          onInputChange={(event: SyntheticEvent<Element, Event>, newValue) => handleFormChangePredicate(event, index, newValue)}
                        />
                      </Tooltip>
                    </Grid>
                    <Grid item xs={13} sm={4}>
                      <Tooltip title="? means join variable, ?? for ? as string" placement="top">
                        <Autocomplete
                          freeSolo
                          //load all object strings
                          options={database.dictionary.SO.concat(database.dictionary.O)}
                          renderInput={(params) => (
                            <StyledTextField
                              {...params}
                              label="object"
                              InputProps={{
                                ...params.InputProps,
                              }}
                            />
                          )}
                          filterOptions={createFilterOptions({ matchFrom: 'any', limit: 500})}
                          value={form.object}
                          onInputChange={(event: SyntheticEvent<Element, Event>, newValue) => handleFormChangeObject(event, index, newValue)}
                        />
                      </Tooltip>
                    </Grid>
                    <Grid item xs={13} sm={1} sx={{ display: "flex", justifyContent: "center" }}>
                      <Tooltip title="Delete this filter SPO triples" placement="top">
                        <IconButton aria-label="delete" onClick={() => deleteFilterTriple(index)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </Grid>
                );
              })}
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12}>
                  <AddButton variant="contained" color="primary" endIcon={<Add />} onClick={addFilterTriple}>
                  Add filter
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
                    <DialogTitle id="alert-dialog-title">{"Query cannot be executed"}</DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                      Please change your entries, because the query cannot be executed like this.
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
