import { useTheme } from '@emotion/react';
import { LoadingButton } from '@mui/lab';
import { Box, Card, Container, Dialog, DialogTitle, Paper, Stack, TextField, Toolbar, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { ip } from 'src/app-utils/api-constants';
import NetworkRepository from 'src/app-utils/network_repository';
import HoverExpandButton from 'src/components/buttons/expanded-button';
import Iconify from 'src/components/iconify';
import SkeletonLoader from 'src/layouts/dashboard/common/skeleton-loader';

export default function ScanWithVehicle() {
    const theme = useTheme();
    const [vehicleNumber, setVehicleNumber] = useState('');
    const pdfContainerRef = useRef();
    const isMounted = useRef(true); // Add this line
    const selectedUser = useSelector((state) => state.user.selectedUser);
    const [loading, setLoading] = useState(false);
    const [pdfData, setPdfData] = useState(null);
    const [isDialogOpen, setDialogOpen] = useState(false);


    const handleDialogClose = () => {
        setDialogOpen(false);
        setPdfData(null)
    };

    const handleVehicleNumberChange = (event) => {
        setVehicleNumber(event.target.value);
    };


    const handleSubmit = async () => {
        if (vehicleNumber.length < 4) {
            alert("Vehicle Number is too short");
        } else {
            try {
                setLoading(true)
                // Assuming networkRepository.vehicleDo makes an HTTP request
                const response = await NetworkRepository.vehicleDo(vehicleNumber, selectedUser.id,);
                handlePdf(`http://${ip}/get_doc/thermal_do/${response.id}?flag=1`);
                setDialogOpen(true)
                // Navigate to PDF viewer page passing required props

            } catch (error) {
                console.error("Error:", error);
                alert("Something went wrong, Please try again");
            } finally {
                setLoading(false)
            }
        }
    };

    const pdfPopUp = (dialogOpen) => (

        (
            <Dialog open={dialogOpen} onClose={handleDialogClose} fullWidth
                maxWidth="md"
            >
                <DialogTitle >
                    <Stack sx={{ height: '10px' }} direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                        <Typography variant="h6">View PDF</Typography>
                        <Box display="flex" justifyContent="space-between" sx={{ gap: 1, height: '30px' }} >
                            <HoverExpandButton onClick={handleDialogClose} width='90px' color={theme.palette.error.main}>
                                <Iconify icon="basil:cancel-solid" />
                                <Typography sx={{ fontWeight: 'bold', fontSize: 14 }}>Close</Typography>
                            </HoverExpandButton>
                        </Box>
                    </Stack>
                </DialogTitle>
                <Paper>
                    {pdfData ? <div ref={pdfContainerRef} /> : <SkeletonLoader marginTop='10px' />}
                </Paper>
            </Dialog>
        )
    )



    useEffect(() => {
        const pdfContainer = pdfContainerRef.current;

        if (pdfData && pdfContainer) {
            const dataUrl = URL.createObjectURL(new Blob([pdfData], { type: 'application/pdf' }));

            const pdfEmbed = document.createElement('iframe');
            pdfEmbed.setAttribute('width', '100%');
            pdfEmbed.setAttribute('height', '600px');
            pdfEmbed.setAttribute('type', 'application/pdf');
            pdfEmbed.setAttribute('src', dataUrl);

            pdfContainer.innerHTML = '';
            pdfContainer.appendChild(pdfEmbed);
        }

    }, [pdfData, isMounted]);


    const handlePdf = async (url) => {
        try {
            const apiResponse = await NetworkRepository.getPdf(url);
            if (isMounted.current) {
                setPdfData(apiResponse);
            }
        } catch (error) {
            console.error('Error fetching PDF:', error);
        }
    };

    return (
        <Stack alignItems="center" justifyContent="center" sx={{ height: 1, pt: 2 }}>
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
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Issue DO with Vehicle number
                    </Typography>
                </Toolbar>

                <Container >
                    <TextField
                        label="Vehicle Number"
                        value={vehicleNumber}

                        onChange={handleVehicleNumberChange}
                        fullWidth
                        variant="outlined"
                        margin="normal"
                    />
                    <LoadingButton fullWidth size="large" loading={loading} sx={{ mt: 3 }}
                        variant="contained" onClick={handleSubmit}>Next</LoadingButton>
                </Container>
            </Card>
            {pdfPopUp(isDialogOpen)}
        </Stack>
    );
}

