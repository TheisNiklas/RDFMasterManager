/**
 * Contributions made by:
 * Niklas Theis
 * Kai Joshua Martin
 * Karl Neitmann
 */

import * as React from "react";
import { ChangeEvent, SyntheticEvent } from "react";
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
  SelectChangeEvent,
  MenuItem,
  InputLabel,
  Select,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { QueryCall } from "../interface/query-call";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useSelector, useDispatch } from "react-redux";
import {
  updateObject,
  updatePredicate,
  updateSubject,
  addQueryTriple,
  removeQueryTriple,
  setCurrentData,
  setLoading,
} from "./../actions";

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

//Backend call for the redux state objects for the querys
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

  const [visualLimit, setVisualLimit] = React.useState(0);
  const [sortElement, setSortElement] = React.useState("subject");
  const [sortOrder, setSortOrder] = React.useState("ascending");

  /**
   * Sort query result ascending
   * @param left Left triple
   * @param right Right triple
   * @returns Returns value < 0 if right is bigger, returns > 0 if left is bigger. Return 0 if they are equal
   */
  function sortAscending(left: any, right: any) {
    return left[sortElement] - right[sortElement];
  }

  /**
   * Sort query result descending
   * @param left Left triple
   * @param right Right triple
   * @returns Returns value > 0 if right is bigger, returns < 0 if left is bigger. Return 0 if they are equal
   */
  function sortDescending(left: any, right: any) {
    return right[sortElement] - left[sortElement];
  }
  //Data call of the interface for data adjustment of the triple in the backend
  //Sends the filter data
  //check if the query is correct
  const handleSubmit = () => {
    dispatch(setLoading(true));
    // Set timeout here to give components time to render backdrop
    setTimeout(executeQuery, 5);
  };

  /**
   * Execute the query. Sort and limit the result.
   */
  const executeQuery = () => {
    let queryResult = QueryCall.queryCallData(filterTriples, database);
    if (queryResult) {
      if (sortOrder === "descending") {
        queryResult.sort(sortDescending);
      } else {
        queryResult.sort(sortAscending);
      }
      if (visualLimit > 0) {
        queryResult = queryResult.slice(0, visualLimit);
      }
      dispatch(setCurrentData(queryResult));
      dispatch(setLoading(false));
    } else {
      //change popup
      setOpen(true);
    }
  };

  //Adaptation of the subject filter
  const handleFormChangeSubject = (event: SyntheticEvent<Element, Event>, index: number, newValue: string) => {
    dispatch(updateSubject(index, "" + newValue));
  };

  //Adaptation of the predicat filter
  const handleFormChangePredicate = (event: SyntheticEvent<Element, Event>, index: number, newValue: string) => {
    dispatch(updatePredicate(index, "" + newValue));
  };

  //Adaptation of the object filter
  const handleFormChangeObject = (event: SyntheticEvent<Element, Event>, index: number, newValue: string) => {
    dispatch(updateObject(index, "" + newValue));
  };

  //Adaptation of the selected sorting order (ascending, descending) the user picked
  const handleFormChangeSortOrderObject = (event: SelectChangeEvent<string>) => {
    setSortOrder(event.target.value);
  };

  //Adaptation of the selected element (Subject, Predicate, Object) the user picked by that the list shall get sorted
  const handleFormChangeSortElementObject = (event: SelectChangeEvent<string>) => {
    setSortElement(event.target.value);
  };

  const handleFormChangeLimit = (event: SelectChangeEvent<number>) => {
    setVisualLimit(Number(event.target.value));
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
                    <Grid item xs={12} sm={7} sx={{ marginTop: 2 }}></Grid>
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
                          filterOptions={createFilterOptions({ matchFrom: "any", limit: 500 })}
                          value={form.subject}
                          onInputChange={(event: SyntheticEvent<Element, Event>, newValue) =>
                            handleFormChangeSubject(event, index, newValue)
                          }
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
                          filterOptions={createFilterOptions({ matchFrom: "any", limit: 500 })}
                          value={form.predicate}
                          onInputChange={(event: SyntheticEvent<Element, Event>, newValue) =>
                            handleFormChangePredicate(event, index, newValue)
                          }
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
                          filterOptions={createFilterOptions({ matchFrom: "any", limit: 500 })}
                          value={form.object}
                          onInputChange={(event: SyntheticEvent<Element, Event>, newValue) =>
                            handleFormChangeObject(event, index, newValue)
                          }
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
              {/* Sort and Limit options*/}
              <Accordion sx={{ marginTop: 2 }} defaultExpanded={false}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
                  <Header variant="h6" sx={{ marginBottom: -1 }}>
                    Sorting
                  </Header>
                </AccordionSummary>
                <AccordionDetails>
                  <Container maxWidth="md" sx={{ marginBottom: 3 }}>
                    <div>
                      <Grid container spacing={2}>
                        <Grid container spacing={2} alignItems="center">
                          {/* Sort order*/}
                          <Grid item xs={12}>
                            <SortFormControl>
                              <InputLabel id="sort-label">Sort order</InputLabel>
                              <Select
                                labelId="sort-label"
                                defaultValue="ascending"
                                onChange={(event: SelectChangeEvent<string>) => handleFormChangeSortOrderObject(event)}
                              >
                                <MenuItem value="ascending">Ascending</MenuItem>
                                <MenuItem value="descending">Descending</MenuItem>
                              </Select>
                            </SortFormControl>
                          </Grid>
                          {/* Sort element*/}
                          <Grid item xs={12} sm={6}>
                            <Grid container spacing={2}>
                              <Grid item xs={12}>
                                <SortFormControl>
                                  <InputLabel id="sort-label">Sorting element</InputLabel>
                                  <Select
                                    labelId="sort-label"
                                    defaultValue="subject"
                                    onChange={(event: SelectChangeEvent<string>) =>
                                      handleFormChangeSortElementObject(event)
                                    }
                                  >
                                    <MenuItem value="subject">Subject</MenuItem>
                                    <MenuItem value="predicate">Predicate</MenuItem>
                                    <MenuItem value="object">Object</MenuItem>
                                  </Select>
                                </SortFormControl>
                              </Grid>
                            </Grid>
                          </Grid>
                          {/* Limit*/}
                          <Grid item xs={6}>
                            <Tooltip title="Maximum number of triple results of queries, > 0" placement="top">
                              <StyledTextField
                                name="visualLimit"
                                label="Limit"
                                type="number"
                                InputProps={{ inputProps: { min: 1 } }}
                                onChange={(event: ChangeEvent<HTMLInputElement>) => handleFormChangeLimit(event)}
                              />
                            </Tooltip>
                          </Grid>
                        </Grid>
                      </Grid>
                    </div>
                  </Container>
                </AccordionDetails>
              </Accordion>
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
