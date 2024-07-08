/* eslint-disable perfectionist/sort-imports */
// Disabling specific ESLint rule for sorting imports.

import { Provider } from 'react-redux';
// Provider component to make the Redux store available to the app.

import { ToastContainer } from 'react-toastify';
// ToastContainer component to display toast notifications.

import 'src/global.css';
// Importing global CSS styles.

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';
// Custom hook to scroll to the top of the page.

import { useEffect } from 'react';
// React hook to perform side effects in functional components.

import Router from 'src/routes/sections';
// Component that handles the application's routing.

import ThemeProvider from 'src/theme';
// Component to provide theme to the application.

import NetworkAxiosOptions from './app-utils/network_axios';
// Utility to configure Axios network options.

import store from './redux/configure-store';
// Redux store configuration.

// ----------------------------------------------------------------------

export default function App() {
  // Main component of the application.

  useScrollToTop();
  // Using custom hook to scroll to the top of the page.

  useEffect(() => {
    // Hook to perform side effects after component mount.

    const initializeAsync = async () => {
      // Asynchronous function to initialize Axios options.

      try {
        await NetworkAxiosOptions.setDynamicHeader();
        // Setting dynamic headers for Axios.

        console.log('Axios options initialized successfully');
        // Logging success message.
      } catch (error) {
        console.error('Error initializing Axios options:', error);
        // Handling and logging error if initialization fails.
      }
    };

    initializeAsync();
    // Calling the async initialization function.
  }, []);
  // Empty dependency array ensures this runs once after component mount.

  return (
    // JSX to render the component tree.
    <Provider store={store}>
      {/* Provider to make the Redux store available to the application. */}
      <ThemeProvider>
        {/* ThemeProvider to apply the theme to the application. */}
        <Router />
        {/* Router component to handle application routing. */}
        <ToastContainer />
        {/* ToastContainer to display toast notifications. */}
      </ThemeProvider>
    </Provider>
  );
}
