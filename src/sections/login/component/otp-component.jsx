import { Stack, TextField } from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import NetworkRepository from 'src/app-utils/network_repository';
import { useRouter } from 'src/routes/hooks';



export default function OTPComponent({ phoneNumber }) {
  const router = useRouter();

  const [otp, setOtp] = useState(['', '', '', '']);

  const handleChange = (event, index) => {
    const updatedOtp = [...otp];
    updatedOtp[index] = event.target.value;
    if (index < otp.length - 1 && event.target.value !== '') {
      document.getElementsByName(`otp-${index + 1}`)[0].focus();
    }

    setOtp(updatedOtp);
  };

  useEffect(() => {
    const concatenatedOtp = otp.join('');
    const verifyLoginAsync = async (otpArg) => {    
      try {     
        console.log('concatenatedOtp',concatenatedOtp);
        console.log('phoneNumber',phoneNumber);
        const result = await NetworkRepository.verifyLogin(phoneNumber, otpArg);   
          console.log('Result:', result.type);
        if (result.type === 'success') {
          const seller = await NetworkRepository.checkSeller(phoneNumber);
          console.log('Navigating to /dashboard',seller.detail)
          
          if (seller.detail==='No seller found') {
            router.replace('/sign-up');
            alert(seller)
          }
          
          router.replace('/home');
        } else{
          alert('Wrong OTP');
        }
      } catch (error) {
        console.error('Error in verifyLoginAsync:', error);
      }
    };

    if(concatenatedOtp.length===4){
      verifyLoginAsync(concatenatedOtp); 
    }

   
  }, [otp, router, phoneNumber]);

  return (
    <Stack spacing={5} pb={5} pt={5} direction="row">
      {otp.map((digit, index) => (
        <TextField
          key={index}
          name={`otp-${index}`}
          variant="outlined"
          fullWidth
          value={digit}
          onChange={(event) => handleChange(event, index)}
          inputProps={{ maxLength: 1 }}
        />
      ))}
    </Stack>
  );
}

OTPComponent.propTypes = {
  phoneNumber: PropTypes.string,
}
