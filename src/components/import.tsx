/**
 * Contributions made by:
 * Niklas Theis
 * Tobias Kaps
 * Kai Joshua Martin
 * Karl Neitmann
 */

import * as React from "react";
import { ChangeEvent } from "react";
import { styled } from "@mui/system";
import {
  Typography,
  TextField,
  Button,
  Grid,
  Container,
  Checkbox,
  FormControl,
  FormControlLabel,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { ImportService } from "../rdf/importer/import-service";
import { QueryManager } from "../rdf/query-manager";
import { QueryTriple } from "../rdf/models/query-triple";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentData, setDatabase } from "../actions";

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
  const dispatch = useDispatch();
  const [toastOpen, setToastOpen] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState("");
  const [replaceDatabase, setReplaceDatabase] = React.useState(false);
  const [useJsBitvector, setUseJsBitvector] = React.useState(false);

  const database = useSelector((state: any) => state.database);

  //Receives the event with true in the checkbox for new data appended to the old
  //or false if the old data is replaced by the new one
  const handleFormChangeCheckBoxAppendData = (event: ChangeEvent<HTMLInputElement>) => {
    setReplaceDatabase(event.target.checked);
    setUseJsBitvector(false);
  };

  //Receives the event with true in the checkbox for new data appended to the old
  //or false if the old data is replaced by the new one
  const handleFormChangeCheckBoxBitvector = (event: ChangeEvent<HTMLInputElement>) => {
    setUseJsBitvector(event.target.checked);
  };

  //To start the data input for attaching to or replacing the old triple data
  const userImportRequest = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    const importService = new ImportService(database);

    // Add an event handler to get the selected file path.
    fileInput.addEventListener("change", async (event) => {
      const file = (event as any).target.files[0];
      const rdfcsa = await importService.importFile(file, replaceDatabase, useJsBitvector);
      if (rdfcsa === undefined) {
        setOpen(true);
      } else {
        dispatch(setDatabase(rdfcsa));
        if (rdfcsa.tripleCount < 10000) {
          // TODO: include in config
          const queryManager = new QueryManager(rdfcsa);
          const data = queryManager.getTriples([new QueryTriple(null, null, null)]);
          dispatch(setCurrentData(data));
        } else if (replaceDatabase) {
          setToastMessage("Data not displayed. Exceeds 10k triples.");
          setToastOpen(true);
          dispatch(setCurrentData([]));
        }
        setOpen(false);
      }
    });

    fileInput.click();
  };

  //State for the Dialog to open
  const [open, setOpen] = React.useState(false);

  const handleToastClose = () => {
    setToastOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container maxWidth="md" sx={{ marginBottom: 3 }}>
      <Header variant="h6">Import / Upload Database</Header>
      <Grid container spacing={0} columns={12}>
        <Grid item xs={5} sm={5}>
          <FormControlLabel
            control={
              <Checkbox
                checked={replaceDatabase}
                onChange={(event: ChangeEvent<HTMLInputElement>) => handleFormChangeCheckBoxAppendData(event)}
              />
            }
            label="Replace Database"
          />
        </Grid>
        <Grid item xs={7} sm={7}>
          <FormControlLabel
            control={
              <Checkbox
                checked={useJsBitvector}
                disabled={!replaceDatabase}
                onChange={(event: ChangeEvent<HTMLInputElement>) => handleFormChangeCheckBoxBitvector(event)}
              />
            }
            label="Use Javascript-Bitvector"
          />
        </Grid>
      </Grid>
      <Grid item xs={1} sm={3}>
        <SubmitButton variant="contained" color="primary" onClick={() => userImportRequest()}>
          Import
        </SubmitButton>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Import cannot be executed."}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">The specified file cannot be imported.</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} autoFocus>
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
      <Snackbar open={toastOpen} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleToastClose} severity="warning" sx={{ width: "100%" }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Import;
