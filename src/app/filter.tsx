import React, { ChangeEvent, useState } from "react";
import { styled } from "@mui/system";
import {
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Container,
  Checkbox,
  FormGroup,
  FormLabel
} from "@mui/material";
import { Add } from "@mui/icons-material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { queryCallData } from '../interface/QueryCall';

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
  //true as default value for the checkboxes
  const addFilterTriple = () => {
    let object = {
      subject: "",
      predicat: "",
      object: "",
      subjectJoin: "",
      predicatJoin: "",
      objectJoin: "",
      subjectBound: true,
      predicatBound: true,
      objectBound: true
    };

    setFormFields([...formFields, object]);
  };

  //Data call of the interface for data adjustment of the triple in the backend
  //Sends the filter data
  const handleSubmit = () => {
    queryCallData(formFields)
  };

  //Definition of the datastructure for the data tranfer to the interface of the filter elements
  //true as default value for the checkboxes
  const [formFields, setFormFields] = useState([
    { subject: "", predicat: "", object: "", subjectJoin: "", predicatJoin: "", objectJoin: "", subjectBound: true, predicatBound: true, objectBound: true },
  ]);

  //Adaptation of the subject filter
  const handleFormChangeSubject = (
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    let data = [...formFields];
    data[index]['subject'] = event.target.value;
    setFormFields(data);

    console.log(formFields);
  };

  //Adaptation of the predicat filter
  const handleFormChangePredicat = (
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    let data = [...formFields];
    data[index]['predicat'] = event.target.value;
    setFormFields(data);

    console.log(formFields);
  };

  //Adaptation of the object filter
  const handleFormChangeObject = (
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    let data = [...formFields];
    data[index]['object'] = event.target.value;
    setFormFields(data);

    console.log(formFields);
  };

  //Adaptation of the subject join identifier
  const handleFormChangeSubjectJoin = (
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    let data = [...formFields];
    data[index]['subjectJoin'] = event.target.value;
    setFormFields(data);

    console.log(formFields);
  };

  //Adaptation of the predicat join identifier
  const handleFormChangePredicatJoin = (
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    let data = [...formFields];
    data[index]['predicatJoin'] = event.target.value;
    setFormFields(data);

    console.log(formFields);
  };

  //Adaptation of the object join identifier
  const handleFormChangeObjectJoin = (
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    let data = [...formFields];
    data[index]['objectJoin'] = event.target.value;
    setFormFields(data);

    console.log(formFields);
  };

  //Adaptation of the filter data set in case of user interaction with the checkboxes for the subject
  const handleFormChangeCheckBoxSubject = (
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    let data = [...formFields];
    data[index]['subjectBound'] = event.target.checked;
    setFormFields(data);

    console.log(formFields);
  };

  //Adaptation of the filter data set in case of user interaction with the checkboxes for the object
  const handleFormChangeCheckBoxPredicat = (
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    let data = [...formFields];
    data[index]['predicatBound'] = event.target.checked;
    setFormFields(data);

    console.log(formFields);
  };

  //Adaptation of the filter data set in case of user interaction with the checkboxes for the predicat
  const handleFormChangeCheckBoxObject = (
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    let data = [...formFields];
    data[index]['objectBound'] = event.target.checked;
    setFormFields(data);

    console.log(formFields);
  };

  //Removes a triple pair of SPO filter elements with the corresponding join variables
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
                      onChange={(event: ChangeEvent<HTMLInputElement>) => handleFormChangeCheckBoxSubject(event, index)}
                      value={form.subjectBound}
                      defaultChecked size="small"
                    />
                  </FormGroup>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <StyledTextField
                    label="Subjekt"
                    name="subject"
                    onChange={(event: ChangeEvent<HTMLInputElement>) => handleFormChangeSubject(event, index)}
                    value={form.subject}
                  />
                </Grid>
                <Grid item xs={12} sm={1}>
                  <FormGroup>
                    <Checkbox
                      name="predicatBound"
                      onChange={(event: ChangeEvent<HTMLInputElement>) => handleFormChangeCheckBoxPredicat(event, index)}
                      value={form.predicatBound}
                      defaultChecked size="small"
                    />
                  </FormGroup>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <StyledTextField
                    label="Prädikat"
                    name="predicat"
                    onChange={(event: ChangeEvent<HTMLInputElement>) => handleFormChangePredicat(event, index)}
                    value={form.predicat}
                  />
                </Grid>
                <Grid item xs={12} sm={1}>
                  <FormGroup>
                    <Checkbox
                      name="objectBound"
                      onChange={(event: ChangeEvent<HTMLInputElement>) => handleFormChangeCheckBoxObject(event, index)}
                      value={form.objectBound}
                      defaultChecked size="small"
                    />
                  </FormGroup>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <StyledTextField
                    label="Objekt"
                    name="object"
                    onChange={(event: ChangeEvent<HTMLInputElement>) => handleFormChangeObject(event, index)}
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
                    onChange={(event: ChangeEvent<HTMLInputElement>) => handleFormChangeSubjectJoin(event, index)}
                    value={form.subjectJoin}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <StyledTextField
                    label="P-Join"
                    name="predicatJoin"
                    onChange={(event: ChangeEvent<HTMLInputElement>) => handleFormChangePredicatJoin(event, index)}
                    value={form.predicatJoin}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <StyledTextField
                    label="O-Join"
                    name="objectJoin"
                    onChange={(event: ChangeEvent<HTMLInputElement>) => handleFormChangeObjectJoin(event, index)}
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