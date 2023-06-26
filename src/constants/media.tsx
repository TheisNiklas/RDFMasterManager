import { useMediaQuery } from 'react-responsive'

export const isMobileDevice = useMediaQuery({
  query: "(min-device-width: 480px)",
});


export const isTabletDevice = useMediaQuery({
  query: "(min-device-width: 768px)",
});

export const isLaptop = useMediaQuery({
  query: "(min-device-width: 1024px)",
});

export const isDesktop = useMediaQuery({
  query: "(min-device-width: 1200px)",
});

export const drawerOpenWidth = {
  mobile: -1,
  tablet: 100,
  laptop: 200,
  desktop: 500
}

export const drawerWidth = {
  mobile: 400,
  tablet: 400,
  laptop: 400,
  desktop : 400
}