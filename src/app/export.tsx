import React, { ChangeEvent } from "react";
import { styled } from '@mui/system';
import { Typography, Button, Grid, Container, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Tooltip } from '@mui/material';
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
    };

    //calls the interface function for the import of the export function from the user
    const userImportRequest = (
    ) => {
        setOpen(!importExportFunction());
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

    //State for the Dialog to open
    const [open, setOpen] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
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
                    Insert your own export function
                </SubmitButton>
            </Grid>
            <Grid item xs={5} sx={{ marginBottom: 2 }}>
                <Tooltip title="Exportfunction from a Javascript file must have the name externExportFunction, with a triple list as parameter" placement="top">
                    <SortFormControl>
                        <InputLabel id="exportFunction">Exportfunction</InputLabel>
                        <Select 
                            labelId="exportFunctionSelect"
                            defaultValue="binaer"
                            onChange={(event: SelectChangeEvent<string>) => handleFormChangeExportFunction(event)}
                        >
                            <MenuItem value="binaer">native as binary file (default)</MenuItem>
                            <MenuItem value="turtle">Turtle-Datei</MenuItem>
                            <MenuItem value="nTriple">n-Triple-Datei</MenuItem>
                            <MenuItem value="json">JSON-Datei</MenuItem>
                        </Select>
                    </SortFormControl>
                </Tooltip>
            </Grid>
            <Grid container spacing={2} alignItems="center" sx={{ marginBottom: 2 }}>
                <Grid item xs={6}>
                    <SubmitButton
                        variant="contained"
                        color="primary"
                        onClick={() => graphDataExport()}
                    >
                        Export all
                    </SubmitButton>
                </Grid>
                <Grid item xs={6}>
                    <SubmitButton
                        variant="contained"
                        color="primary"
                        onClick={() => subgraphDataExport()}
                    >
                        Export selection
                    </SubmitButton>
                </Grid>
            </Grid>
            <SubmitButton variant="contained" color="primary" onClick={() => exportBinaryTest()}>
                Save database in binary
            </SubmitButton>
        </Container >
    );
};

export default Export;