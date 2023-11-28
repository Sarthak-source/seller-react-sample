import { Helmet } from 'react-helmet-async';
import ReportView from 'src/sections/reports/report-view';

// ----------------------------------------------------------------------

export default function ReportPage() {
  return (
    <>
      <Helmet>
        <title> Reports | Sutra </title>
      </Helmet>
      <ReportView />
    </>
  );
}