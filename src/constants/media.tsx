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

export const isBigScreen = useMediaQuery({
  query: "(min-device-width: 1201px )",
});