import PropTypes from 'prop-types';
import { useState } from 'react';

import { useTheme } from '@emotion/react';
import { Avatar, Box, Stack, TextField, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { useNavigate } from 'react-router-dom';
import { ApiAppConstants, ip } from 'src/app-utils/api-constants';
import NetworkRepository from 'src/app-utils/network_repository';
import Iconify from 'src/components/iconify';
import { useDispatchTableFuctions } from './use-dispatch-table-fuctions';

export default function DispatchTableRow({
    type,
    orderNo,
    invoiceNo,
    lrNum,
    lrId,
    millName,
    name,
    date,
    vehicleNumber,
    quantity,
    billedTo,
    shipTo,
    rate,
    grade,

}) {
    const [open, setOpen] = useState(null);
    const navigate = useNavigate();
    const theme = useTheme();


    const handleOpenMenu = (event) => {
        setOpen(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setOpen(null);
    };

    const [expanded, setExpanded] = useState(false);

    const handleToggle = (val) => {
        setExpanded(val);
    };

    const handleOpenDetails = (orderSelected) => {
        navigate(`/home/loading-instruction-details/${orderSelected}`); // Use navigate to go to the details page
    };

    const [isEditing, setIsEditing] = useState(false);
    const [editedLrNum, setEditedLrNum] = useState(lrNum);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
          await NetworkRepository.lrUpdate(lrId, editedLrNum);
          setIsEditing(false);
        } catch (error) {
          console.error('An error occurred while saving:', error);
          alert('Error occurred while saving. Please try again.');
        } finally{
            setEditedLrNum(editedLrNum)
        }
      };
      

    const handleCancel = () => {
        // Cancel editing, reset the editedLrNum to the original lrNum
        setEditedLrNum(lrNum);
        setIsEditing(false);
    };

    const { handlePrint } = useDispatchTableFuctions();
    const pdfUrl = `http://${ip}/${ApiAppConstants.getInvoiceDoc}${orderNo}`;

    console.log('lrId', lrId)

    return (
        <>
            <TableRow
                onMouseEnter={() => handleToggle(true)}
                onMouseLeave={() => handleToggle(false)}

                hover tabIndex={-1} role="checkbox">
                <TableCell
                    onClick={() => handleOpenDetails(orderNo)}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.borderRadius = '8px';
                        e.currentTarget.style.boxShadow = '5px 5px 10px rgba(77, 182, 172,0.9)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = 'none';
                    }}
                >{orderNo}</TableCell>
                <TableCell>
                    {isEditing ? (
                        <Stack direction="row" alignItems="center">
                            <TextField
                                value={editedLrNum}
                                style={{ width: `calc(${editedLrNum.length}ch + 30px)`, boxSizing: 'border-box' }}
                                onChange={(e) => setEditedLrNum(e.target.value)}
                            />
                            <IconButton onClick={handleSave} >
                                <Iconify icon="lets-icons:check-fill" color="primary.main" sx={{width:25,height:25}}/>
                            </IconButton>
                            <IconButton onClick={handleCancel}>
                                <Iconify icon="basil:cancel-outline" color="error.main" sx={{width:25,height:25, ml:-1}}/>
                            </IconButton>
                        </Stack>
                    ) : (
                        <Stack direction="row" alignItems="center">
                            {editedLrNum}
                            <IconButton onClick={handleEdit} >
                                <Iconify  icon="basil:edit-outline" color="primary.main"/>
                            </IconButton>
                        </Stack>
                    )}
                </TableCell>
                {type === 'invoice' && (<TableCell>{invoiceNo}</TableCell>)}
                <TableCell component="th" scope="row" padding="normal" >
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar alt={millName} src='avatarUrl' />
                        <Typography variant="subtitle2" noWrap>
                            {millName}
                        </Typography>
                    </Stack>
                </TableCell>
                <TableCell>{name}</TableCell>
                <TableCell>{date}</TableCell>
                <TableCell>{vehicleNumber}</TableCell>
                <TableCell>{quantity}</TableCell>
                <TableCell >
                    {expanded ? (
                        <Box >
                            {billedTo}
                        </Box>
                    ) : (
                        <Box style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '140px' }}>
                            {billedTo}
                        </Box>
                    )}
                </TableCell>

                <TableCell >
                    {expanded ? (
                        <Box>
                            {shipTo}
                        </Box>
                    ) : (
                        <Box style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '140px' }}>
                            {shipTo}
                        </Box>
                    )}
                </TableCell>


                <TableCell>{rate}</TableCell>
                <TableCell>{grade}</TableCell>
                <TableCell align="right">
                    <IconButton onClick={handleOpenMenu}>
                        <Iconify icon="eva:more-vertical-fill" />
                    </IconButton>
                </TableCell>
            </TableRow>
            <Popover
                open={!!open}
                anchorEl={open}
                onClose={handleCloseMenu}
                anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                    sx: { width: 140 },
                }}
            >
                <MenuItem onClick={() => handlePrint(pdfUrl)}>
                    <Iconify icon="lets-icons:print" sx={{ mr: 2 }} />
                    Print
                </MenuItem>

                <MenuItem onClick={handleCloseMenu} sx={{ color: 'error.main' }}>
                    <Iconify icon="fluent:calendar-cancel-24-regular" sx={{ mr: 2 }} />
                    Cancel
                </MenuItem>
            </Popover>
        </>
    );
}

DispatchTableRow.propTypes = {
    type: PropTypes.string,
    orderNo: PropTypes.string,
    lrNum: PropTypes.string,
    lrId: PropTypes.string,
    invoiceNo: PropTypes.string,
    millName: PropTypes.string,
    name: PropTypes.string,
    date: PropTypes.string,
    vehicleNumber: PropTypes.string,
    quantity: PropTypes.string,
    billedTo: PropTypes.string,
    shipTo: PropTypes.string,
    rate: PropTypes.string,
    grade: PropTypes.string,
};
