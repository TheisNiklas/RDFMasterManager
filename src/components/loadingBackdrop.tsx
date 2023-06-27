/**
 * Contributions made by:
 * Kai Joshua Martin
 */
import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import { useSelector, useDispatch } from "react-redux";
import Typography from '@mui/material/Typography';

export default function LoadingBackdrop() {
  const loading = useSelector((state: any) => state.loading);

  return (
    <div>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <Typography>Loading...</Typography>
      </Backdrop>
    </div>
  );
}