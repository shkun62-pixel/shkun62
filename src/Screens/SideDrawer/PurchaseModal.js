import React, { useState } from 'react';
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

const StyledModal = styled(Box)({
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    height: 500,
    backgroundColor: 'white',
    boxShadow: 24,
    border: '2px solid black',
    padding: 16,
    borderRadius: 10,
});

const PurchaseModal = ({ isOpen, onClose, onNavigate }) => {
    const navigate = useNavigate();
    const [focusedRow, setFocusedRow] = useState(0); // Track the currently focused row

    const rows = [
        { name: 'PURCHASE GST', path: '/Purchase' },
        { name: 'PURCHASE GST SERVICE', path: '/PurchaseService' },
    ];

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

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            onKeyDown={handleKeyDown}
            tabIndex={0} // Ensure modal is focusable for keyboard events
        >
            <StyledModal>
                <h2 style={{ textAlign: 'center', marginBottom: 20, color: 'black' }}>SALE</h2>
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
            </StyledModal>
        </Modal>
    );
};

export default PurchaseModal;