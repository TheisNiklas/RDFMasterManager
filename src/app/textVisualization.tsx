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
import { ExportService } from '@/rdf/exporter/export-service';

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


function load_data(format: string, database: any, currentData: any) {
    // WIP, exporter doesn't return strings yet
    const exporter = new ExportService();
    if (currentData === undefined) {
        return [];
    }
    var data = "" //exporter.exportTriples(currentData, database.current.dictionary, 'N-Triples');

    if (data === "") {
        return []
    }
    return data.split(/\r?\n|\r|\n/g);

}

function loadDefaultFormat() {
    const exporter = new ExportService();
    const export_options = exporter.getAvailableExporters();

    return export_options[0][0]
}

export default function TextVisualization({ database, queryManager, currentData, setCurrentData }: { database: any, queryManager: any, currentData: any, setCurrentData: any }) {
    const [data, setData] = React.useState(currentData);

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(15);
    const [format, setFormat] = React.useState(loadDefaultFormat());
    var rows: string[] = load_data(format, database, currentData);
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
        rows = load_data(value, database, currentData);
        currentId = -1;
    };

    const getOptions = () => {
        const exporter = new ExportService();
        const export_options = exporter.getAvailableExporters();

        console.log(export_options);

        let menuItems = []
        for (let i = 0; i < export_options[0].length; i++) {
            menuItems.push(<MenuItem value={export_options[0][i]}> {export_options[0][i]} </MenuItem >)
        }
        console.log(menuItems)

        return menuItems
    }

    React.useEffect(() => {
        console.log("TODO: Refresh GUI");
        setData(load_data(format, database, currentData));
    }, [currentData])

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
                        {getOptions()}
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
