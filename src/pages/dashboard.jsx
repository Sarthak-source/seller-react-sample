import { Helmet } from 'react-helmet-async';

import { DashboardView } from 'src/sections/dashboard';

// ----------------------------------------------------------------------

export default function DashboardPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard | Sutra </title>
      </Helmet>
      <DashboardView />
    </>
  );
}
