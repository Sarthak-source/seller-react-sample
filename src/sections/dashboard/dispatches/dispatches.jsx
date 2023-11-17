
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';
import { useMemo, useState } from 'react';
import DeliveryOrderCard from './dispatches-table-card/delivery-order-card';
import LoadingsInstructionCard from './dispatches-table-card/loading-instruction-card';

import InoviceCard from './dispatches-table-card/invoice-card';


export default function DispatchesView() {
    const [activeStep, setActiveStep] = useState(0);
    const steps = useMemo(() => ['Arriving', 'At Plant', 'DO Issued', 'Loaded', 'Reported', 'Unloaded'], []);

    const handleStepClick = async (index) => {
        setActiveStep(index);
    };

    return (
        <>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                <Typography variant="h4">Dispatches</Typography>

            </Stack>
            <Box sx={{ width: 1, transform: 'scale(0.85)' }}>
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