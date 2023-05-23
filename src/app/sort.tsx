import React, { ChangeEvent, useState, SyntheticEvent } from "react";
import { styled } from "@mui/system";
import {
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Typography
} from "@mui/material";
import { Add } from "@mui/icons-material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { queryCallData } from "../interface/QueryCall";
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

const SortForm = ({ database, currentData, setCurrentData }: { database: Rdfcsa, currentData: Triple[], setCurrentData: React.Dispatch<React.SetStateAction<Triple[]>> }) => {
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
    setOpen(!queryCallData(formFields, sortFields, database, currentData, setCurrentData));
  };

  //Definition of the datastructure for the data tranfer to the interface of the filter elements
  //true as default value for the checkboxes
  const [formFields, setFormFields] = useState([{ subject: "", predicate: "", object: "" }]);

  const [sortFields, setSortFields] = useState({ sortElement: "sortSubject", sortOrder: "ascending", visualLimit: 0 });

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

  //State for the Dialog to open
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  return (
        <Container maxWidth="md" sx={{ marginBottom: 3 }}>
          <div>
            <Grid container spacing={2}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <Grid container spacing={2}>
                  <Grid item xs={12}>
                  <AddButton variant="contained" color="primary" endIcon={<Add />} onClick={addFilterTriple}>
                    Filter hinzufügen
                  </AddButton>
                </Grid>
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
                </Grid>
              </Grid>
            </Grid>
          </div>
        </Container>
  );
};
export default SortForm;
