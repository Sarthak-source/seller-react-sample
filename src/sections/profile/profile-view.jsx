import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Card,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    List,
    ListItem,
    Stack,
    TextField,
    Typography
} from '@mui/material';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import Iconify from 'src/components/iconify';


export default function ProfileView() {
    const [open, setOpen] = useState(false);
    const selectedUser = useSelector((state) => state.user.selectedUser);
    const { handleSubmit, control } = useForm();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    function getRoleName(roleIndex) {
        switch (roleIndex) {
            case 1:
                return '-  Authorizer';
            case 2:
                return '-  Inputer';
            case 3:
                return '-  Store House';
            case 4:
                return '-  Quality check';
            default:
                return '-  Destination';
        }
    }

    const onSubmit = (data) => {
        // Handle form submission
    };



    return (
        <Container maxWidth="xl">
            <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
                <Card
                    sx={{
                        p: 5,
                        width: 1,
                        maxWidth: 490,
                    }}
                >
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <Box
                            component="img"
                            src="/assets/logo.png"
                            sx={{ width: 100, height: 100, cursor: 'pointer', borderRadius: 20 }}
                        />
                        <Box>
                            <Typography sx={{ pb: 1, pl: 1, fontWeight: 'bold', fontSize: 20 }}>
                                Details
                            </Typography>
                            <Card sx={{ pt: 2, pr: 2, pl: 2, pb: 2, width: '335px', }}>
                                <Typography sx={{ pt: 1, fontSize: 14, fontWeight: 'bold', }}>
                                    Name
                                </Typography>
                                <TextField
                                    name="name"
                                    label={selectedUser.name}
                                    disabled
                                    fullWidth
                                    sx={{ mt: 1 }}
                                />
                                <Typography sx={{ pt: 2, fontSize: 14, fontWeight: 'bold', }}>
                                    Contact
                                </Typography>
                                <TextField
                                    name="phone"
                                    label={selectedUser.phone_number}
                                    disabled
                                    fullWidth
                                    sx={{ mt: 1 }}
                                />
                                <Typography sx={{ pt: 2, fontSize: 14, fontWeight: 'bold', }}>
                                    GST number
                                </Typography>
                                <TextField
                                    name="gst"
                                    label={selectedUser.mills[0].gstin}
                                    disabled
                                    fullWidth
                                    sx={{ mt: 1, mb: 2 }}
                                />
                            </Card>
                        </Box>
                        <Box marginTop={1}>
                            <Typography sx={{ pt: 1, pb: 1, pl: 1, fontWeight: 'bold', fontSize: 20, }}>
                                Mills
                            </Typography>
                            <List>
                                {selectedUser && selectedUser.mills ? (
                                    selectedUser.mills.map((item, index) => (
                                        <Card key={index} sx={{ width: '335px', mb: 2 }}>
                                            <Box p={2}>
                                                <Box display="flex" flexDirection="column" alignItems="start">
                                                    <Accordion >
                                                        <AccordionSummary
                                                            expandIcon={<Iconify icon="mingcute:down-fill" />}
                                                            aria-controls={`panel-${index}-content`}
                                                            id={`panel-${index}-header`}
                                                        >
                                                            <Typography sx={{ fontWeight: 'bold' }}>{item.name.toString()}</Typography>
                                                        </AccordionSummary>
                                                        <AccordionDetails>
                                                            <Typography >{item.address.toString()}</Typography>
                                                        </AccordionDetails>
                                                    </Accordion>
                                                </Box>
                                            </Box>
                                        </Card>
                                    ))
                                ) : (
                                    <Typography>Loading or no data available</Typography>
                                )}
                            </List>
                        </Box>
                        <Box marginTop={2} marginBottom={2} >
                            <Typography sx={{ pb: 1, pl: 1, fontWeight: 'bold', fontSize: 20, }}>
                                Roles
                            </Typography>
                            <Card sx={{ pr: 18, pl: 2, pt: 2, pb: 2, width: '335px' }} >
                                <List>
                                    {selectedUser && selectedUser.mills ? (selectedUser.seller_role.map((role, roleInd) => (
                                        <Box key={roleInd} sx={{ pb: 2 }}>
                                            <Card sx={{ pl: 1, pr: 4, pb: 2, pt: 2, width: '305px' }}>
                                                <ListItem dense >
                                                    <Typography>
                                                        {getRoleName(role)}
                                                    </Typography>
                                                </ListItem>
                                            </Card>
                                        </Box>
                                    ))) : <Typography>Loading or no data available</Typography>}
                                </List>
                            </Card>
                        </Box>
                        <Stack>
                            <Box flex={1}>
                                <Button
                                    sx={{ color: 'red' }}
                                    onClick={handleClickOpen}
                                >
                                    Delete Account
                                </Button>
                            </Box>
                        </Stack>
                    </Box>
                </Card>
            </Stack>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Delete Account</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete your account? By deleting your account,
                        all your personal data, settings, and content will be permanently removed
                        from our servers.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit(onSubmit)} color="secondary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}
