import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';

import App from './app';

// ----------------------------------------------------------------------

// Create a root for rendering the React component tree into the DOM.
// The 'root' is a container for the React application.
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the React application into the 'root' container.
root.render(
  // HelmetProvider is used to manage the document head, providing a declarative way to update meta tags, titles, and other head elements.
  <HelmetProvider>
    {/* BrowserRouter is used to handle routing in the React application. It enables client-side routing, allowing navigation between different views or pages. */}
    <BrowserRouter>
      {/* Suspense is used to wrap lazy-loaded components, providing a fallback UI (like a loading spinner) while the components are being loaded. */}
      <Suspense>
        {/* The App component is the root component of the application, which will contain all other components and logic. */}
        <App />
      </Suspense>
    </BrowserRouter>
  </HelmetProvider>
);
