/* eslint-disable perfectionist/sort-imports */
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'src/global.css';
import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

// Importing from `../utils/api-constants` should come after the imports from `src/routes/sections` and `src/theme`
import { useEffect } from 'react';
import Router from 'src/routes/sections';
import ThemeProvider from 'src/theme';
import NetworkAxiosOptions from './app-utils/network_axios';
import store from './redux/configure-store';

// ... rest of the code ...

// ----------------------------------------------------------------------

export default function App()  {
  useScrollToTop();
  useEffect(() => {
    const initializeAsync = async () => {
        try {
            await NetworkAxiosOptions.setDynamicHeader();
            console.log('Axios options initialized successfully');
        } catch (error) {
            console.error('Error initializing Axios options:', error);
            
        }
    };

    initializeAsync();
}, []);

  return (
    <Provider store={store}>
    <ThemeProvider>
      <Router />
      <ToastContainer />
    </ThemeProvider>
    </Provider>
  );
}
