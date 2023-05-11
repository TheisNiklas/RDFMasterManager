import React from 'react';
import { styled } from '@mui/system';
import { Typography, TextField, Button, Grid, Container } from '@mui/material';
import { Add } from '@mui/icons-material';

const Header = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginBottom: theme.spacing(2),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  width: '100%',
}));

const AddButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  width: '100%',
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  width: '100%',
}));

const AddTripleForm = () => {
  return (
    <Container maxWidth="md">
      <div>
        <Header variant="h6">Add Triple</Header>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <StyledTextField label="Subjekt" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StyledTextField label="Prädikat" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <StyledTextField label="Objekt" />
          </Grid>
          <Grid item xs={12}>
            <SubmitButton variant="contained" color="primary">
              Submit
            </SubmitButton>
          </Grid>
        </Grid>
      </div>
    </Container>
  );
};

export default AddTripleForm;