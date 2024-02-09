import { Stack, TextField } from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NetworkRepository from 'src/app-utils/network_repository';
import { selectTempUser, selectUser } from 'src/redux/actions/user-actions';
import { useRouter } from 'src/routes/hooks';


export default function OTPComponent({ phoneNumber, usedIn, resultSet }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const selectedTempUser = useSelector((state) => state.user.selectedTempUser);

  const [otp, setOtp] = useState(['', '', '', '']);

  const handleChange = (event, index) => {
    const updatedOtp = [...otp];
    updatedOtp[index] = event.target.value;

    if (event.target.value === '' && event.nativeEvent.inputType === 'deleteContentBackward' && index > 0) {
      document.getElementsByName(`otp-${index - 1}`)[0].focus();
    }
    if (index < otp.length - 1 && event.target.value !== '') {
      document.getElementsByName(`otp-${index + 1}`)[0].focus();
    }

    setOtp(updatedOtp);
  };


  useEffect(() => {
    const concatenatedOtp = otp.join('');
    const verifyLoginAsync = async (otpArg) => {
      try {
        console.log('concatenatedOtp', concatenatedOtp);
        console.log('phoneNumber', phoneNumber);

        if (usedIn === 'qc') {
          resultSet(concatenatedOtp)
        } else {
          const result = await NetworkRepository.verifyLogin(phoneNumber, otpArg);
          console.log('Result:', result.type);
          if (result.type === 'success' && usedIn === 'LogIn') {
            dispatch(selectUser(selectedTempUser))
            dispatch(selectTempUser(null))
            router.replace('/home');
          } else if (usedIn === 'InvoiceEwaybillSetting') {
            resultSet(result.type)
          }

          else {
            alert('Wrong OTP');
          }
        }
      } catch (error) {
        console.error('Error in verifyLoginAsync:', error);
      }
    };

    if (concatenatedOtp.length === 4) {
      verifyLoginAsync(concatenatedOtp);
    }
  }, [otp, router, phoneNumber, dispatch, selectedTempUser, usedIn, resultSet]);

  return (
    <Stack spacing='10%' pb={5} pt={5} direction="row">
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
  usedIn: PropTypes.string,
  resultSet: PropTypes.func,
}
