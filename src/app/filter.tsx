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
  FormLabel,
  Tooltip,
  SelectChangeEvent,
  IconButton
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

const DeleteIcon = styled(DeleteForeverIcon)(({ theme }) => ({

}));

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

  //Adds a SPO triple to the previous formField of the filter triple
  //true as default value for the checkboxes
  const addFilterTriple = () => {
    let object = {
      subject: "",
      predicat: "",
      object: ""
    };

    setFormFields([...formFields, object]);
  };

  //Data call of the interface for data adjustment of the triple in the backend
  //Sends the filter data
  const handleSubmit = () => {
    queryCallData(formFields, sortFields)
  };

  //Definition of the datastructure for the data tranfer to the interface of the filter elements
  //true as default value for the checkboxes
  const [formFields, setFormFields] = useState([
    { subject: "", predicat: "", object: "" }]);

  const [sortFields, setSortFields] = useState(
    { sortElement: "sortSubject", sortOrder: "ascending" }
  );
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

  //Adaptation of the selected sorting order (ascending, descending) the user picked 
  const handleFormChangeSortOrderObject = (
    event: SelectChangeEvent<string>
  ) => {
    let data = sortFields;
    data.sortOrder = event.target.value;
    setSortFields(data);

    console.log(sortFields);
  }

  //Adaptation of the selected element (Subject, Predicate, Object) the user picked by that the list shall get sorted
  const handleFormChangeSortElementObject = (
    event: SelectChangeEvent<string>
  ) => {
    let data = sortFields;
    data.sortElement = event.target.value;
    setSortFields(data);

    console.log(sortFields);
  }
  //Removes a triple pair of SPO filter elements with the corresponding join variables
  const deleteFilterTriple = (index: number) => {
    let data = [...formFields];
    data.splice(index, 1);
    setFormFields(data);

    console.log(formFields);
  };


  return (
    <Container maxWidth="md" sx={{ marginBottom: 3 }}>
      <div>
        <Header variant="h6" sx={{ marginBottom: 2 }}>Filter</Header>
        <Grid container spacing={2}>
          {formFields.map((form, index) => {
            return (
              <Grid container spacing={2} key={index} columns={13}>
                <Grid item xs={12} sm={5} sx={{ marginTop: 2 }}>
                  <FormControl>
                    <FormLabel>Join Variablen Namen</FormLabel>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                </Grid>
                <Grid item xs={13} sm={4}>
                  <Tooltip title="ein  Zeichen nach dem ? gilt als Joinvariable, der Rest bildet das Subjekt" placement="top">
                    <StyledTextField
                      label="Subjekt"
                      name="subject"
                      onChange={(event: ChangeEvent<HTMLInputElement>) => handleFormChangeSubject(event, index)}
                      value={form.subject}
                    />
                  </Tooltip>
                </Grid>
                <Grid item xs={13} sm={4}>
                  <Tooltip title="ein  Zeichen nach dem ? gilt als Joinvariable, der Rest bildet das Prädikat" placement="top">
                    <StyledTextField
                      label="Prädikat"
                      name="predicat"
                      onChange={(event: ChangeEvent<HTMLInputElement>) => handleFormChangePredicat(event, index)}
                      value={form.predicat}
                    />
                  </Tooltip>
                </Grid>
                <Grid item xs={13} sm={4}>
                  <Tooltip title="ein  Zeichen nach dem ? gilt als Joinvariable, der Rest bildet das Objekt" placement="top">
                    <StyledTextField
                      label="Objekt"
                      name="object"
                      onChange={(event: ChangeEvent<HTMLInputElement>) => handleFormChangeObject(event, index)}
                      value={form.object}
                    />
                  </Tooltip>
                </Grid>
                <Grid item xs={13} sm={1} sx={{display: 'flex', justifyContent: 'center',}}>
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
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <SortFormControl>
                    <InputLabel id="sort-label">Sortierreihenfolge</InputLabel>
                    <Select labelId="sort-label" onChange={(event: SelectChangeEvent<string>) => handleFormChangeSortOrderObject(event)}>
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
                    <Select labelId="sort-label" onChange={(event: SelectChangeEvent<string>) => handleFormChangeSortElementObject(event)}>
                      <MenuItem value="sortSubject">Subjekt</MenuItem>
                      <MenuItem value="sortPredicat">Prädikat</MenuItem>
                      <MenuItem value="sortObject">Objekt</MenuItem>
                    </Select>
                  </SortFormControl>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Tooltip title="Maximale Anzahl an Ergebnissen der Query" placement="top">
                <StyledTextField label="Limit" type="number" />
              </Tooltip>
            </Grid>
            <Grid item xs={12}>
              <SubmitButton
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Submit
              </SubmitButton>
            </Grid >

          </Grid>
        </Grid>
      </div>
    </Container>
  );
};

export default FilterForm;
