import React, { ChangeEvent } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { ImportService } from "../rdf/importer/import-service";
import { QueryManager } from "../rdf/query-manager";
import { QueryTriple } from "../rdf/models/query-triple";
import { Rdfcsa } from "../rdf/rdfcsa";
import { Triple } from "../rdf/models/triple";
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

  let appendData = false;

  //Receives the event with true in the checkbox for new data appended to the old
  //or false if the old data is replaced by the new one
  const handleFormChangeCheckBoxAppendData = (event: ChangeEvent<HTMLInputElement>) => {
    appendData = event.target.checked;
  };

  //To start the data input for attaching to or replacing the old triple data
  const userImportRequest = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    const importService = new ImportService();

    // Add an event handler to get the selected file path.
    fileInput.addEventListener("change", async (event) => {
      const file = (event as any).target.files[0];
      const rdfcsa = await importService.importFile(file, true);
      if (rdfcsa === undefined) {
        setOpen(true);
      } else {
        dispatch(setDatabase(rdfcsa))
        if (rdfcsa.tripleCount < 10000) {
          // TODO: include in config
          const queryManager = new QueryManager(rdfcsa);
          const data = queryManager.getTriples([new QueryTriple(null, null, null)]);
          dispatch(setCurrentData(data));
        } else if (!appendData) {
          setToastMessage("Data not displayed. Exceeds configured maximum.");
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
  }

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container maxWidth="md" sx={{ marginBottom: 3 }}>
      <Header variant="h6">Import / Upload Database</Header>
      <Grid item xs={12} sm={11}>
        <FormControlLabel
          control={
            <Checkbox onChange={(event: ChangeEvent<HTMLInputElement>) => handleFormChangeCheckBoxAppendData(event)} />
          }
          label="Attach data"
        />
      </Grid>
      <Grid item xs={6} sm={3}>
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
