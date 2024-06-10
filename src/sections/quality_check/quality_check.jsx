import { Box, Button, Card, Dialog, Stack, Step, StepLabel, Stepper, TextField } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import NetworkRepository from 'src/app-utils/network_repository';
import { QontoConnector } from '../dashboard/stepper-line';
import OTPComponent from '../login/component/otp-component';

const QualityCheck = () => {
    const [vehicleNumberController, setVehicleNumberController] = useState('');
    const [driverNumberController, setDriverNumberController] = useState('');
    const [diverNameController, setDiverNameController] = useState('');
    const [licensceController, setLicensceController] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [activeStep, setActiveStep] = useState(0);
    const fileInputRef = useRef(null); // Create a ref for the file input element



    const [otp, setOtp] = useState('');

    const [openFront, setFront] = useState();
    const [openBack, setBack] = useState();

    const [openImage, setImageDialog] = useState(false);

    const videoRefFrontImage = useRef();
    const videoRefBackImage = useRef();

    const [streamDLFrontImage, setStreamDLFrontImage] = useState(null);
    const [streamDLBackImage, setStreamDLBackImage] = useState(null);

    const [capturedDLFrontImage, setCapturedDLFrontImage] = useState(null);
    const [capturedDLBackImage, setCapturedDLBackImage] = useState(null);


    const steps = ['Vehicle details', 'Driver details', 'Vehicle image'];

    const [vehicleCheck, setVehicleCheck] = useState([])


    const [driverDetails, setDriverDetails] = useState();
    const selectedUser = useSelector((state) => state.user.selectedUser);

    const handleDialogClose = () => {
        setFront(false)
        setBack(false)
        setImageDialog(false)
    }

    const streamVideo = async (open, setUrl, setStream, videoRef) => {
        try {
            open(true)
            setUrl(null);
            console.log('Trying to access camera...');
            const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
            console.log('Camera access granted.');

            videoRef.current.srcObject = videoStream;

            setStream(videoStream);

            // Set the video source
        } catch (error) {
            console.error('Error capturing image:', error);
        }
    };

    const captureImage = async (open, setUrl, setStream, videoRef) => {
        try {
            videoRef.current.addEventListener('canplay', () => {
                setStream(null);
                const captureCanvas = document.createElement('canvas');

                // Check if videoRef.current is not null before accessing its properties
                if (videoRef.current) {
                    captureCanvas.width = videoRef.current.videoWidth || 640;
                    captureCanvas.height = videoRef.current.videoHeight || 480;

                    const captureContext = captureCanvas.getContext('2d');
                    captureContext.drawImage(videoRef.current, 0, 0);

                    const dataUrl = captureCanvas.toDataURL('image/jpeg');
                    setUrl(dataUrl);

                    // Stop the video stream after capturing the image
                    setStream((prevStream) => {
                        if (prevStream) {
                            const tracks = prevStream.getTracks();
                            if (tracks) {
                                tracks.forEach((track) => track.stop());
                            }
                        }
                        return null;
                    });
                }
            });

            streamVideo(open, setUrl, setStream, videoRef);
            open(false)
        } catch (error) {
            console.error('Error capturing image:', error);
        }
    };


    const handleNext = async () => {
        if (activeStep === 0) {

            if (vehicleCheck.some(vehicle => vehicle.vehicle_num__vehicle_num.includes(vehicleNumberController))) {
                if (driverNumberController.length !== 10 || Number.isNaN(Number(driverNumberController))) {
                    alert("Enter a valid number")
                } else {
                    const sendDriverOtp = await NetworkRepository.sendOtpDriver(driverNumberController, vehicleNumberController, selectedUser.id)
                    console.log('sendDriverOtp', sendDriverOtp)
                    setDriverDetails(sendDriverOtp)
                    setDiverNameController(sendDriverOtp.name)
                    setLicensceController(sendDriverOtp.dl_num)
                    setCapturedDLBackImage(sendDriverOtp.dl_img_backside)
                    setCapturedDLFrontImage(sendDriverOtp.dl_img_frontside)
                    setActiveStep((prev) => prev + 1);
                }

            } else {
                alert("Vehicle doesn't exist, please check")
            }

        } else if (activeStep === 1) {

            console.log('driverDetails', driverDetails.id)

            if (driverDetails.type === 'success') {
                const post = await NetworkRepository.postDriver(
                    otp,
                    diverNameController,
                    driverNumberController,
                    licensceController,
                    '',
                    driverDetails.driver.id,
                    capturedDLFrontImage,
                    capturedDLBackImage)

                console.log('post', post)
            }

            setActiveStep((prev) => prev + 1);
        } else {
            setActiveStep((prev) => prev + 1);
        }

    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await NetworkRepository.vehicleCheck(selectedUser.id);
                setVehicleCheck(data);
                if (data.length === 0) {
                    navigate(`/home`);
                    alert('No vehicles')
                }
            } catch (error) {
                // Handle errors if necessary
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [navigate, selectedUser.id]); // The empty dependency array means this effect runs once after the initial render


    console.log('vehicleCheck', vehicleCheck)
    console.log('otp', otp)
    console.log('otp', otp)
    console.log('dl front', capturedDLFrontImage)


    const imageChoiceDialog = (whichImage, cameraFunction, galleryFunction) => (
        <Dialog open={openImage} onClose={handleDialogClose}>
            <>
                <Button type="button" onClick={() => cameraFunction()}>
                    {whichImage} Image from Camera
                </Button>

                <input
                    type="file"
                    accept="image/jpeg;base64"  // Specify accepted file types (images)
                    onChange={(event) => galleryFunction(event.target.files[0])} // Pass the event and the setSelectedImage function
                    style={{ display: 'none' }} // Hide the input element
                    ref={fileInputRef} // Ref to the input element for programmatically triggering file selection
                />

                <Button type="button" onClick={() => fileInputRef.current.click()}> {/* Use ref to trigger file input click */}
                    {whichImage} Image from Gallery
                </Button>
            </>
        </Dialog>
    );



    const handleGallerySelection = (selectedFile, setImage) => {
        if (selectedFile) {
            const imageUrl = URL.createObjectURL(selectedFile);
            setImage(imageUrl);
            setImageDialog(false); // Close the image selection dialog
        }
    };



    return (
        <Stack alignItems="center" justifyContent="center" sx={{ height: 1, pt: 2 }}>
            <Typography variant="h4" mb="2%">
                Quality check
            </Typography>

            <Card
                onMouseEnter={(e) => {
                    e.currentTarget.style.borderRadius = '8px';
                    e.currentTarget.style.boxShadow = '5px 5px 10px rgba(77, 182, 172,0.9)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.borderRadius = '8px';
                    e.currentTarget.style.boxShadow = '2px 2px 10px rgba(0, 0, 0, 0.2)';
                }}
                sx={{
                    p: 5,
                    width: 1,
                    maxWidth: 600,
                }}
            >
                <Box sx={{ width: 1, transform: 'scale(0.85)' }}>
                    <Stepper activeStep={activeStep} connector={<QontoConnector />} alternativeLabel style={{ marginBottom: '3%' }}>
                        {steps.map((label, index) => (
                            <Step key={`${label}${index}`}>
                                <StepLabel>
                                    <Box sx={{ width: 1, transform: 'scale(0.85)' }}>{label}</Box>
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Box>

                {activeStep === 0 && (
                    <>
                        <TextField
                            name="vehicle"
                            label="Vehicle number"
                            value={vehicleNumberController}
                            onChange={(e) => setVehicleNumberController(e.target.value)}
                            sx={{ mb: 3 }}
                            fullWidth
                        />

                        <TextField
                            name="drivernumber"
                            label="Driver number"
                            value={driverNumberController}
                            onChange={(e) => setDriverNumberController(e.target.value)}
                            sx={{ mb: 2 }}
                            fullWidth
                        />
                    </>
                )}

                {activeStep === 1 && (
                    <>



                        <Box sx={{ width: "70%", alignSelf: 'center', mx: 'auto' }}>
                            <OTPComponent usedIn='qc' resultSet={setOtp} />
                        </Box>
                        <TextField
                            name="vehicle"
                            label="Driver name"
                            value={diverNameController}
                            onChange={(e) => setDiverNameController(e.target.value)}
                            sx={{ mb: 3 }}
                            fullWidth
                        />

                        <TextField
                            name="drivernumber"
                            label="Driver license number"
                            value={licensceController}
                            onChange={(e) => setLicensceController(e.target.value)}
                            sx={{ mb: 2 }}
                            fullWidth
                        />

                        <Stack direction='row' sx={{ justifyContent: 'space-between', mt: 2 }} gap={1}>
                            <Box sx={{ border: '1px solid #d1d1cf', borderRadius: '8px' }}>
                                <Button type="button" onClick={() => setImageDialog(true)}>
                                    Capture DL front Image
                                </Button>
                                {capturedDLFrontImage !== null ? (
                                    <Box>
                                        <Typography sx={{ fontSize: 12, ml: 1, mb: 2 }}>DL front preview:</Typography>
                                        <img src={capturedDLFrontImage} alt="Captured" style={{ maxWidth: '100%', borderRadius: '8px' }} />
                                    </Box>
                                ) : (
                                    <>
                                        <Dialog open={openFront} onClose={handleDialogClose} >
                                            <>
                                                <video ref={videoRefFrontImage} autoPlay playsInline style={{ display: capturedDLFrontImage ? 'none' : 'block', maxWidth: '100%', borderRadius: '8px' }}>
                                                    <track kind="captions" src="" label="" />
                                                </video>
                                                {streamDLFrontImage !== null ? (
                                                    <Button type="button" onClick={() => captureImage(setFront, setCapturedDLFrontImage, setStreamDLFrontImage, videoRefFrontImage)}>
                                                        Click Image
                                                    </Button>
                                                ) : null}
                                            </>
                                        </Dialog>
                                    </>
                                )}
                            </Box>
                            <Box sx={{ border: '1px solid #d1d1cf', borderRadius: '8px' }}>
                                <Button type="button" onClick={() => setImageDialog(true)}>
                                    Capture DL back Image
                                </Button>

                                {capturedDLBackImage !== null ? (
                                    <Box >
                                        <Typography sx={{ fontSize: 12, ml: 1, mb: 2 }}>DL back preview:</Typography>
                                        <img src={capturedDLBackImage} alt="Captured" style={{ maxWidth: '100%', borderRadius: '8px' }} />
                                    </Box>
                                ) : (


                                    <Dialog open={openBack} onClose={handleDialogClose} >
                                        <>
                                            <video ref={videoRefBackImage} autoPlay playsInline style={{ display: capturedDLBackImage ? 'none' : 'block', maxWidth: '100%', borderRadius: '8px' }}>
                                                <track kind="captions" src="" label="" />
                                            </video>
                                            {streamDLBackImage !== null ? (
                                                <Button type="button" onClick={() => captureImage(setBack, setCapturedDLBackImage, setStreamDLBackImage, videoRefBackImage)}>
                                                    Click Image
                                                </Button>
                                            ) : null}

                                        </>

                                    </Dialog>
                                )}
                            </Box>
                        </Stack>


                    </>
                )}

                {activeStep === 2 && (
                    <Stack>

                        <Stack direction='row' sx={{ justifyContent: 'space-between', mt: 2 }} gap={1}>
                            <Box sx={{ border: '1px solid #d1d1cf', borderRadius: '8px' }}>
                                <Button type="button" onClick={() => streamVideo(setFront, setCapturedDLFrontImage, setStreamDLFrontImage, videoRefFrontImage)}>
                                    Capture RC front Image
                                </Button>
                                {capturedDLFrontImage !== null ? (
                                    <Box>
                                        <Typography sx={{ fontSize: 12, ml: 1, mb: 2 }}>DL front preview:</Typography>
                                        <img src={capturedDLFrontImage} alt="Captured" style={{ maxWidth: '100%', borderRadius: '8px' }} />
                                    </Box>
                                ) : (
                                    <>
                                        <Dialog open={openFront} onClose={handleDialogClose} >
                                            <>
                                                <video ref={videoRefFrontImage} autoPlay playsInline style={{ display: capturedDLFrontImage ? 'none' : 'block', maxWidth: '100%', borderRadius: '8px' }}>
                                                    <track kind="captions" src="" label="" />
                                                </video>
                                                {streamDLFrontImage !== null ? (
                                                    <Button type="button" onClick={() => captureImage(setFront, setCapturedDLFrontImage, setStreamDLFrontImage, videoRefFrontImage)}>
                                                        Click Image
                                                    </Button>
                                                ) : null}
                                            </>
                                        </Dialog>
                                    </>
                                )}
                            </Box>
                            <Box sx={{ border: '1px solid #d1d1cf', borderRadius: '8px' }}>
                                <Button type="button" onClick={() => streamVideo(setBack, setCapturedDLBackImage, setStreamDLBackImage, videoRefBackImage)}>
                                    Capture Insurance Image
                                </Button>

                                {capturedDLBackImage !== null ? (
                                    <Box >
                                        <Typography sx={{ fontSize: 12, ml: 1, mb: 2 }}>DL back preview:</Typography>
                                        <img src={capturedDLBackImage} alt="Captured" style={{ maxWidth: '100%', borderRadius: '8px' }} />
                                    </Box>
                                ) : (


                                    <Dialog open={openBack} onClose={handleDialogClose} >
                                        <>
                                            <video ref={videoRefBackImage} autoPlay playsInline style={{ display: capturedDLBackImage ? 'none' : 'block', maxWidth: '100%', borderRadius: '8px' }}>
                                                <track kind="captions" src="" label="" />
                                            </video>
                                            {streamDLBackImage !== null ? (
                                                <Button type="button" onClick={() => captureImage(setBack, setCapturedDLBackImage, setStreamDLBackImage, videoRefBackImage)}>
                                                    Click Image
                                                </Button>
                                            ) : null}
                                        </>
                                    </Dialog>
                                )}
                            </Box>
                        </Stack>
                        <Stack direction='row' sx={{ justifyContent: 'space-between', mt: 2 }} gap={1}>
                            <Box sx={{ border: '1px solid #d1d1cf', borderRadius: '8px' }}>
                                <Button type="button" onClick={() => streamVideo(setFront, setCapturedDLFrontImage, setStreamDLFrontImage, videoRefFrontImage)}>
                                    Capture Driver vehicle
                                </Button>
                                {capturedDLFrontImage !== null ? (
                                    <Box>
                                        <Typography sx={{ fontSize: 12, ml: 1, mb: 2 }}>DL front preview:</Typography>
                                        <img src={capturedDLFrontImage} alt="Captured" style={{ maxWidth: '100%', borderRadius: '8px' }} />
                                    </Box>
                                ) : (
                                    <>
                                        <Dialog open={openFront} onClose={handleDialogClose} >
                                            <>
                                                <video ref={videoRefFrontImage} autoPlay playsInline style={{ display: capturedDLFrontImage ? 'none' : 'block', maxWidth: '100%', borderRadius: '8px' }}>
                                                    <track kind="captions" src="" label="" />
                                                </video>
                                                {streamDLFrontImage !== null ? (
                                                    <Button type="button" onClick={() => captureImage(setFront, setCapturedDLFrontImage, setStreamDLFrontImage, videoRefFrontImage)}>
                                                        Click Image
                                                    </Button>
                                                ) : null}
                                            </>
                                        </Dialog>
                                    </>
                                )}
                            </Box>
                            <Box sx={{ border: '1px solid #d1d1cf', borderRadius: '8px' }}>
                                <Button type="button" onClick={() => streamVideo(setBack, setCapturedDLBackImage, setStreamDLBackImage, videoRefBackImage)}>
                                    Capture vehicle body
                                </Button>

                                {capturedDLBackImage !== null ? (
                                    <Box >
                                        <Typography sx={{ fontSize: 12, ml: 1, mb: 2 }}>DL back preview:</Typography>
                                        <img src={capturedDLBackImage} alt="Captured" style={{ maxWidth: '100%', borderRadius: '8px' }} />
                                    </Box>
                                ) : (

                                    <Dialog open={openBack} onClose={handleDialogClose} >
                                        <>
                                            <video ref={videoRefBackImage} autoPlay playsInline style={{ display: capturedDLBackImage ? 'none' : 'block', maxWidth: '100%', borderRadius: '8px' }}>
                                                <track kind="captions" src="" label="" />
                                            </video>
                                            {streamDLBackImage !== null ? (
                                                <Button type="button" onClick={() => captureImage(setBack, setCapturedDLBackImage, setStreamDLBackImage, videoRefBackImage)}>
                                                    Click Image
                                                </Button>
                                            ) : null}
                                        </>
                                    </Dialog>
                                )}
                            </Box>
                        </Stack>
                    </Stack>

                )}

                {activeStep === steps.length ? (
                    <>
                        <Typography sx={{ mt: 2, mb: 1 }}>All steps completed - you are finished</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                            <Box sx={{ flex: '1 1 auto' }} />
                            <Button onClick={handleReset}>Reset</Button>
                        </Box>
                    </>
                ) : (
                    <Stack sx={{ mt: 2 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                            <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
                                Back
                            </Button>
                            <Box sx={{ flex: '1 1 auto' }} />
                            <Button onClick={handleNext}>{activeStep === steps.length - 1 ? 'Submit' : 'Next'}</Button>
                        </Box>
                    </Stack>
                )}
            </Card>

            {imageChoiceDialog('Capture DL front', () => streamVideo(setFront, setCapturedDLFrontImage, setStreamDLFrontImage, videoRefFrontImage), (selectedImage) => handleGallerySelection(selectedImage, setCapturedDLFrontImage))}
            {imageChoiceDialog('Capture DL back', () => streamVideo(setBack, setCapturedDLBackImage, setStreamDLBackImage, videoRefBackImage), (selectedImage) => handleGallerySelection(selectedImage, setCapturedDLBackImage))}

        </Stack>
    );
};

export default QualityCheck;
