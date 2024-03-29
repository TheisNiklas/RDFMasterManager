/**
 * Contributions made by:
 * Tobias Kaps
 * Bjarne Küper
 * Kai Joshua Martin
 * Karl Neitmann
 * Sarah Flohr
 * Niklas Theis
 */

import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Dialog, DialogTitle, Button, DialogContent, DialogContentText } from "@mui/material";
import { QueryManager } from "../rdf/query-manager";
import { QueryTriple } from "../rdf/models/query-triple";
import { ImportService } from "../rdf/importer/import-service";
import { useSelector, useDispatch } from "react-redux";
import { FormControlLabel, Checkbox } from "@mui/material";
import { ChangeEvent } from "react";
import { open, close, setCurrentData, setDatabase, setGraphData, setMetaData, setLoading } from "./../actions";
import AddTripleForm from "./addTriple";
import DropDownMenue from "./dropDownMenu";
import FilterForm from "./filter";
import Import from "./import";
import Export from "./export";
import TextVisualization from "./textVisualization";
import Graph3DReact from "./graph3dreact";
import Graph2DReact from "./graph2dreact";
import { QueryCall } from "../interface/query-call";
import MetaDataForm from "./metaDataForm";
import { Rdfcsa } from "../rdf/rdfcsa";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import LoadingBackdrop from "./loadingBackdrop";

let drawerWidth = 500;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(2),
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
  marginTop: "16px",
}));

export default function PersistentDrawerRight() {
  document.body.style.overflow = "hidden";

  const theme = useTheme();
  const [startDialogOpen, setStartDialogOpen] = React.useState(true);
  const [openDialog, setOpenDialog] = React.useState(true);
  const [drawerWidth, setDrawerWidth] = React.useState(500);
  const [toastOpen, setToastOpen] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState("");
  window.matchMedia("(orientation: portrait)").addEventListener("change", (e) => {
    const portrait = e.matches;
    if (portrait) {
      setOpenDialog(true);
    } else {
      setOpenDialog(false);
    }
  });

  //Redux
  const drawerOpen = useSelector((state: any) => state.isDrawerOpen);
  const mainFrame = useSelector((state: any) => state.mainFrame);
  const database = useSelector((state: any) => state.database);
  const currentData = useSelector((state: any) => state.currentData);
  const graphData = useSelector((state: any) => state.graphData);
  const dispatch = useDispatch();

  const [useJsBitvector, setUseJsBitvector] = React.useState(true);

  const handleFormChangeCheckBoxBitvector = (event: ChangeEvent<HTMLInputElement>) => {
    setUseJsBitvector(event.target.checked);
  };

  // Close popup - toastmsg
  const handleToastClose = () => {
    setToastOpen(false);
  };

  const handleMainFrame = React.useCallback(() => {
    if (mainFrame === "text") {
      return <TextVisualization />;
    } else if (mainFrame === "3d") {
      return <Graph3DReact />;
    } else if (mainFrame === "2d") {
      return <Graph2DReact />;
    } else if (mainFrame === "blank") {
      return <div></div>;
    }
  }, [database, currentData, mainFrame, graphData]);

  /**
   * Update meta data. Query for meta data triples.
   * @param rdfcsa Database to query on
   */
  const updateMetaData = (rdfcsa) => {
    let metaData = QueryCall.queryCallData([{ subject: "RDFCSA:METADATA", predicate: "", object: "" }], rdfcsa);
    if (metaData) {
      dispatch(setMetaData(metaData));
    }
  };

  /**
   * Init current session by setting current data, current database and update meta data. Don't set current data if more than 10k triples in db.
   * @param rdfcsa Database that should be initialized
   */
  const initCurrentData = (rdfcsa) => {
    dispatch(setDatabase(rdfcsa));
    updateMetaData(rdfcsa);
    if (rdfcsa.tripleCount < 10000) {
      const queryManager = new QueryManager(rdfcsa);
      const data = queryManager.getTriples([new QueryTriple(null, null, null)]);
      dispatch(setCurrentData(data));
    } else {
      setToastMessage("Data not displayed. Exceeds 10k triples. Query manually");
      setToastOpen(true);
      dispatch(setCurrentData([]));
    }
  };

  /**
   * Import Rdfcsa Example
   */
  const handleFromFromExample = () => {
    const rdfcsa = new ImportService().loadSample(useJsBitvector);

    initCurrentData(rdfcsa);

    dispatch(setGraphData(database, currentData));
    setStartDialogOpen(false);
  };

  /**
   * Start with an emtpy rdfcsa database
   */
  const handleFromScratch = () => {
    const rdfcsa = new Rdfcsa([], useJsBitvector);
    dispatch(setDatabase(rdfcsa));
    setStartDialogOpen(false);
  };

  /**
   * Import an existing rdfcsa database
   */
  const handleImportRequest = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    const importService = new ImportService();

    // Add an event handler to get the selected file path.
    fileInput.addEventListener("change", async (event) => {
      const file = (event as any).target.files[0];
      setStartDialogOpen(false);
      dispatch(setLoading(true));
      const rdfcsa = await importService.importFile(file, true, useJsBitvector);
      if (rdfcsa === undefined) {
        setStartDialogOpen(true);
      } else {
        initCurrentData(rdfcsa);
      }
      dispatch(setLoading(false));
    });

    fileInput.click();
  };

  //Change of the layout width for the mobile device, tablet and pc
  function isMobileDevice() {
    if (window.screen.width < 1200 && window.screen.width >= 320) {
      return true;
    } else {
      return false;
    }
  }

  //Change of the layout width for the mobile device
  const handleDrawerOpen = () => {
    if (isMobileDevice()) {
      setDrawerWidth(400);
    } else {
      setDrawerWidth(500);
    }
    dispatch(open());
  };

  //Change of the layout width for the mobile device
  const handleDrawerClose = () => {
    if (isMobileDevice()) {
      setDrawerWidth(500);
    } else {
      setDrawerWidth(400);
    }
    dispatch(close());
  };

  //UseEffect for the landscape and portrait orientation
  React.useEffect(() => {
    const portrait = window.matchMedia("(orientation: portrait)").matches;
    if (portrait) {
      setOpenDialog(true);
    } else {
      setOpenDialog(false);
    }
  }, []);

  return (
    <>
      <Box sx={{ display: "flex", overflow: "hidden" }}>
        <CssBaseline />
        <AppBar position="fixed" open={drawerOpen}>
          <Toolbar>
            <Typography variant="h6" noWrap sx={{ flexGrow: 1 }} component="div">
              RDF Master Manager
            </Typography>
            <Typography variant="h6" noWrap sx={{ flexGrow: 4 }} component="div">
              Triples: {database.tripleCount} ({currentData.length} displayed)
            </Typography>
            <DropDownMenue></DropDownMenue>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={() => {
                drawerOpen ? handleDrawerClose() : handleDrawerOpen();
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
              ...(isMobileDevice() && {
                width: "100%",
              }),
            },
          }}
          variant="persistent"
          anchor="right"
          open={drawerOpen}
        >
          <DrawerHeader>
            <IconButton
              onClick={() => {
                drawerOpen ? handleDrawerOpen() : handleDrawerClose();
              }}
            >
              {theme.direction === "rtl" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <FilterForm></FilterForm>
          <MetaDataForm></MetaDataForm>
          <AddTripleForm></AddTripleForm>
          <Import></Import>
          <Export></Export>
        </Drawer>
        <Dialog open={startDialogOpen}>
          <DialogTitle>Open Database / Import</DialogTitle>
          <DialogContent>
            <Box display="flex" flexDirection="column" alignItems="center">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={useJsBitvector}
                    onChange={(event: ChangeEvent<HTMLInputElement>) => handleFormChangeCheckBoxBitvector(event)}
                  />
                }
                label="Use Javascript-Bitvector"
              />
              <DialogButton variant="contained" color="primary" onClick={handleImportRequest} fullWidth>
                Import
              </DialogButton>
              <DialogButton variant="contained" color="primary" onClick={handleFromScratch} fullWidth>
                Start from Scratch
              </DialogButton>
              <DialogButton variant="contained" color="primary" onClick={handleFromFromExample} fullWidth>
                Start from Example
              </DialogButton>
            </Box>
          </DialogContent>
        </Dialog>
      </Box>
      <Dialog
        open={openDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullScreen={true}
      >
        <DialogTitle id="alert-dialog-title">
          {"Bitte drehen Sie Ihr Gerät oder erweitern Sie das Fenster."}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Die Website funktioniert nur in der Landscape-Ansicht oder in Full-Screen.
          </DialogContentText>
        </DialogContent>
      </Dialog>
      <Snackbar open={toastOpen} autoHideDuration={6000} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        <Alert onClose={handleToastClose} severity="warning" sx={{ width: "100%" }}>
          {toastMessage}
        </Alert>
      </Snackbar>
      <LoadingBackdrop />
    </>
  );
}
