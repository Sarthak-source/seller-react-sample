import { LoadingButton } from '@mui/lab';
import { Box, Checkbox, Dialog, DialogContent, DialogTitle, FormControlLabel, MenuItem, Select, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import NetworkRepository from 'src/app-utils/network_repository';
import OTPComponent from 'src/sections/login/component/otp-component';

export default function InvoiceEwaybillSetting({ orderSummary }) {

  const [selectedCopies, setSelectedCopies] = useState('1');
  const [checkboxData, setCheckboxData] = useState([]);
  const selectedUserConfig = useSelector((state) => state.user.selectUserConfig);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedSupplyType, setSelectedSupplyType] = useState('');
  const [selectedSubType, setSelectedSubType] = useState('');
  const [selectedDocumentType, setSelectedDocumentType] = useState('');
  const [selectedTransactionType, setSelectedTransactionType] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [boe, setBoe] = useState('');
  const initialCheckboxValues = Array.from({ length: selectedUserConfig.documents.length }, () => false);
  const [checkboxValues, setCheckboxValues] = useState(initialCheckboxValues);

  const checkboxLabels = useMemo(() =>
    selectedUserConfig.documents.map((document) => document.name) || [],
    [selectedUserConfig.documents]);

  const matchingMill = selectedUserConfig.seller.mills.find((mill) => mill.id === orderSummary.order.tender_head.mill.id);
  const millNumber = matchingMill ? matchingMill.phone_number : null;

  console.log('millNumber', millNumber)

  const orderDocument = orderSummary.order.document;

  console.log('orderDocument', orderDocument, checkboxValues)


  useEffect(() => {
    if (orderDocument && orderDocument.length > 0) {


      if (orderSummary.order.supply_type) {
        setSelectedSupplyType(orderSummary.order.supply_type);
      }

      if (orderSummary.order.sub_supply_type) {
        console.log('orderSummary.order.sub_supply_type', orderSummary.order.sub_supply_type)
        setSelectedSubType(orderSummary.order.sub_supply_type);
      }

      if (orderSummary.order.document_type) {
        setSelectedDocumentType(orderSummary.order.document_type);
      }

      if (orderSummary.order.transaction_type) {
        setSelectedTransactionType(orderSummary.order.transaction_type);
      }
     

      if (orderSummary.order.document) {
        setCheckboxData(orderSummary.order.document.map(doc => doc.id));
      }
    }
  }, [
    orderDocument,
    
    orderSummary.order.supply_type,
    orderSummary.order.sub_supply_type,
    orderSummary.order.document_type,
    orderSummary.order.document,
    orderSummary.order.transaction_type,])

  useEffect(() => {
    if (orderDocument && orderDocument.length > 0) {
      console.log('orderDocument.length', orderDocument)
      orderDocument.forEach((orderDoc) => {
        try {
          const id = orderDoc.id;
          const name = orderDoc.name;
          try {
            if (id >= 1 && id <= checkboxValues.length) {
              if (checkboxLabels.includes(name)) {
                setCheckboxValues(prevValues => [
                  ...prevValues.slice(0, id - 1),
                  true,
                  ...prevValues.slice(id)
                ]);
              }
            }
          } catch (error) {
            console.error(`An error occurred while updating checkboxValues for id ${id}:`, error.message);
          }
        } catch (error) {
          console.error('An error occurred:', error.message);
        }
        console.log('orderDoc', orderDoc);
      });
    }
  },
    [
      orderDocument,
      checkboxLabels,
      checkboxValues.length,
    ]);




  const handleCheckboxChange = (index) => {
    const newCheckboxValues = [...checkboxValues];
    newCheckboxValues[index] = !newCheckboxValues[index];
    setCheckboxValues(newCheckboxValues);

    console.log(checkboxValues)

    const id = index + 1;
    const newData = newCheckboxValues[index] ? [...checkboxData, id] : checkboxData.filter((dataId) => dataId !== id);
    console.log(checkboxData)
    setCheckboxData(newData);
  };


  const supplyTypes = useMemo(() => ({
    "I": selectedUserConfig.suply_type.I.toString(),
    "O": selectedUserConfig.suply_type.O.toString(),
  }), [selectedUserConfig.suply_type.I, selectedUserConfig.suply_type.O]);


  const submit = async () => {
    setLoading(true);
    setDialogOpen(true)

    try {
      await NetworkRepository.userLogin(millNumber);


    } catch (error) {
      // Handle any errors that occurred during the verification process
      console.error('Error during login verification:', error.message);
    } finally {
      // Set loading to false regardless of success or failure
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('verifyAndUpdate', result)

    function getKeyByValue(object, value) {

      return Object.keys(object).find(key => object[key] === value) === null ?
        value :
        Object.keys(object).find(key => object[key] === value);
    }


    const verifyAndUpdate = async () => {
      console.log('Closing dialog...', boe,
        checkboxData,
        getKeyByValue(selectedUserConfig.suply_type, selectedSupplyType),
        getKeyByValue(selectedUserConfig.sub_suply_type, selectedSubType),
        getKeyByValue(selectedUserConfig.document_type, selectedDocumentType));


      if (result === 'success') {
        const data = await NetworkRepository.eoiSetting2(
          orderSummary.order.id,
          boe,
          checkboxData,
          getKeyByValue(selectedUserConfig.suply_type, selectedSupplyType),
          getKeyByValue(selectedUserConfig.sub_suply_type, selectedSubType),
          getKeyByValue(selectedUserConfig.document_type, selectedDocumentType)
        )
        setDialogOpen(false);
        setResult('')
        console.log('breaking', data);
      }
    };

    verifyAndUpdate()
  }, [
    result,
    orderSummary.order.id,
    boe,
    checkboxData,
    selectedSupplyType,
    selectedSubType,
    selectedDocumentType,
    selectedUserConfig.suply_type,
    selectedUserConfig.sub_suply_type,
    selectedUserConfig.document_type
  ])



  return (
    <Box display="flex" flexDirection="column" alignItems="center" width="400px">
      <Typography variant='subtitle2' sx={{ mb: 2 }}>E-waybill settings</Typography>
      <Box sx={{ width: '100%' }}>
        <Select
          value={selectedSupplyType}
          onChange={(e) => setSelectedSupplyType(e.target.value)}
          sx={{ width: '100%', mb: 2 }}
          size='small'
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
        >
          <MenuItem value={selectedSupplyType} disabled>
            {selectedSupplyType.length === 0 ? 'Supply Type' : supplyTypes[selectedSupplyType]}

          </MenuItem>
          {selectedUserConfig && selectedUserConfig.suply_type && Object.values(selectedUserConfig.suply_type).map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
        <Select
          value={selectedSubType}
          onChange={(e) => setSelectedSubType(e.target.value)}
          sx={{ width: '100%', mb: 2 }}
          size='small'
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
        >
          <MenuItem value={selectedSubType} disabled>

            {selectedSubType.length === 0 ? 'Sub Type' : selectedUserConfig.sub_suply_type[selectedSubType]}

          </MenuItem>
          {selectedUserConfig && selectedUserConfig.sub_suply_type && Object.values(selectedUserConfig.sub_suply_type).map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
        <Select
          value={selectedDocumentType}
          onChange={(e) => setSelectedDocumentType(e.target.value)}
          sx={{ width: '100%', mb: 2 }}
          size='small'
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
        >
          <MenuItem value={selectedDocumentType} disabled>
            {selectedDocumentType.length === 0 ? 'Document Type' : selectedUserConfig.document_type[selectedDocumentType]}


          </MenuItem>
          {selectedUserConfig && selectedUserConfig.document_type && Object.values(selectedUserConfig.document_type).map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
        <Select
          value={selectedTransactionType}
          onChange={(e) => setSelectedTransactionType(e.target.value)}
          sx={{ width: '100%', mb: 2 }}
          size='small'
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
        >
          <MenuItem value={selectedTransactionType} disabled>
            {selectedTransactionType.length === 0 ? 'Transaction Type' : selectedUserConfig.transaction_type[selectedTransactionType]}


          </MenuItem>
          {selectedUserConfig && selectedUserConfig.transaction_type && Object.values(selectedUserConfig.transaction_type).map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>

      </Box>

      <Typography variant='subtitle2' sx={{ mb: 2 }}>Invoice setting</Typography>

      <Box display="flex" flexDirection="row" justifyContent="flex-start" alignItems="start" sx={{ flexWrap: 'wrap', mb: 2 }}>
        {checkboxLabels.map((label, index) => (
          <FormControlLabel
            key={index}
            control={
              <Stack direction="row" alignItems="center">
                <Checkbox
                  checked={checkboxValues[index]}
                  onChange={() => handleCheckboxChange(index)}
                />
                <Typography variant='subtitle3' style={{ fontSize: '12px' }}>{label}</Typography>
              </Stack>
            }
          />
        ))}
      </Box>
      <LoadingButton loading={loading} fullWidth variant="contained" color="primary" onClick={submit}>
        Submit
      </LoadingButton>
      <Dialog open={isDialogOpen} onClose={() => setDialogOpen(false)} sx={{ width: 460, margin: 'auto' }}>
        <DialogTitle>Verify OTP</DialogTitle>
        <DialogContent>
          <Stack paddingX={1}>
            <Typography> OTP has been sent to {'*'.repeat(millNumber.length - 4) + millNumber.slice(-4)}</Typography>
            <OTPComponent phoneNumber={millNumber} usedIn='InvoiceEwaybillSetting' resultSet={setResult} />
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

InvoiceEwaybillSetting.propTypes = {
  orderSummary: PropTypes.object, // Adjust the PropTypes accordingly
};
