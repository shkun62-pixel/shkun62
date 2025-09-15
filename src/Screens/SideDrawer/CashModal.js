import React, { useState,useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/system';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
const StyledModal = styled(Box)({
    position: 'absolute',
    top: '45%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    height: 600,
    backgroundColor: 'white',
    boxShadow: 24,
    border: '2px solid black',
    padding: 16,
    borderRadius: 10,
});

const LOCAL_STORAGE_KEY = 'rowsDataCashV';
const defaultRows = [
    { name: 'CASH VOUCHER', path: '/CashVoucher' },
    { name: 'RECEIPT BOOK', path: '/CashReceipt' },
];
const CashModal = ({ isOpen, onClose, onNavigate }) => {
    const navigate = useNavigate();
    const [focusedRow, setFocusedRow] = useState(0); // Track the currently focused row
    const [rows, setRows] = useState([]); // Rows from localStorage or default
    const [isEditing, setIsEditing] = useState(false); // Editing state
    const [editValue, setEditValue] = useState(''); // Temp value for editing

 // Load rows from localStorage or use default rows
    useEffect(() => {
        const savedRows = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedRows) {
            setRows(JSON.parse(savedRows));
        } else {
            // Save default rows to localStorage and state if no data exists
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultRows));
            setRows(defaultRows);
        }
    }, []);

    // Save rows to localStorage whenever they change
    const saveRowsToLocalStorage = (updatedRows) => {
        setRows(updatedRows);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedRows));
    };
    const handleNavigation = (path) => {
        navigate(path); // Navigate to the specified path
        if (onNavigate) {
            onNavigate(); // Close the side drawer
        }
        onClose(); // Close the modal
    };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowUp') {
        // Move focus up
        setFocusedRow((prev) => (prev > 0 ? prev - 1 : rows.length - 1));
    } else if (event.key === 'ArrowDown') {
        // Move focus down
        setFocusedRow((prev) => (prev < rows.length - 1 ? prev + 1 : 0));
    } else if (event.key === 'Enter') {
        // Navigate to the selected row's path
        handleNavigation(rows[focusedRow].path);
    }
};
  const startEdit = () => {
        setIsEditing(true);
        setEditValue(rows[focusedRow].name); // Prepopulate the input with the current row's name
    };

    const saveEdit = () => {
        const updatedRows = rows.map((row, index) =>
            index === focusedRow ? { ...row, name: editValue } : row // Update only the focused row
        );
        saveRowsToLocalStorage(updatedRows); // Save updated rows to localStorage
        setIsEditing(false); // Exit edit mode
    };

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            onKeyDown={handleKeyDown}
            tabIndex={0} // Ensure modal is focusable for keyboard events
        >
            <StyledModal>
                <h2 style={{ textAlign: 'center', marginBottom: 20, color: 'black' }}>CASH VOUCHER</h2>
                <TableContainer style={{ border: '1px solid black', height: 400, overflow: 'auto' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    style={{
                                        fontWeight: 'bold',
                                        color: 'black',
                                        backgroundColor: 'grey',
                                        borderBottom: '1px solid black',
                                        borderTop: '1px solid black',
                                    }}
                                >
                                    BOOK NAME
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row, index) => (
                                <TableRow
                                    key={index}
                                    hover
                                    style={{
                                        cursor: 'pointer',
                                        backgroundColor: focusedRow === index ? 'lightblue' : 'white', // Highlight the focused row
                                    }}
                                    onClick={() => handleNavigation(row.path)} // Navigate on row click
                                >
                                    <TableCell style={{ color: 'black' }}>{row.name}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                {isEditing ? (
                    <Box mt={2}>
                        <TextField
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            fullWidth
                            variant="outlined"
                        />
                        <Button
                            onClick={saveEdit}
                            variant="contained"
                            color="primary"
                            style={{ marginTop: 10 }}
                            fullWidth
                        >
                            Save
                        </Button>
                    </Box>
                ) : (
                    <Button
                        onClick={startEdit}
                        variant="contained"
                        color="secondary"
                        style={{ marginTop: 10 }}
                        fullWidth
                    >
                        Edit
                    </Button>
                )}
            </StyledModal>
        </Modal>
    );
};

export default CashModal;