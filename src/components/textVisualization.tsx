import * as React from 'react'
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
import { ExportService } from '../rdf/exporter/export-service';
import { useSelector, useDispatch } from "react-redux";
import JsonView from 'react18-json-view';
import 'react18-json-view/src/style.css';
import Grid from '@mui/material/Grid';

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

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: "white",
    },
    '&:nth-of-type(even)': {
      backgroundColor: "#f0f0f5",
    },
  }));


/**
 * Load default format. Use ExportService to fetch data. Set first format as default.
 * @returns Returns default format
 */
function loadDefaultFormat() {
    const exporter = new ExportService();
    const export_options = exporter.getAvailableExporters();

    return export_options[0]
}

function isMobileDevice() {
    if (window.screen.width < 1200 && window.screen.width >= 320) {
        return true;
    } else {
        return false;
    }
}

function getTableSize() {
    if (isMobileDevice()) {
        return 'small';
    } else {
        return 'medium';
    }
}

/**
 * Get options for dropdown menu. Use ExportService to fetch available export formats.
 * @returns Returns a list of MenuItems that will be used in the dropdown menu
 */
const getOptions = () => {
    const exporter = new ExportService();
    const export_options = exporter.getAvailableExporters();

    let menuItems = []
    for (let i = 0; i < export_options[0].length; i++) {
        if (export_options[i] != undefined) {
            menuItems.push(<MenuItem value={export_options[i]} key={export_options[i]}> {export_options[i]} </MenuItem >)
        }
    }

    return menuItems
}

export default function TextVisualization() {

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(15);
    const [format, setFormat] = React.useState(loadDefaultFormat());
    const [defaultFormat, setDefaultFormat] = React.useState(loadDefaultFormat());
    const [rows, setRows] = React.useState([]);
    const [menuitems, setMenuitems] = React.useState(getOptions())
    const [jsonData, setJsonData] = React.useState("")
    const [rowsLength, setRowsLength] = React.useState(0)


    const database = useSelector((state: any) => state.database);
    const currentData = useSelector((state: any) => state.currentData);
    const sortOptions = useSelector((state: any) => state.sortOptions);
    let currentId = -1;

    const columns = [
        {
            id: 'data',
            minWidth: 170,
            label: 'RDF in %TITLE%-Format'.replace('%TITLE%', format),
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
     * This method is only used for turtle Format! Check if current value need intendation.
     * @param value String value of the current row
     * @returns Returns true if current row needs intendation. Returns false if not.
     */
    const needsIntendation = (value: string) => {
        value = value.toLocaleString();
        let value_splitted = value.split(' ');
        if (value_splitted.length > 3) {
            return true;
        }
        return false;
    }

    /**
     * Change page.
     */
    const handleChangePage = (event: any, newPage: number) => {
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
        getRows(value, currentData);
    };

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

        if (value === "") {
            setRows([]);
            return
        }
        // Set up data for json viewer
        if (format == "JSON-LD") {
            let jsonData = JSON.parse(value)
            setJsonData(jsonData);
            setRowsLength(jsonData.length)
            if (jsonData.length < rowsLength) {
                setPage(0);
            }
            return
        }
        // Set up data for turtle and ntriple
        var value_splitted = value.split(/\r?\n|\r|\n/g);
        if (value_splitted[value_splitted.length - 1] === "") {
            value_splitted.pop();
        }
        setRows(value_splitted);
        setRowsLength(value_splitted.length)
        if (value_splitted.length < rowsLength) {
            setPage(0);
        }
    }

    React.useEffect(() => {
        // Update data and rows depending on current query
        getRows(format, currentData);
        setPage(0);
    }, [currentData])

    React.useEffect(() => {
    }, [sortOptions])


    /**
     * DropDown Menu for format.
     * @returns Return a DropDown Menu to select a format.
     */
    const drownDownMenu = () => {
        return (
            <DropDownBox >
                <DropDownForm variant='standard'>
                    {
                        !isMobileDevice() &&
                        <InputLabel id='format_chooser_label' style={{ color: 'white' }}>
                            Format
                        </InputLabel>
                    }
                    <Select
                        labelId='format_chooser_label'
                        defaultValue={defaultFormat}
                        inputProps={{
                            name: 'format',
                        }}
                        style={{
                            color: 'white',
                        }}
                        label='Format'
                        onChange={e => handleChange(e.target.value)}
                    >
                        {menuitems}
                    </Select>
                </DropDownForm>
            </DropDownBox >
        )
    }

    return (
        <TextCard elevation={6} sx={{
            width: "98vw",
            ...(isMobileDevice() && {
                width: "95vw",
            }),
            ...(!isMobileDevice() && {
                width: "98vw",
            }),
        }}>
            <TableContainer sx={{
                height: "80vh",
                ...(isMobileDevice() && {
                    height: "45vh"
                }),
                ...(!isMobileDevice() && {
                    height: "80vh",
                }),
            }}>
                <Table stickyHeader={!isMobileDevice()} aria-label="sticky table" size={getTableSize()}>
                    <TableHead style={{ backgroundColor: "#1976d2" }}>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align='center'
                                    sx={{
                                        minWidth: column.minWidth,
                                        fontWeight: "bold",
                                        fontSize: "22px",
                                        color: "white",
                                        ...(isMobileDevice() && {
                                            overflow: 'visible',
                                            position: 'relative',
                                        }),
                                    }}
                                >
                                    {column.label}
                                    {drownDownMenu()}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    {
                        format === "JSON-LD"
                            ?
                            <TableBody>
                                {/* JSON Viewer */}
                                <TableRow>
                                    <TableCell>
                                        <JsonView src={jsonData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)} />
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                            :
                            <TableBody>
                                {/* TextView */}
                                {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row: string) => {
                                    return (
                                        <StyledTableRow role="checkbox" tabIndex={-1} key={getId()}>
                                            {columns.map((column: any) => {
                                                const value = row;
                                                return (
                                                    <TableCell key={column.id} align={column.align} style={{ fontSize: "18px" }}>
                                                        {
                                                            (format === "Turtle" && needsIntendation(value))
                                                                ?
                                                                <Grid container spacing={0}>
                                                                    {/* Intendation for turtle */}
                                                                    <Grid item xs={0.25} />
                                                                    <Grid item xs={10}>
                                                                        {column.format(value)}
                                                                    </Grid>
                                                                </Grid>
                                                                : <div>{column.format(value)}</div>
                                                        }
                                                    </TableCell>
                                                );
                                            })}
                                        </StyledTableRow>
                                    );
                                })}
                            </TableBody>
                    }
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[15, 25, 50]}
                component="div"
                count={rowsLength}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </TextCard>
    );
}
