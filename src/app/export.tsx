import React, { ChangeEvent, useEffect, useState } from "react";
import { styled } from "@mui/system";
import {
  Typography,
  Button,
  Grid,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Tooltip,
} from "@mui/material";
import {
  exportSubgraphData,
  exportGraphData,
  importExportFunction,
} from "../rdf/export/ExportBinaryWindows";
import { Rdfcsa } from "@/rdf/rdfcsa";
import { Triple } from "@/rdf/models/triple";
import { ExportService } from "@/rdf/exporter/export-service";
import { QueryManager } from "@/rdf/query-manager";
import { QueryTriple } from "@/rdf/models/query-triple";

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

const Export = ({ database, currentData }: { database: Rdfcsa; currentData: Triple[] }) => {
  const [exportFunction, setExportFunction] = useState("");
  const [exporter, setExporter] = useState(new ExportService());
  const [availableExporters, setAvailableExporters] = useState(new Array<string>());

  useEffect(() => {
    const exportersAvailable = exporter.getAvailableExporters();
    setAvailableExporters(exportersAvailable);
  }, [exporter]);

  useEffect(() => {
    if (availableExporters.length > 0) {
      console.log(availableExporters);
      setExportFunction(availableExporters[0]);
    }
  }, [availableExporters]);
  //receives the user selectoin for the export function
  const handleFormChangeExportFunction = (event: SelectChangeEvent<string>) => {
    setExportFunction(event.target.value);
  };

  //calls the interface function for the import of the export function from the user
  const userImportRequest = () => {
    setOpen(false);
  };

  //calls the interface function for the export of the current selected graph data
  const subgraphDataExport = async () => {
    const result = await exporter.exportTriples(currentData, database.dictionary, exportFunction);
  };

  //calls the interface function for the export of the complete data
  const graphDataExport = async () => {
    console.log(exportFunction);
    const queryManager = new QueryManager(database);
    const allData = queryManager.getTriples([new QueryTriple(null, null, null)]);
    const result = await exporter.exportTriples(allData, database.dictionary, exportFunction);
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
        <SubmitButton variant="contained" color="primary" onClick={() => userImportRequest()}>
          Insert your own export function
        </SubmitButton>
      </Grid>
      <Grid item xs={5} sx={{ marginBottom: 2 }}>
        <Tooltip
          title="Exportfunction from a Javascript file must have the name externExportFunction, with a triple list as parameter"
          placement="top"
        >
          <SortFormControl>
            <InputLabel id="exportFunction">Exportfunction</InputLabel>
            <Select
              labelId="exportFunctionSelect"
              value={exportFunction}
              onChange={(event: SelectChangeEvent<string>) => handleFormChangeExportFunction(event)}
            >
              {availableExporters.map((element, index) => (
                <MenuItem key={index} value={element}>
                  {element}
                </MenuItem>
              ))}
            </Select>
          </SortFormControl>
        </Tooltip>
      </Grid>
      <Grid container spacing={2} alignItems="center" sx={{ marginBottom: 2 }}>
        <Grid item xs={6}>
          <SubmitButton variant="contained" color="primary" onClick={() => graphDataExport()}>
            Export all
          </SubmitButton>
        </Grid>
        <Grid item xs={6}>
          <SubmitButton variant="contained" color="primary" onClick={() => subgraphDataExport()}>
            Export selection
          </SubmitButton>
        </Grid>
      </Grid>
      <SubmitButton variant="contained" color="primary" onClick={() => database.saveDatabase()}>
        Save database in binary
      </SubmitButton>
    </Container>
  );
};

export default Export;
