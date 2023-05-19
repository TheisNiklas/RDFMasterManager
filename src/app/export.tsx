import React, { ChangeEvent } from "react";
import { styled } from '@mui/system';
import { Typography, Button, Grid, Container, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import { exportBinaryTest, exportSubgraphData, exportGraphData, importExportFunction } from '../rdf/export/ExportBinaryWindows';

const Header = styled(Typography)(({ theme }) => ({
    fontWeight: "bold",
    marginBottom: theme.spacing(2),
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

    let exportFunction = "binaer";

    //receives the user selectoin for the export function
    const handleFormChangeExportFunction = (
        event: SelectChangeEvent<string>,
    ) => {
        exportFunction = event.target.value;
        console.log(exportFunction);
    };

    //calls the interface function for the import of the export function from the user
    const userImportRequest = (
    ) => {
        importExportFunction();
    };

    //calls the interface function for the export of the current selected graph data
    const subgraphDataExport = (
    ) => {
        exportSubgraphData(exportFunction);
    };

    //calls the interface function for the export of the complete data
    const graphDataExport = (
    ) => {
        exportGraphData(exportFunction);
    };

    return (
        <Container maxWidth="md" sx={{ marginBottom: 2 }}>
            <Header variant="h6">Export</Header>
            <Grid item xs={6} sx={{ marginBottom: 2 }}>
                <SubmitButton
                    variant="contained"
                    color="primary"
                    onClick={() => userImportRequest()}
                >
                    Eigenen Export einfügen
                </SubmitButton>
            </Grid>
            <Grid item xs={5}>
                <SortFormControl>
                    <InputLabel id="exportFunction">Exportfunktion</InputLabel>
                    <Select labelId="exportFunctionSelect" onChange={(event: SelectChangeEvent<string>) => handleFormChangeExportFunction(event)}>
                        <MenuItem value="binaer">nativ als Binärdatei (Standard)</MenuItem>
                        <MenuItem value="turtle">Turtle-Datei</MenuItem>
                        <MenuItem value="nTriple">n-Triple-Datei</MenuItem>
                        <MenuItem value="json">JSON-Datei</MenuItem>
                    </Select>
                </SortFormControl>
            </Grid>
            <Grid container spacing={2} alignItems="center" sx={{ marginBottom: 2 }}>
                <Grid item xs={6}>
                    <SubmitButton
                        variant="contained"
                        color="primary"
                        onClick={() => graphDataExport()}
                    >
                        Export alle
                    </SubmitButton>
                </Grid>
                <Grid item xs={6}>
                    <SubmitButton
                        variant="contained"
                        color="primary"
                        onClick={() => subgraphDataExport()}
                    >
                        Export Selektion
                    </SubmitButton>
                </Grid>
            </Grid>
            <SubmitButton variant="contained" color="primary" onClick={() => exportBinaryTest()}>
                Datenbasis speichern in Binär
            </SubmitButton>
        </Container >
    );
};

export default Export;