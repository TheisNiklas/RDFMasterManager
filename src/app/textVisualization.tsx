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
import { Triple } from '@/rdf/models/triple';
import { Rdfcsa } from '@/rdf/rdfcsa';

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


/**
 * Load default format. Use ExportService to fetch data. Set first format as default.
 * @returns Returns default format
 */
function loadDefaultFormat() {
    const exporter = new ExportService();
    const export_options = exporter.getAvailableExporters();

    return export_options[0][0]
}

export default function TextVisualization({ database, currentData, setCurrentData }: { database: Rdfcsa, currentData: Triple[], setCurrentData: React.Dispatch<React.SetStateAction<Triple[]>> }) {
    const [data, setData] = React.useState(currentData);

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(15);
    const [format, setFormat] = React.useState(loadDefaultFormat());
    const [defaultFormat, setDefaultFormat] = React.useState(loadDefaultFormat());
    const [rows, setRows] = React.useState([]);

    var currentId = -1;

    const columns = [
        {
            id: 'data',
            minWidth: 170,
            label: 'RDF im %TITLE%-Format'.replace('%TITLE%', format),
            format: (value: any) => value.toLocaleString(),
        },
    ];

    /**
     * Get a unique id. This will be called to give rows a unique id.
     * @returns Returns a unique id.
     */
    const getId = () => {
        currentId++;
        return currentId;
    }

    /**
     * Change page.
     */
    const handleChangePage = (event: any, newPage: any) => {
        setPage(newPage);
    };

    /**
     * Update rows per page and reload page.
     */
    const handleChangeRowsPerPage = (event: any) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    /**
     * Change the current format and also update rows to display new format. This will 
     * be called when the value of the dropdown menu changes.
     * @param value New format
     */
    const handleChange = (value: any) => {
        setFormat(value);
        currentId = -1;
        getRows(value, data);
    };

    /**
     * Get options for dropdown menu. Use ExportService to fetch available export formats.
     * @returns Returns a list of MenuItems that will be used in the dropdown menu
     */
    const getOptions = () => {
        const exporter = new ExportService();
        const export_options = exporter.getAvailableExporters();

        let menuItems = []
        for (let i = 0; i < export_options[0].length; i++) {
            menuItems.push(<MenuItem value={export_options[0][i]}> {export_options[0][i]} </MenuItem >)
        }

        return menuItems
    }

    /**
     * Get rows that will be displayed. Fetch data with an ExportService object.
     * @param format Format of the data that should be fetched
     * @param data Triples that should be converted to a text
     */
    async function getRows(format: string, data: any) {
        const exporter = new ExportService();
        if (currentData === undefined) {
            return [];
        }
        const value = await exporter.serializeTriples(data, database.dictionary, format);

        console.log("Fetching new data for format: " + format)
        if (value === "") {
            setRows([]);
            return
        }
        var value_splitted = value.split(/\r?\n|\r|\n/g);
        if (value_splitted[value_splitted.length - 1] === "") {
            value_splitted.pop();
        }
        setRows(value_splitted);
    }

    React.useEffect(() => {
        // Update data and rows depending on current query
        setData(currentData);
        getRows(format, currentData);
    }, [currentData])

    /**
     * DropDown Menu for format.
     * @returns Return a DropDown Menu to select a format.
     */
    const drownDownMenu = () => {
        return (
            <DropDownBox>
                <DropDownForm variant="standard">
                    <InputLabel variant="standard" style={{ color: 'white' }}>
                        Format
                    </InputLabel>
                    <Select
                        defaultValue={defaultFormat}
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
