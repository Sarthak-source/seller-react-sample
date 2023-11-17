import { Box, Button, TextField, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import NetworkRepository from 'src/app-utils/network_repository';
import Logo from 'src/components/logo';
import { useRouter } from 'src/routes/hooks';
import { bgGradient } from 'src/theme/css';

export default function SignUp() {
  const theme = useTheme();
  const router = useRouter();
  const [isReview, setIsReview] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setNumber] = useState('');
  const [millName, setMillName] = useState('');

  const handleFirstNameChange = (event) => {
    setFirstName(event.target.value);
  };

  const handleLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const handleNumberChange = (event) => {
    setNumber(event.target.value);
  };

  const handleMillNameChange = (event) => {
    setMillName(event.target.value);
  };

  const handleSubmit = async () => {
    try {
      if (firstName.trim() === '' || phoneNumber.trim() === '' || millName.trim() === '') {
        alert('Please enter all required fields.');
        return;
      }

      await NetworkRepository.userSignup({
        name: `${firstName} ${lastName}`,
        number: phoneNumber,
        password: 'password', // Assuming a default password
      });

      setIsReview(true);
      alert('Details Submitted');
    } catch (error) {
      console.error(error);
      alert('Error submitting details');
    }
  };

  return (
    <Box
      sx={{
        ...bgGradient({
          color: theme.palette.background.default,
          imgUrl: '/assets/background/overlay_4.jpg',
        }),
        height: '100vh',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Logo sx={{ position: 'fixed', top: '16px', left: '16px' }} />

      <Box
        sx={{
          p: 5,
          width: '100%',
          maxWidth: '420px',
          backgroundColor: 'background.paper',
          borderRadius: '8px',
          boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
        }}
      >
        <Typography variant="h4">Sign up to Sutra</Typography>
        {isReview ? (
          <Box sx={{ mt: 5 }}>
            <Typography variant="body2">
              Your Account is Under Review. GFG Will Contact You Shortly.
            </Typography>
          </Box>
        ) : (
          <>
            <TextField
              label="First Name"
              value={firstName}
              onChange={handleFirstNameChange}
              fullWidth
              variant="outlined"
              sx={{ mt: 3 }}
            />
            <TextField
              label="Last Name (Optional)"
              value={lastName}
              onChange={handleLastNameChange}
              fullWidth
              variant="outlined"
              sx={{ mt: 2 }}
            />
            <TextField
              label="Phone Number"
              value={phoneNumber}
              onChange={handleNumberChange}
              fullWidth
              variant="outlined"
              sx={{ mt: 2 }}
            />
            <TextField
              label="Mill Name"
              value={millName}
              onChange={handleMillNameChange}
              fullWidth
              variant="outlined"
              sx={{ mt: 2 }}
            />
          </>
        )}
        <Button
          onClick={handleSubmit}
          fullWidth
          variant="contained"
          size="large"
          sx={{ mt: 4 }}
        >
          Register
        </Button>
      </Box>
    </Box>
  );
}
