"use client"; //use as client

import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import AddTripleForm from "./addtriple";
import FilterForm from "./filter";
import SortFormData from "./sort";
import Import from "./import";
import Export from "./export";
import TextVisualization from "./textVisualization";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Graph3DReact from "./graph3dreact";
import { Rdfcsa } from "../rdf/rdfcsa";
import { ImportService } from "../rdf/importer/import-service";
import { QueryManager } from "../rdf/query-manager";
import { QueryTriple } from "@/rdf/models/query-triple";
import { Dialog, DialogTitle, Button, DialogContent } from "@mui/material";
import { Triple } from "@/rdf/models/triple";

const drawerWidth = 500;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginRight: -drawerWidth,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
}));

const DropDownBox = styled(Box)(({ theme }) => ({
  position: "absolute",
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  height: "100%",
  float: "right",
  right: theme.spacing(8),
  "& .MuiSvgIcon-root": {
    color: "white",
  },
}));

const DropDownForm = styled(FormControl)(({ theme }) => ({
  minWidth: 100,
}));

const DialogButton = styled(Button)(({ theme }) => ({
  marginTop: "16px"
}))

export default function PersistentDrawerRight() {
  // load example Database
  const rdfcsa = new Rdfcsa([]);
  const [currentData, setCurrentData] = React.useState([] as Triple[]);
  const [database, setDatabase] = React.useState(rdfcsa);
  const [sortData, setSortData] = React.useState({
    sortElement: 'sortSubject',
    sortOrder: 'ascending',
    visualLimit: 100
  });

  //const database = React.useRef(new Rdfcsa([]));

  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [mainFrame, setMainFrame] = React.useState("text");

  const handleMainFrame = React.useCallback(() => {
    if (mainFrame === "text") {
      return <TextVisualization database={database} currentData={currentData} setCurrentData={setCurrentData} sortData={sortData} />;
    } else if (mainFrame === "3d") {
      return <Graph3DReact database={database} setDatabase={setDatabase} currentData={currentData} setCurrentData={setCurrentData} />;
    } else if (mainFrame === "2d") {
      return (
        //<Graph2D />
        <div />
      );
    }
  }, [database, currentData, mainFrame]);
  const drownDownMenu = () => {
    return (
      <DropDownBox>
        <DropDownForm variant="standard">
          <InputLabel variant="standard" style={{ color: "white" }}>
            Visualisierung
          </InputLabel>
          <Select
            defaultValue={"text"}
            style={{
              color: "white",
            }}
            inputProps={{
              name: "mainFrame",
            }}
            onChange={(e) => handleDropDownChange(e.target.value)}
          >
            <MenuItem value={"text"}>Text</MenuItem>
            <MenuItem value={"2d"}>2D</MenuItem>
            <MenuItem value={"3d"}>3D</MenuItem>
          </Select>
        </DropDownForm>
      </DropDownBox>
    );
  };

  const handleDropDownChange = (value: any) => {
    setMainFrame(value);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  //State for the Dialog to open
  const [startDialogOpen, setStartDialogOpen] = React.useState(true);

  const handleFromFromExample = () => {
    console.log("set database");
    const rdfcsa = new ImportService().loadSample()
    const queryManager = new QueryManager(rdfcsa);
    const data = queryManager.getTriples([new QueryTriple(null, null, null)]);
    setCurrentData(data);
    setDatabase(rdfcsa);
    setStartDialogOpen(false);
  };

  const handleFromScratch = () => {
    setStartDialogOpen(false);
  }

  const handleImportRequest = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    const importService = new ImportService();

      // Add an event handler to get the selected file path.
      fileInput.addEventListener('change', async event => {
          const file = (event as any).target.files[0];
          const rdfcsa = await importService.importFile(file, true);
          if (rdfcsa === undefined) {
            setStartDialogOpen(true);
          } else {
            setDatabase(rdfcsa);
            const queryManager = new QueryManager(rdfcsa);
            const data = queryManager.getTriples([new QueryTriple(null, null, null)]);
            setCurrentData(data);
            setStartDialogOpen(false);
          }
      });
  
      fileInput.click();
    };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }} component="div">
            RDF Master Manager
          </Typography>
          {drownDownMenu()}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleDrawerOpen}
            sx={{ ...(open && { display: "none" }) }}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Main open={open} style={{padding: 0}}>
        <DrawerHeader />
        {handleMainFrame()}
      </Main>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
          },
        }}
        variant="persistent"
        anchor="right"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <FilterForm database={database} currentData={currentData} setCurrentData={setCurrentData}></FilterForm>
        <SortFormData sortData={sortData} setSortData={setSortData}></SortFormData>
        <AddTripleForm
          database={database}
          setDatabase={setDatabase}
          currentData={currentData}
          setCurrentData={setCurrentData}
        ></AddTripleForm>
        <Import></Import>
        <Export></Export>
      </Drawer>
      <Dialog open={startDialogOpen}>
        <DialogTitle>Open Database / Import</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" alignItems="center">
            <DialogButton variant="contained" color="primary" onClick={handleImportRequest} fullWidth>Import</DialogButton>
            <DialogButton variant="contained" color="primary" onClick={handleFromScratch} fullWidth>Start from Scratch</DialogButton>
            <DialogButton variant="contained" color="primary" onClick={handleFromFromExample} fullWidth>Start from Example</DialogButton>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
