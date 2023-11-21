import { Helmet } from 'react-helmet-async';
import ProfileView from 'src/sections/profile/profile-view';

// ----------------------------------------------------------------------

export default function ProfilePage() {
  return (
    <>
      <Helmet>
        <title> Profile | Sutra </title>
      </Helmet>
      <ProfileView />
    </>
  );
}