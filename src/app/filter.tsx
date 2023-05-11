import React, { useState } from 'react';
import { styled } from '@mui/system';
import { Typography, TextField, Button, Grid, IconButton, InputAdornment, FormControl, InputLabel, Select, MenuItem, Container, Box } from '@mui/material';
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

const SortFormControl = styled(FormControl)(({ theme }) => ({
    margin: theme.spacing(1),
    minWidth: 120,
    width: '100%',
    '& .MuiInputLabel-root': {
        minHeight: '1rem',
    },
}));

const SubmitButton = styled(Button)(({ theme }) => ({
    width: '100%',
}));

const FilterTriple = () => {
    return (
        <React.Fragment>
            <Grid item xs={12} sm={4}>
                <StyledTextField label="Subjekt" />
            </Grid>
            <Grid item xs={12} sm={4}>
                <StyledTextField label="Prädikat" />
            </Grid>
            <Grid item xs={12} sm={4}>
                <StyledTextField label="Objekt" />
            </Grid>
        </React.Fragment>
    );
};

const FilterForm = () => {
    const [filterCount, setFilterCount] = useState(1);

    const addFilterTriple = () => {
        setFilterCount(filterCount + 1);
    };

    return (
        <Container maxWidth="md" sx={{ marginBottom: 16 }}>
            <div>
                <Header variant="h6">Filter</Header>
                <Grid container spacing={2}>
                    {[...Array(filterCount)].map((_, i) => (
                        <FilterTriple key={i} />
                    ))}
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12}>
                            <AddButton variant="contained" color="primary" endIcon={<Add />} onClick={addFilterTriple}>
                                Filter hinzufügen
                            </AddButton>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <StyledTextField label="Limit" />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <SortFormControl>
                                        <InputLabel id="sort-label">Sortieren nach</InputLabel>
                                        <Select labelId="sort-label">
                                            <MenuItem value="name">Name</MenuItem>
                                            <MenuItem value="date">Datum</MenuItem>
                                            <MenuItem value="status">Status</MenuItem>
                                        </Select>
                                    </SortFormControl>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <SubmitButton variant="contained" color="primary">
                                Submit
                            </SubmitButton>
                        </Grid>
                    </Grid>

                </Grid>
            </div>
        </Container>
    );
};

export default FilterForm;
