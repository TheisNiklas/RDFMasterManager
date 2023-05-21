'use client'; //use as client

import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import AddTripleForm from './addtriple';
import FilterForm from './filter';
import Import from './import';
import Export from './export';
import TextVisualization from './textVisualization'
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const drawerWidth = 500;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginRight: -drawerWidth,
  ...(open && {
    transition: theme.transitions.create('margin', {
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
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-start',
}));

const DropDownBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  height: '100%',
  float: 'right',
  right: theme.spacing(8),
  '& .MuiSvgIcon-root': {
    color: "white",
  },
}));

const DropDownForm = styled(FormControl)(({ theme }) => ({
  minWidth: 100,
}));


export default function PersistentDrawerRight() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [mainFrame, setMainFrame] = React.useState('text')

  const handleMainFrame = () => {
    if (mainFrame === 'text') {
      return (
        <TextVisualization />
      )
    } else if (mainFrame === '3d') {
      return (
        //<Graph3D />
        <div />
      )
    } else if (mainFrame === '2d') {
      return (
        //<Graph2D />
        <div />
      )
    }
  }
  const drownDownMenu = () => {
    return (
      <DropDownBox>
        <DropDownForm variant="standard">
          <InputLabel variant="standard" style={{ color: 'white' }}>
            Visualisierung
          </InputLabel>
          <Select
            defaultValue={mainFrame}
            style={{
              color: 'white',
            }}
            inputProps={{
              name: 'mainFrame',
            }}
            onChange={e => handleDropDownChange(e.target.value)}
          >
            <MenuItem value={'text'}>Text</MenuItem>
            <MenuItem value={'2d'}>2D</MenuItem>
            <MenuItem value={'3d'}>3D</MenuItem>

          </Select>
        </DropDownForm>
      </DropDownBox >
    )
  };

  const handleDropDownChange = (value: any) => {
    setMainFrame(value)
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
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
            sx={{ ...(open && { display: 'none' }) }}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Main open={open}>
        <DrawerHeader />
        {handleMainFrame()}
      </Main>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
          },
        }}
        variant="persistent"
        anchor="right"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <FilterForm></FilterForm>
        <AddTripleForm></AddTripleForm>
        <Import></Import>
        <Export></Export>
      </Drawer>
    </Box >
  );
}
