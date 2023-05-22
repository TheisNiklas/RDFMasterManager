import React from 'react';
import { styled } from '@mui/system';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const TextCard = styled(Card)(({ theme }) => ({
    '& .MuiTableCell-stickyHeader': {
        backgroundColor: '#1976d2'
    },
}));

const DropDownBox = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: 0,
    right: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    maxWidth: 120,
    '& .MuiSvgIcon-root': {
        color: "white",
    },
}));

const DropDownForm = styled(FormControl)(({ theme }) => ({
    maxWidth: 120,
}));


function load_data(format: string) {
    var data = "";
    if (format === 'nTriple') {
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
    } else if (format === 'Turtle') {
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
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(15);
    const [format, setFormat] = React.useState('nTriple');
    var rows: string[] = load_data(format);
    var currentId = -1;

    const columns = [
        {
            id: 'data',
            minWidth: 170,
            label: 'RDF im %TITLE%-Format'.replace('%TITLE%', format),
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
    };

    const drownDownMenu = () => {
        return (
            <DropDownBox>
                <DropDownForm variant="standard">
                    <InputLabel variant="standard" style={{ color: 'white' }}>
                        Format
                    </InputLabel>
                    <Select
                        defaultValue={format}
                        inputProps={{
                            name: 'format',
                        }}
                        style={{
                            color: 'white',
                        }}
                        onChange={e => handleChange(e.target.value)}
                    >
                        <MenuItem value={'nTriple'}> nTriple</MenuItem >
                        <MenuItem value={'Turtle'}>Turtle</MenuItem >
                    </Select>
                </DropDownForm>
            </DropDownBox >
        )
    }

    return (
        <TextCard elevation={6}>
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
                                        color: "white",
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
        </TextCard>
    );
}
