import React, { ChangeEvent, useState } from "react";
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
  Tooltip,
  Typography,
  SelectChangeEvent
} from "@mui/material";
import { Triple } from "@/rdf/models/triple";

const Header = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  marginBottom: theme.spacing(2),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
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

const SortFormData = ({ sortData, setSortData }: { sortData: any, setSortData: any }) => {

    let sortElement = 'sortSubject';
    let sortOrder = 'ascending';
    let visualLimit = 0;

  //Data call of the interface for data adjustment of the triple in the backend
  //Sends the filter data
  const handleSubmit = () => {

    let data = JSON.parse(JSON.stringify(sortData));
    data.sortOrder = sortOrder;
    data.sortElement = sortElement;
    data.visualLimit = visualLimit;
    setSortData(data);
    console.log("submit");
    console.log(sortData);
  };

  //Adaptation of the selected sorting order (ascending, descending) the user picked
  const handleFormChangeSortOrderObject = (event: SelectChangeEvent<string>) => {
    sortOrder = event.target.value;
  };

  //Adaptation of the selected element (Subject, Predicate, Object) the user picked by that the list shall get sorted
  const handleFormChangeSortElementObject = (event: SelectChangeEvent<string>) => {
    sortElement = event.target.value;
  };

  //Adaptation of the selected element (Subject, Predicate, Object) the user picked by that the list shall get sorted
  const handleFormChangeLimit = (event: SelectChangeEvent<number>) => {
    visualLimit = Number(event.target.value);
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
            <Grid item xs={12} sm={12}>
              <Grid container spacing={2}>
                <Header variant="h6" sx={{ marginTop: 5, marginLeft: 3, marginBottom: -2 }}>
                  Sortierung
                </Header>
                <Grid item xs={12}>
                </Grid>
                <Grid item xs={12}>
                  <SortFormControl>
                    <InputLabel id="sort-label">Sortierreihenfolge</InputLabel>
                    <Select
                      labelId="sort-label"
                      defaultValue=""
                      onChange={(event: SelectChangeEvent<string>) => handleFormChangeSortOrderObject(event)}
                    >
                      <MenuItem value="">-----</MenuItem>
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
                      defaultValue=""
                      onChange={(event: SelectChangeEvent<string>) => handleFormChangeSortElementObject(event)}
                    >
                      <MenuItem value="">-----</MenuItem>
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
export default SortFormData;
