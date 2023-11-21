import { Helmet } from 'react-helmet-async';
import { TraderView } from 'src/sections/traders';

// ----------------------------------------------------------------------

export default function TraderPage() {
  return (
    <>
      <Helmet>
        <title> Traders | Sutra </title>
      </Helmet>
      <TraderView />
    </>
  );
}
