import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { alpha, useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import NetworkRepository from 'src/app-utils/network_repository';
import Logo from 'src/components/logo';
import { selectTempUser } from 'src/redux/actions/user-actions';
import { useRouter } from 'src/routes/hooks';
import { bgGradient } from 'src/theme/css';
import OTPComponent from './component/otp-component';

export default function LoginView() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const router = useRouter();
  const [loadingOPT, setShowloadingOPT] = useState(false);
  const [showOpt, setShowOtp] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [checked, setChecked] = useState(localStorage.getItem('isTestEnvironment') === 'true');

  console.log(localStorage.getItem('isTestEnvironment'))

  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value);
  };

  const handleChange = () => {
    const newChecked = !checked;
    localStorage.setItem('isTestEnvironment', newChecked.toString());
    setChecked(newChecked);
    window.location.reload();
  };



  const sendOTP = async () => {
    setShowloadingOPT(true);
    try {

      if (phoneNumber.trim() === '' || phoneNumber.length < 10) {
        alert('Please enter a valid phone number.');
        return;
      }
      const seller = await NetworkRepository.checkSeller(phoneNumber);
      console.log('Navigating to /dashboard', seller)
      if (seller === "AxiosError: Request failed with status code 404") {
        router.replace('/sign-up');
        alert('User not found')
      } else {
        dispatch(selectTempUser(seller))
        await NetworkRepository.userLogin(phoneNumber);
        setShowOtp(false);
      }
    } catch (error) {
      alert(error.toString());
    } finally {
      setShowloadingOPT(false);
    }
  }

  const label = checked ? 'Switch to Test' : 'Switch to Prod';


  const renderForm = (
    <>
      <Stack spacing={3} pb={1} mt={-3}>

        {!showOpt &&
          <Typography variant="body2" sx={{ pt: 5 }}>
            OTP has been sent to {phoneNumber}
          </Typography>}
      </Stack>
      <Stack spacing={3} pb={showOpt && 5} pt={showOpt && 5}>
        {showOpt ? <TextField
          name="phone"
          label="Phone number"
          onChange={handlePhoneNumberChange}
          inputProps={{ maxLength: 10 }} /> :
          <OTPComponent phoneNumber={phoneNumber} usedIn='LogIn'/>}
      </Stack>
      {showOpt ? (<Typography variant="body2" sx={{ mb: 5 }}>
        Don’t have an account?
        <RouterLink to="/sign-up" style={{ textDecoration: 'none' }}>  {/* Use RouterLink from react-router-dom */}
          <Link variant="subtitle2" sx={{ ml: 0.5 }}>
            Get started
          </Link>
        </RouterLink>
      </Typography>) : (
        <Typography variant="body2" sx={{ mb: 5 }} >
          OTP sent
          <RouterLink to="/sign-up" style={{ textDecoration: 'none' }}>  {/* Use RouterLink from react-router-dom */}
            <Link variant="subtitle2" sx={{ ml: 0.5 }}>
              Retry
            </Link>
          </RouterLink>
        </Typography>
      )}
      {showOpt && <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        onClick={sendOTP}
        loading={loadingOPT}
      >
        Login
      </LoadingButton>}
    </>
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: 1,
      }}
    >
      <Logo
        sx={{
          position: 'fixed',
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
        }}
      />

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            pr: 5,
            pl: 5,
            pb: 14,
            pt: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Box
            sx={{
              ...bgGradient({
                color: alpha(theme.palette.background.default, 0),
                imgUrl: '/assets/logo-full.png',
              }),
              height: 0.3,
              transform: 'scale(80%) translateX(-45px)',
            }}
          />
          <Typography variant="h5" mt={1}>Sign in to Sutra</Typography>
          {renderForm}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: '16px' }}>
            <FormControlLabel
              control={
                <Switch checked={checked} onChange={handleChange} />}
              label={label}
              labelPlacement="end" // Align label to the right of the switch
            />
          </Box>

        </Card>
      </Stack>
    </Box>
  );
}
