import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { alpha, useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import NetworkRepository from 'src/app-utils/network_repository';
import Logo from 'src/components/logo';
import { bgGradient } from 'src/theme/css';
import OTPComponent from './component/otp-component';

export default function LoginView() {
  const theme = useTheme();
  const [showOpt, setShowOtp] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');

  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value);
  };

  const sendOTP = async () => {
    try {
      if (phoneNumber.trim() === '' || phoneNumber.length < 10) {
        alert('Please enter a valid phone number.');
        return;
      }
      await NetworkRepository.userLogin(phoneNumber);
      setShowOtp(false);
    } catch (error) {
      alert(error.toString());
    }
  };

  const renderForm = (
    <>
      <Stack spacing={3} pb={1} pt={1}>
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
          <OTPComponent phoneNumber={phoneNumber} />}
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
              Get started
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
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4">Sign in to Sutra</Typography>
          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
