'use client'
import { useState, useEffect } from "react";
import { firestore } from '@/firebase';
import { Box, Typography, Modal, Stack, TextField, Button, Grid, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { collection, query, getDocs, deleteDoc, doc, setDoc, getDoc } from "firebase/firestore";
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import RemoveCircleRoundedIcon from '@mui/icons-material/RemoveCircleRounded';

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [quantityUnit, setQuantityUnit] = useState('kg');
  const [itemType, setItemType] = useState('');
  const [itemDate, setItemDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [searchText, setSearchText] = useState("");

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const addItem = async () => {
    const docRef = doc(collection(firestore, 'inventory'), itemName);
    const docSnap = await getDoc(docRef);

    const addedDate = itemDate || new Date().toISOString();
    const expDate = expiryDate || '';

    if (docSnap.exists()) {
      const { quantity: existingQuantity, quantityUnit: existingUnit, type: existingType } = docSnap.data();
      await setDoc(docRef, { 
        quantity: existingQuantity + quantity, 
        quantityUnit: quantityUnit || existingUnit,
        addedDate,
        expiryDate: expDate,
        type: itemType || existingType
      }, { merge: true });
    } else {
      await setDoc(docRef, { 
        quantity,
        quantityUnit,
        addedDate,
        expiryDate: expDate,
        type: itemType 
      });
    }
    await updateInventory();
    handleClose();
  };

  const incrementQuantity = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity, quantityUnit } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1, quantityUnit }, { merge: true });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 }, { merge: true });
      }
    }
    await updateInventory();
  };

  const deleteItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    await deleteDoc(docRef);
    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setItemName('');
    setQuantity(1);
    setQuantityUnit('kg');
    setItemType('');
    setItemDate('');
    setExpiryDate('');
    setOpen(false);
  };

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Box 
      width="100vw" 
      height="100vh" 
      display="flex" 
      flexDirection="column"
      justifyContent="center" 
      alignItems="center" 
      gap={1}
      bgcolor="#FAF0E6"
      color="#000080"
      p={2}
    >
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <Typography variant="h2" color="#503C3C" fontFamily="Nanum Myeongjo" fontWeight="800">
          <u>Pantry Tracker!!!</u>
        </Typography>
      </Box>
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width="90%"
          maxWidth="400px"
          bgcolor={"#503C3C"}
          color={"#121212"}
          border={"2px solid #DAC0A3"}
          boxShadow={24}
          p={2}
          display={"flex"}
          flexDirection={"column"}
          gap={2}
          sx={{
            transform: 'translate(-50%, -50%)',
            borderRadius: '8px',
            maxHeight: '90vh', // Set a maximum height for the modal
            overflowY: 'auto', // Enable vertical scrolling
          }}
        >
          <Typography variant="h6" color='#DAC0A3' fontWeight="bold">Add Item</Typography>
          <Typography variant="body2" color='#DAC0A3'>Item Name</Typography>
          <TextField 
            variant="outlined"
            fullWidth
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            sx={{
              bgcolor: '#DAC0A3',
              input: { color: '#121212' },
              '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                borderColor: '#F0ECE5'
              }
            }}
          />
          <Typography variant="body2" color='#DAC0A3'>Quantity</Typography>
          <TextField
            variant="outlined"
            fullWidth
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
            sx={{
              bgcolor: '#DAC0A3',
              input: { color: '#121212' },
              '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                borderColor: '#F0ECE5'
              }
            }}
          />
          <Typography variant="body2" color='#DAC0A3'>Unit</Typography>
          <FormControl fullWidth>
            <InputLabel id="quantity-unit-label" sx={{ fontWeight: 'bold' }}>Unit</InputLabel>
            <Select
              labelId="quantity-unit-label"
              value={quantityUnit}
              onChange={(e) => setQuantityUnit(e.target.value)}
              sx={{
                bgcolor: '#DAC0A3',
                color: '#121212',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#F0ECE5'
                }
              }}
            >
              <MenuItem value="kg">kg</MenuItem>
              <MenuItem value="liters">liters</MenuItem>
              <MenuItem value="pieces">pieces</MenuItem>
            </Select>
          </FormControl>
          <Typography variant="body2" color='#DAC0A3'>Type</Typography>
          <TextField
            variant="outlined"
            fullWidth
            value={itemType}
            onChange={(e) => setItemType(e.target.value)}
            sx={{
              bgcolor: '#DAC0A3',
              input: { color: '#121212' },
              '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                borderColor: '#F0ECE5'
              }
            }}
          />
          <Typography variant="body2" color='#DAC0A3'>Date Added</Typography>
          <TextField
            type="date"
            variant="outlined"
            fullWidth
            value={itemDate}
            onChange={(e) => setItemDate(e.target.value)}
            sx={{
              bgcolor: '#DAC0A3',
              input: { color: '#121212' },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#F0ECE5'
              }
            }}
          />
          <Typography variant="body2" color='#DAC0A3'>Expiry Date</Typography>
          <TextField
            type="date"
            variant="outlined"
            fullWidth
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            sx={{
              bgcolor: '#DAC0A3',
              input: { color: '#121212' },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#F0ECE5'
              }
            }}
          />
          <Button 
            variant="contained" 
            onClick={addItem}
            sx={{
              bgcolor: '#DAC0A3',
              color: '#121212',
              borderColor: '#E0E0E0',
              fontWeight: 'bold',
              fontSize: '0.9rem', // Adjusted font size
              padding: '8px 16px', // Adjusted padding
            }}
          >
            Add Item
          </Button>
        </Box>
      </Modal>
      
      <Box
        width="100%"
        maxWidth="900px"
        p={2}
        borderRadius={2}
        boxShadow={2}
        display="flex"
        flexDirection="column"
        gap={2}
        bgcolor={"#503C3C"}

      >
        <Box
          height="110px"
          bgcolor="#DAC0A3"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          p={1}
          borderRadius={1}

        >
          <TextField
            variant="outlined"
            fullWidth
            placeholder="SEARCH..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            sx={{
              bgcolor: '#503C3C',
              color: '#DAC0A3',
              input: { color: '#DAC0A3', fontWeight: 'bold', fontSize: '0.9rem' }, // Adjusted font size
              '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                borderColor: '#DAC0A3',
              },
              maxWidth: '80%', // Adjusted max width
              p: '6px', // Adjusted padding
            }}
          />
          <Button
            variant="contained"
            onClick={handleOpen}
            sx={{
              bgcolor: '#503C3C',
              color: '#DAC0A3',
              borderColor: '#E0E0E0',
              fontWeight: 'bold',
              fontSize: '0.1 rem', // Adjusted font size
              padding: '8px 16px', // Adjusted padding
            }}
          >
            Add New Item
          </Button>
        </Box>
       
        <Grid container spacing={1} p={1}>
          {filteredInventory.map(({ name, quantity, quantityUnit, addedDate, expiryDate, type }) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={name}>
              <Box
                width="100%"
                minHeight="120px"
                display="flex"
                flexDirection="column"
                alignItems="flex-start"
                justifyContent="center"
                bgcolor="#DAC0A3"
                padding={1}
                borderRadius={1}
              >
                <Typography variant="body2" color="#121212" mb={0.5} fontWeight="bold">
                  <strong>Item:</strong> {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant="body2" color="#121212" mb={0.5} fontWeight="bold">
                  <strong>Quantity:</strong> {quantity} {quantityUnit}
                </Typography>
                <Typography variant="body2" color="#121212" mb={0.5} fontWeight="bold">
                  <strong>Type:</strong> {type || 'N/A'}
                </Typography>
                <Typography variant="body2" color="#121212" mb={0.5} fontWeight="bold">
                  <strong>Date Added:</strong> {addedDate ? new Date(addedDate).toLocaleDateString() : 'N/A'}
                </Typography>
                <Typography variant="body2" color="#121212" mb={0.5} fontWeight="bold">
                  <strong>Expiry Date:</strong> {expiryDate ? new Date(expiryDate).toLocaleDateString() : 'N/A'}
                </Typography>
                <Stack direction="row" spacing={1} mt={2}>
                  <IconButton
                    color="#121212"
                    onClick={() => incrementQuantity(name)}
                    size="small"
                  >
                    <AddCircleRoundedIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    color="#121212"
                    onClick={() => removeItem(name)}
                    size="small"
                  >
                    <RemoveCircleRoundedIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    color="#121212"
                    onClick={() => deleteItem(name)}
                    size="small"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
