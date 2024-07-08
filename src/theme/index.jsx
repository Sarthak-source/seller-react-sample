import { useMemo } from 'react';
// Importing useMemo hook from React to memoize the theme configuration.
import PropTypes from 'prop-types';
// Importing PropTypes for type checking of props.

import CssBaseline from '@mui/material/CssBaseline';
// Importing CssBaseline from Material-UI to provide a consistent baseline to build upon.
import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
// Importing createTheme and ThemeProvider from Material-UI for theme creation and application.

import { palette } from './palette';
// Importing the palette configuration.
import { shadows } from './shadows';
// Importing the shadows configuration.
import { overrides } from './overrides';
// Importing the overrides configuration.
import { typography } from './typography';
// Importing the typography configuration.
import { customShadows } from './custom-shadows';
// Importing the custom shadows configuration.

// ----------------------------------------------------------------------

export default function ThemeProvider({ children }) {
  // ThemeProvider component which wraps its children with the Material-UI ThemeProvider.

  const memoizedValue = useMemo(
    // Using useMemo to memoize the theme configuration object.
    () => ({
      palette: palette(),
      typography,
      shadows: shadows(),
      customShadows: customShadows(),
      shape: { borderRadius: 8 },
      // Custom shape configuration with a border radius of 8.
    }),
    []
    // Empty dependency array means this memoized value will only be recomputed when the component is mounted.
  );

  const theme = createTheme(memoizedValue);
  // Creating a theme using the memoized configuration object.

  theme.components = overrides(theme);
  // Adding component-specific overrides to the theme.

  return (
    <MUIThemeProvider theme={theme}>
      {/* Wrapping children with the Material-UI ThemeProvider, passing the created theme */}
      <CssBaseline />
      {/* Adding CssBaseline to apply a consistent baseline for the app */}
      {children}
    </MUIThemeProvider>
  );
}

ThemeProvider.propTypes = {
  // Type checking for the ThemeProvider component props.
  children: PropTypes.node,
  // Ensuring that children is of type node (anything that can be rendered: numbers, strings, elements, arrays, or fragments).
};
