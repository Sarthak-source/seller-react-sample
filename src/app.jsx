/* eslint-disable perfectionist/sort-imports */
import { ToastContainer } from 'react-toastify';
import 'src/global.css';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

// Importing from `../utils/api-constants` should come after the imports from `src/routes/sections` and `src/theme`
import Router from 'src/routes/sections';
import ThemeProvider from 'src/theme';
import { ApiAppConstants } from './app-utils/api-constants';
import NetworkAxios from './app-utils/network_axios';

// ... rest of the code ...

// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();

  NetworkAxios.setDynamicHeader(ApiAppConstants.apiEndPoint);

  return (
    <ThemeProvider>
      <Router />
      <ToastContainer />
    </ThemeProvider>
  );
}
