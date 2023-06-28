/**
 * Contributions made by:
 * Niklas Theis
 * Tobias Kaps
 * Kai Joshua Martin
 * Karl Neitmann
 */
import * as React from "react";
import { useEffect, useState } from "react";
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
import { ExportService } from "../rdf/exporter/export-service";
import { QueryManager } from "../rdf/query-manager";
import { QueryTriple } from "../rdf/models/query-triple";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "./../actions";

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

//Backend call for the exportService
const Export = () => {
  const [exportFunction, setExportFunction] = useState("");
  const [exporter, setExporter] = useState(new ExportService());
  const [availableExporters, setAvailableExporters] = useState(exporter.getAvailableExporters());

  const database = useSelector((state: any) => state.database);
  const currentData = useSelector((state: any) => state.currentData);

  const dispatch = useDispatch();

  useEffect(() => {
    const exportersAvailable = exporter.getAvailableExporters();
    setAvailableExporters(exportersAvailable);
  }, [exporter]);

  useEffect(() => {
    if (availableExporters.length > 0) {
      setExportFunction(availableExporters[0]);
    }
  }, [availableExporters]);

  //Receives the user selectoin for the export function
  const handleFormChangeExportFunction = (event: SelectChangeEvent<string>) => {
    setExportFunction(event.target.value);
  };

  /**
   * Queries for all triples and exports them
   */
  const exportSelectedTriples = async () => {
    const result = await exporter.exportTriples(currentData, database.dictionary, exportFunction);
    dispatch(setLoading(false));
  };

  //calls the interface function for the export of the current selected graph data. Don't call exportSelectedTriples directly. Otherwise backdrop wont be rendered
  const subgraphDataExport = async () => {
    dispatch(setLoading(true));
    // Set timeout here to give components time to render backdrop
    setTimeout(exportSelectedTriples, 5);
  };

  /**
   * Queries for all triples and exports them
   */
  const exportAllTriples = async () => {
    const queryManager = new QueryManager(database);
    const allData = queryManager.getTriples([new QueryTriple(null, null, null)]);
    const result = await exporter.exportTriples(allData, database.dictionary, exportFunction);
    dispatch(setLoading(false));
  };

  //calls the interface function for the export of the complete data. Don't call exportAllTriples directly. Otherwise backdrop wont be rendered
  const graphDataExport = async () => {
    dispatch(setLoading(true));
    // Set timeout here to give components time to render backdrop
    setTimeout(exportAllTriples, 5);
  };

  /**
   * Save database as binary file.
   */
  const saveDatabase = async () => {
    const result = await database.saveDatabase();
    dispatch(setLoading(false));
  };

  /**
   * Handle save database event. Don't call saveDatabase directly. Otherwise backdrop wont be rendered
   */
  const handleSaveDatabase = async () => {
    dispatch(setLoading(true));
    // Set timeout here to give components time to render backdrop
    setTimeout(saveDatabase, 5);
  };

  return (
    <Container maxWidth="md" sx={{ marginBottom: 2 }}>
      <Header variant="h6">Export</Header>
      <Grid item xs={5} sx={{ marginBottom: 2 }}>
        <Tooltip title="n-triple is the default format" placement="top">
          <SortFormControl>
            <InputLabel id="exportFunction">Exportfunction</InputLabel>
            <Select
              labelId="exportFunctionSelect"
              defaultValue="N-Triples"
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
      <SubmitButton variant="contained" color="primary" onClick={() => handleSaveDatabase()}>
        Save database in binary
      </SubmitButton>
    </Container>
  );
};

export default Export;
