import React, { ChangeEvent } from "react";
import { styled } from '@mui/system';
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
    DialogActions
} from '@mui/material';
import { importFile } from '../rdf/import/ImportBinaryWindows';

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

    let appendData = false;

    //Receives the event with true in the checkbox for new data appended to the old 
    //or false if the old data is replaced by the new one
    const handleFormChangeCheckBoxAppendData = (
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        appendData = event.target.checked;
    };

    //To start the data input for attaching to or replacing the old triple data
    const userImportRequest = (
    ) => {
        setOpen(!importFile(appendData));
    };

    //State for the Dialog to open
    const [open, setOpen] = React.useState(false);

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
                    <DialogTitle id="alert-dialog-title">
                        {"Import cannot be executed."}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                        The specified file cannot be imported.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} autoFocus>
                            OK
                        </Button>
                    </DialogActions>
                </Dialog>
            </Grid>
        </Container >
    );
};

export default Import;