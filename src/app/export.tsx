import React from 'react';
import { styled } from '@mui/system';
import { Typography, TextField, Button, Grid, Container, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { exportBinaryTest } from '../rdf/export/ExportBinaryWindows';


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
    margin: theme.spacing(0),
    width: "100%",
    "& .MuiInputLabel-root": {
        minHeight: "1rem",
    },
}));

const Export = () => {
    return (
        <Container maxWidth="md" sx={{ marginBottom: 2 }}>
            <Header variant="h6">Export</Header>
            <Grid item xs={6} sx={{ marginBottom: 2 }}>
                <AddButton
                    variant="contained"
                    color="primary"
                >
                    Eigenen Export einfügen
                </AddButton>
            </Grid>
            <Grid item xs={5}>
                <SortFormControl>
                    <InputLabel id="exportFunction">Exportfunktion</InputLabel>
                    <Select labelId="exportFunctionSelect">
                        <MenuItem value="binaer">nativ als Binärdatei (Standard)</MenuItem>
                        <MenuItem value="turtle">Turtle-Datei</MenuItem>
                        <MenuItem value="nTriple">n-Triple-Datei</MenuItem>
                        <MenuItem value="json">JSON-Datei</MenuItem>
                    </Select>
                </SortFormControl>
            </Grid>
            <Grid container spacing={2} alignItems="center" sx={{ marginBottom: 2 }}>
                <Grid item xs={6}>
                    <AddButton
                        variant="contained"
                        color="primary"
                    >
                        Export alle
                    </AddButton>
                </Grid>
                <Grid item xs={6}>
                    <AddButton
                        variant="contained"
                        color="primary"
                    >
                        Export Selektion
                    </AddButton>
                </Grid>
            </Grid>
            <SubmitButton variant="contained" color="primary" onClick={() => exportBinaryTest()}>
                Datenbasis speichern
            </SubmitButton>
        </Container >
    );
};

export default Export;