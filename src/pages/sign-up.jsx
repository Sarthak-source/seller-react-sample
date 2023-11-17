import { Helmet } from 'react-helmet-async';

import { SignUp } from 'src/sections/sign-up';

// ----------------------------------------------------------------------

export default function SignUpPage() {
  return (
    <>
      <Helmet>
        <title> Sign up | Sutra </title>
      </Helmet>
      <SignUp />
    </>
  );
}
