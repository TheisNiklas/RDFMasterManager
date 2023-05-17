import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';

const useStyles = makeStyles(({
    root: {
        '& .MuiTableCell-stickyHeader': {
            backgroundColor: '#1976d2'
        },
    },
    dropdownContainer: {
        position: 'absolute',
        top: 0,
        right: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },
    dropdownMenu: {
        maxWidth: 120,
    },

}));


function load_data(format: number) {
    var data = "";
    if (format == 10) {
        data =
            `<http://www.w3.org/2001/sw/RDFCore/ntriples/> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://xmlns.com/foaf/0.1/Document> .
<http://www.w3.org/2001/sw/RDFCore/ntriples/> <http://purl.org/dc/terms/title> "N-Triples"@en-US .
<http://www.w3.org/2001/sw/RDFCore/ntriples/> <http://xmlns.com/foaf/0.1/maker> _:art .
<http://www.w3.org/2001/sw/RDFCore/ntriples/> <http://xmlns.com/foaf/0.1/maker> _:dave .
_:art <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://xmlns.com/foaf/0.1/Person> .
_:art <http://xmlns.com/foaf/0.1/name> "Art Barstow".
_:dave <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://xmlns.com/foaf/0.1/Person> .
_:dave <http://xmlns.com/foaf/0.1/name> "Dave Beckett".
<http://www.w3.org/2001/sw/RDFCore/ntriples/> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://xmlns.com/foaf/0.1/Document> .
 <http://www.w3.org/2001/sw/RDFCore/ntriples/> <http://purl.org/dc/terms/title> "N-Triples"@en-US .
 <http://www.w3.org/2001/sw/RDFCore/ntriples/> <http://xmlns.com/foaf/0.1/maker> _:art .
 <http://www.w3.org/2001/sw/RDFCore/ntriples/> <http://xmlns.com/foaf/0.1/maker> _:dave .
 _:art <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://xmlns.com/foaf/0.1/Person> .
 _:art <http://xmlns.com/foaf/0.1/name> "Art Barstow".
 _:dave <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://xmlns.com/foaf/0.1/Person> .
 _:dave <http://xmlns.com/foaf/0.1/name> "Dave Beckett".
 <http://www.w3.org/2001/sw/RDFCore/ntriples/> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://xmlns.com/foaf/0.1/Document> .
 <http://www.w3.org/2001/sw/RDFCore/ntriples/> <http://purl.org/dc/terms/title> "N-Triples"@en-US .
 <http://www.w3.org/2001/sw/RDFCore/ntriples/> <http://xmlns.com/foaf/0.1/maker> _:art .
 <http://www.w3.org/2001/sw/RDFCore/ntriples/> <http://xmlns.com/foaf/0.1/maker> _:dave .
 _:art <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://xmlns.com/foaf/0.1/Person> .
 _:art <http://xmlns.com/foaf/0.1/name> "Art Barstow".
 _:dave <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://xmlns.com/foaf/0.1/Person> .
 _:dave <http://xmlns.com/foaf/0.1/name> "Dave Beckett".
 <http://www.w3.org/2001/sw/RDFCore/ntriples/> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://xmlns.com/foaf/0.1/Document> .
 <http://www.w3.org/2001/sw/RDFCore/ntriples/> <http://purl.org/dc/terms/title> "N-Triples"@en-US .
 <http://www.w3.org/2001/sw/RDFCore/ntriples/> <http://xmlns.com/foaf/0.1/maker> _:art .
 <http://www.w3.org/2001/sw/RDFCore/ntriples/> <http://xmlns.com/foaf/0.1/maker> _:dave .
 _:art <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://xmlns.com/foaf/0.1/Person> .
 _:art <http://xmlns.com/foaf/0.1/name> "Art Barstow".
 _:dave <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://xmlns.com/foaf/0.1/Person> .
 _:dave <http://xmlns.com/foaf/0.1/name> "Dave Beckett".
 <http://www.w3.org/2001/sw/RDFCore/ntriples/> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://xmlns.com/foaf/0.1/Document> .
 <http://www.w3.org/2001/sw/RDFCore/ntriples/> <http://purl.org/dc/terms/title> "N-Triples"@en-US .
 <http://www.w3.org/2001/sw/RDFCore/ntriples/> <http://xmlns.com/foaf/0.1/maker> _:art .
 <http://www.w3.org/2001/sw/RDFCore/ntriples/> <http://xmlns.com/foaf/0.1/maker> _:dave .
 _:art <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://xmlns.com/foaf/0.1/Person> .
 _:art <http://xmlns.com/foaf/0.1/name> "Art Barstow".
 _:dave <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://xmlns.com/foaf/0.1/Person> .
 _:dave <http://xmlns.com/foaf/0.1/name> "Dave Beckett".
 <http://www.w3.org/2001/sw/RDFCore/ntriples/> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://xmlns.com/foaf/0.1/Document> .
 <http://www.w3.org/2001/sw/RDFCore/ntriples/> <http://purl.org/dc/terms/title> "N-Triples"@en-US .
 <http://www.w3.org/2001/sw/RDFCore/ntriples/> <http://xmlns.com/foaf/0.1/maker> _:art .
 <http://www.w3.org/2001/sw/RDFCore/ntriples/> <http://xmlns.com/foaf/0.1/maker> _:dave .
 _:art <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://xmlns.com/foaf/0.1/Person> .
 _:art <http://xmlns.com/foaf/0.1/name> "Art Barstow".
 _:dave <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://xmlns.com/foaf/0.1/Person> .
 _:dave <http://xmlns.com/foaf/0.1/name> "Dave Beckett". `
    } else if (format == 20) {
        data =
            `@prefix dbr: <http://dbpedia.org/resource/> .
@prefix dbo: <http://dbpedia.org/ontology/> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
  dbr:Barack_Obama dbo:birthDate "2013-05-14"^^xsd:date .
  dbr:Barack_Obama dbo:birthPlace dbr:Hawaii .
  @prefix dbr: <http://dbpedia.org/resource/> .
@prefix dbo: <http://dbpedia.org/ontology/> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
  dbr:Barack_Obama dbo:birthDate "2013-05-14"^^xsd:date .
  dbr:Barack_Obama dbo:birthPlace dbr:Hawaii .
  @prefix dbr: <http://dbpedia.org/resource/> .
@prefix dbo: <http://dbpedia.org/ontology/> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
  dbr:Barack_Obama dbo:birthDate "2013-05-14"^^xsd:date .
  dbr:Barack_Obama dbo:birthPlace dbr:Hawaii .
  @prefix dbr: <http://dbpedia.org/resource/> .
@prefix dbo: <http://dbpedia.org/ontology/> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
  dbr:Barack_Obama dbo:birthDate "2013-05-14"^^xsd:date .
  dbr:Barack_Obama dbo:birthPlace dbr:Hawaii .
  @prefix dbr: <http://dbpedia.org/resource/> .
@prefix dbo: <http://dbpedia.org/ontology/> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
  dbr:Barack_Obama dbo:birthDate "2013-05-14"^^xsd:date .
  dbr:Barack_Obama dbo:birthPlace dbr:Hawaii .`
    }
    return data.split(/\r?\n|\r|\n/g);
}

export default function TextVisualization() {
    const classes = useStyles();
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(15);
    const [format, setFormat] = React.useState(10);
    var rows: string[] = load_data(format);
    var currentId = -1;

    const [title, setTitle] = React.useState('nTriple');;

    const columns = [
        {
            id: 'data',
            minWidth: 170,
            label: 'RDF im %TITLE%-Format'.replace('%TITLE%', title),
            format: (value: any) => value.toLocaleString(),
        },
    ];

    const getId = () => {
        currentId++;
        return currentId;
    }
    const handleChangePage = (event: any, newPage: any) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: any) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleChange = (value: any) => {
        setFormat(value);
        rows = load_data(value);
        currentId = -1;
        if (value == 10) {
            setTitle('nTriple');
        } else if (value == 20) {
            setTitle('Turtle');
        }
    };

    const drownDownMenu = () => {
        return (
            <Box sx={{ maxWidth: 120 }} className={classes.dropdownContainer}>
                <FormControl className={classes.dropdownMenu}>
                    <InputLabel variant="standard" htmlFor="uncontrolled-native">
                        Format
                    </InputLabel>
                    <NativeSelect
                        defaultValue={format}
                        inputProps={{
                            name: 'format',
                            id: 'uncontrolled-native',
                        }}
                        onChange={e => handleChange(e.target.value)}
                    >
                        <option value={10}>nTriple</option>
                        <option value={20}>Turtle</option>
                    </NativeSelect>
                </FormControl>
            </Box >
        )
    }

    return (
        <Card elevation={6} className={classes.root}>
            <TableContainer style={{ height: "80vh" }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead style={{ backgroundColor: "#1976d2" }}>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align='center'
                                    style={{
                                        minWidth: column.minWidth,
                                        fontWeight: "bold",
                                        fontSize: "22px",
                                    }}
                                >
                                    {column.label}
                                    {drownDownMenu()}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                            return (
                                <TableRow hover role="checkbox" tabIndex={-1} key={getId()}>
                                    {columns.map((column: any) => {
                                        const value = row;
                                        return (
                                            <TableCell key={column.id} align={column.align} style={{ fontSize: "18px" }}>
                                                {column.format(value)}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[15, 25, 50]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Card>
    );
}
