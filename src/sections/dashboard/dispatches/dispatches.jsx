
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import { useMemo, useState } from 'react';
import Iconify from 'src/components/iconify';
import { useRouter } from 'src/routes/hooks';
import DeliveryOrderCard from './dispatches-table-card/delivery-order-card';
import InoviceCard from './dispatches-table-card/invoice-card';
import LoadingsInstructionCard from './dispatches-table-card/loading-instruction-card';

export default function DispatchesView() {
    const router = useRouter();
    const [activeStep, setActiveStep] = useState(0);
    const steps = useMemo(() => ['Arriving', 'At Plant', 'DO Issued', 'Loaded', 'Reported', 'Unloaded'], []);
    const [transformValue, setTransformValue] = useState('scale(0.85)');
    const [isMouseOver, setIsMouseOver] = useState(true);

    const handleStepSize = (isOver) => {
        setIsMouseOver(isOver);
        setTransformValue(!isMouseOver ? 'scale(0.85)' : 'scale(0.75)');
    };

    const handleStepClick = async (index) => {
        setActiveStep(index);
    };

    const handleOpenInternal = () => {
        router.replace('/home/tender-create');
    };

    return (
        <>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4">Dispatches</Typography>
                {activeStep === 2 && <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenInternal}>
                    Add Internal Do
                </Button>}
            </Stack>
            <Box
                onMouseEnter={() => handleStepSize(true)}
                onMouseLeave={() => handleStepSize(false)}
                sx={{ width: 1, transform: transformValue }}>
                <Stepper activeStep={activeStep} alternativeLabel style={{ marginBottom: '3%' }}>
                    {steps.map((label, index) => (
                        <Step key={`${label}${index}`}>
                            <StepLabel
                                onClick={() => handleStepClick(index)}
                            >
                                <Box sx={{ width: 1, transform: 'scale(0.85)' }}>{label}</Box>

                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>
            {activeStep === 0 && <LoadingsInstructionCard status='Requested' />}
            {activeStep === 1 && <LoadingsInstructionCard status='Booked' />}
            {activeStep === 2 && <DeliveryOrderCard />}
            {activeStep === 3 && <InoviceCard status='Issued' />}
            {activeStep === 4 && <InoviceCard status='Reported' />}
            {activeStep === 5 && <InoviceCard status='Unload' />}

        </>
    );
}