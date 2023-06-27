/**
 * Contributions made by:
 * Niklas Theis
 * Kai Joshua Martin
 */

import * as React from 'react';
import { ChangeEvent, useState } from "react";
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
import { useSelector, useDispatch } from "react-redux";
import { setSortElement, setSortOrder, setVisualLimit } from "./../actions";

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

const SortFormData = () => {

  let sortElement = 'sortSubject';
  let sortOrder = 'ascending';
  let visualLimit = 0;

  //Data call of the interface for data adjustment of the triple in the backend
  //Sends the filter data
  const handleSubmit = () => {
    dispatch(setSortOrder(sortOrder));
    dispatch(setSortElement(sortElement));
    dispatch(setVisualLimit(visualLimit));
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

  //Redux
  const sortOptions = useSelector((state: any) => state.sortOptions);
  const dispatch = useDispatch();
  return (
    <Container maxWidth="md" sx={{ marginBottom: 3 }}>
      <div>
        <Grid container spacing={2}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={12}>
              <Grid container spacing={2}>
                <Header variant="h6" sx={{ marginTop: 5, marginLeft: 3, marginBottom: -2 }}>
                  Sorting
                </Header>
                <Grid item xs={12}>
                </Grid>
                <Grid item xs={12}>
                  <SortFormControl>
                    <InputLabel id="sort-label">Sort order</InputLabel>
                    <Select
                      labelId="sort-label"
                      defaultValue=""
                      onChange={(event: SelectChangeEvent<string>) => handleFormChangeSortOrderObject(event)}
                    >
                      <MenuItem value="">-----</MenuItem>
                      <MenuItem value="ascending">Ascending</MenuItem>
                      <MenuItem value="descending">Descending</MenuItem>
                    </Select>
                  </SortFormControl>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <SortFormControl>
                    <InputLabel id="sort-label">Sorting element</InputLabel>
                    <Select
                      labelId="sort-label"
                      defaultValue=""
                      onChange={(event: SelectChangeEvent<string>) => handleFormChangeSortElementObject(event)}
                    >
                      <MenuItem value="">-----</MenuItem>
                      <MenuItem value="sortSubject">Subject</MenuItem>
                      <MenuItem value="sortPredicate">Predicate</MenuItem>
                      <MenuItem value="sortObject">Object</MenuItem>
                    </Select>
                  </SortFormControl>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Tooltip title="Maximum number of triple results of queries, > 0" placement="top">
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
