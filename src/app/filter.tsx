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
import Checkbox from '@mui/material/Checkbox';
import FormGroup from '@mui/material/FormGroup';
import RadioGroup from '@mui/material/RadioGroup';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';

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
      subject: "",
      predicat: "",
      object: "",
      subjectJoin: "",
      predicatJoin: "",
      objectJoin: "",
      subjectBound: "",
      predicatBound: "",
      objectBound: ""
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
    { subject: "", predicat: "", object: "", subjectJoin: "", predicatJoin: "", objectJoin: "", subjectBound: "", predicatBound: "", objectBound: "" },
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
                <Grid item xs={12} sm={12}>
                  <FormControl>
                    <FormLabel>Tripeleingabe mit Bound Option</FormLabel>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={1}>
                  <FormGroup>
                    <Checkbox
                      name="subjectBound"
                      onChange={(event) => handleFormChange(event, index)}
                      value={form.subjectBound}
                      defaultChecked size="small"
                    />
                  </FormGroup>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <StyledTextField
                    label="Subjekt"
                    name="subject"
                    onChange={(event) => handleFormChange(event, index)}
                    value={form.subject}
                  />
                </Grid>
                <Grid item xs={12} sm={1}>
                  <FormGroup>
                    <Checkbox
                      name="predicatBound"
                      onChange={(event) => handleFormChange(event, index)}
                      value={form.predicatBound}
                      defaultChecked size="small"
                    />
                  </FormGroup>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <StyledTextField
                    label="Prädikat"
                    name="predicat"
                    onChange={(event) => handleFormChange(event, index)}
                    value={form.predicat}
                  />
                </Grid>
                <Grid item xs={12} sm={1}>
                  <FormGroup>
                    <Checkbox
                      name="objectBound"
                      onChange={(event) => handleFormChange(event, index)}
                      value={form.objectBound}
                      defaultChecked size="small"
                    />
                  </FormGroup>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <StyledTextField
                    label="Objekt"
                    name="object"
                    onChange={(event) => handleFormChange(event, index)}
                    value={form.object}
                  />
                </Grid>
                <Grid item xs={12} sm={1}>
                  <DeleteButton onClick={() => deleteFilterTriple(index)} />
                </Grid>
                <Grid item xs={12} sm={11}>
                  <FormControl>
                    <FormLabel>Join Variablename für nächstes Filtertripel</FormLabel>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <StyledTextField
                    label="S-Join"
                    name="subjectJoin"
                    onChange={(event) => handleFormChange(event, index)}
                    value={form.subjectJoin}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <StyledTextField
                    label="P-Join"
                    name="predicatJoin"
                    onChange={(event) => handleFormChange(event, index)}
                    value={form.predicatJoin}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <StyledTextField
                    label="O-Join"
                    name="objectJoin"
                    onChange={(event) => handleFormChange(event, index)}
                    value={form.objectJoin}
                  />
                </Grid>
                <Grid item xs={12} sm={12}>
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
                      <MenuItem value="sortSubject">Subjekt</MenuItem>
                      <MenuItem value="sortPredicat">Prädikat</MenuItem>
                      <MenuItem value="sortObject">Objekt</MenuItem>
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
