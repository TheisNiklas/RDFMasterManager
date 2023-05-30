import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import CssBaseline from "@mui/material/CssBaseline";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { Dialog, DialogTitle, Button, DialogContent } from "@mui/material";
import { QueryManager } from "../rdf/query-manager";
import { QueryTriple } from "../rdf/models/query-triple";
import { ImportService } from "../rdf/importer/import-service";
import { useSelector, useDispatch } from "react-redux";
import { open, close, setCurrentData, setDatabase } from "./../actions";
import AddTripleForm from "./addTriple";
import DropDownMenue from "./dropDownMenu"
import SortFormData from "./sort";
import FilterForm from "./filter";
import Import from "./import";
import Export from "./export";
import TextVisualization from "./textVisualization";
import Graph3DReact from "./graph3dreact";

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

const DialogButton = styled(Button)(({ theme }) => ({
  marginTop: "16px"
}))

export default function PersistentDrawerRight() {
  const theme = useTheme();

  const [startDialogOpen, setStartDialogOpen] = React.useState(true);

  //Redux
  const drawerOpen = useSelector((state: any) => state.isDrawerOpen);
  const mainFrame = useSelector((state: any) => state.mainFrame);
  const database = useSelector((state: any) => state.database);
  const currentData = useSelector((state: any) => state.currentData);
  const dispatch = useDispatch();
  
  const handleMainFrame = React.useCallback(() => {
    if (mainFrame === "text") {
      return <TextVisualization/>;
    } else if (mainFrame === "3d") {
      return <Graph3DReact/>;
    } else if (mainFrame === "2d") {
      return (
        //<Graph2D />
        <div />
      );
    }
  }, [database, currentData, mainFrame]);

  const handleFromFromExample = () => {
    const rdfcsa = new ImportService().loadSample()
    const queryManager = new QueryManager(rdfcsa);
    const data = queryManager.getTriples([new QueryTriple(null, null, null)]);
    dispatch(setCurrentData(data));
    dispatch(setDatabase(rdfcsa));
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
            if (rdfcsa.tripleCount < 10000) { // TODO: include in config
                const queryManager = new QueryManager(rdfcsa);
                const data = queryManager.getTriples([new QueryTriple(null, null, null)]);
                setCurrentData(data);
            }
            setStartDialogOpen(false);
          }
      });
  
      fileInput.click();
    };

  

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="fixed" open={drawerOpen}>
          <Toolbar>
            <Typography variant="h6" noWrap sx={{ flexGrow: 1 }} component="div">
              RDF Master Manager
            </Typography>
            <DropDownMenue></DropDownMenue>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={() => {
                drawerOpen ? dispatch(close()) : dispatch(open());
              }}
              sx={{ ...(drawerOpen && { display: "none" }) }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Main open={drawerOpen}>
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
          open={drawerOpen}
        >
          <DrawerHeader>
            <IconButton
              onClick={() => {
                drawerOpen ? dispatch(open()) : dispatch(close());
              }}
            >
              {theme.direction === "rtl" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <FilterForm></FilterForm>
        <SortFormData></SortFormData>
        <AddTripleForm></AddTripleForm>
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
    </>
  );
}
