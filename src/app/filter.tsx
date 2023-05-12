import React, { ChangeEvent, useState } from "react";
import { styled } from "@mui/system";
import {
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Container,
  Box,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

const Header = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  marginBottom: theme.spacing(2),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  width: "100%",
}));

const DeleteButton = styled(DeleteForeverIcon)(({ theme }) => ({
  width: "100%",
}));

const AddButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  width: "100%",
}));

const SortFormControl = styled(FormControl)(({ theme }) => ({
  margin: theme.spacing(1),
  minWidth: 120,
  width: "100%",
  "& .MuiInputLabel-root": {
    minHeight: "1rem",
  },
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  width: "100%",
}));


const FilterForm = () => {

  //Adds a SPO triple to the previous formField of the filter triple
  const addFilterTriple = () => {
    let object = {
      subjekt: "",
      prädikat: "",
      objekt: "",
    };

    setFormFields([...formFields, object]);
  };

  //Data call of the interface for data adjustment of the triple in the backend
  //Sends the filter data
  const handleSubmit = () => {
    //TODO: handleSubmit
    console.log(formFields);
  };

  //Definition of the datastructure for the data tranfer to the interface of the filter elements
  const [formFields, setFormFields] = useState([
    { subjekt: "", prädikat: "", objekt: "" },
  ]);

  //Adaptation of the filter data set in case of user interaction
  const handleFormChange = (
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    let data = [...formFields];
    data[index][event.target.name] = event.target.value;
    setFormFields(data);

    console.log(formFields);
  };

  //Removes a triple pair of SPO filter elements
  const deleteFilterTriple = (index: number) => {
    let data = [...formFields];
    data.splice(index, 1);
    setFormFields(data);

    console.log(formFields);
  };

  return (
    <Container maxWidth="md" sx={{ marginBottom: 16 }}>
      <div>
        <Header variant="h6">Filter</Header>
        <Grid container spacing={2}>
          {formFields.map((form, index) => {
            return (
              <Grid container spacing={2} key={index}>
                <Grid item xs={12} sm={3}>
                  <StyledTextField
                    label="Subjekt"
                    name="subjekt"
                    onChange={(event) => handleFormChange(event, index)}
                    value={form.subjekt}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <StyledTextField
                    label="Prädikat"
                    name="prädikat"
                    onChange={(event) => handleFormChange(event, index)}
                    value={form.prädikat}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <StyledTextField
                    label="Objekt"
                    name="objekt"
                    onChange={(event) => handleFormChange(event, index)}
                    value={form.objekt}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <DeleteButton onClick={() => deleteFilterTriple(index)} />
                </Grid>
              </Grid>
            );
          })}
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12}>
              <AddButton
                variant="contained"
                color="primary"
                endIcon={<Add />}
                onClick={addFilterTriple}
              >
                Filter hinzufügen
              </AddButton>
            </Grid>
            <Grid item xs={12} sm={6}>
              <StyledTextField label="Limit" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <SortFormControl>
                    <InputLabel id="sort-label">Sortieren nach</InputLabel>
                    <Select labelId="sort-label">
                      <MenuItem value="name">Name</MenuItem>
                      <MenuItem value="date">Datum</MenuItem>
                      <MenuItem value="status">Status</MenuItem>
                    </Select>
                  </SortFormControl>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <SubmitButton
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Submit
              </SubmitButton>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </Container>
  );
};

export default FilterForm;
