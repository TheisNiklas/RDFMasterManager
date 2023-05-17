import React from 'react';
import { styled } from '@mui/system';
import { Typography, TextField, Button, Grid, Container, Checkbox, FormControl, FormControlLabel } from '@mui/material';
import { importBinaryTest } from '../rdf/import/ImportBinaryWindows';


const Header = styled(Typography)(({ theme }) => ({
    fontWeight: "bold",
    marginBottom: theme.spacing(2),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    width: "100%",
}));

const AddButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(2),
    width: "100%",
}));

const SubmitButton = styled(Button)(({ theme }) => ({
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

const Import = () => {
    return (
        <Container maxWidth="md" sx={{ marginBottom: 3 }}>
            <Header variant="h6">Import / Upload Database</Header>
            <Grid item xs={12} sm={11}>
                <FormControlLabel
                    control={
                        <Checkbox />
                    }
                    label="Daten anfügen"
                />
            </Grid>
            <Grid item xs={6} sm={3}>
                <SubmitButton variant="contained" color="primary" onClick={() => importBinaryTest()}>
                    Import
                </SubmitButton>
            </Grid>
        </Container >
    );
};

export default Import;