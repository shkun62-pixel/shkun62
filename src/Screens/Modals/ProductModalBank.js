
import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import "./ProductModal.css";
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Import check circle icon

const SelectModal = ({ allFields, selectedFields, handleFieldChange, onClose }) => {
    return (
        <Modal show={true} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Select Fields</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FormControl fullWidth>
                    <InputLabel id="field-select-label">Select Fields</InputLabel>
                    <Select
                        labelId="field-select-label"
                        id="field-select"
                        multiple
                        value={selectedFields}
                        onChange={handleFieldChange}
                        IconComponent={CheckCircleIcon} // Use CheckCircleIcon as the select icon
                        MenuProps={{
                            anchorOrigin: {
                                horizontal: "left",
                                vertical: "bottom"
                            },
                            transformOrigin: {
                                vertical: "top",
                                horizontal: "left"
                            },
                            getContentAnchorEl: null
                        }}
                        className="select-field" // Add custom class for styling
                        renderValue={(selected) => (
                            <div>
                                {selected.map((value) => (
                                    <span key={value} className="selected-option">{value}</span>
                                ))}
                            </div>
                        )}
                    >
                        {allFields.map(field => (
                            <MenuItem key={field} value={field} className={selectedFields.includes(field) ? 'selected' : ''}>
                                {field}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};


const ProductModalBank = ({ products, onSelect, onClose, allFields }) => {
    const [filteredProducts, setFilteredProducts] = useState(products);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [selectedFields, setSelectedFields] = useState(allFields); // Initialize selectedFields with all fields
    const inputRef = useRef(null);
    const tableRef = useRef(null);
    const [showSelectModal, setShowSelectModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState(initialKey || ''); // Initialize searchTerm with initialKey

    useEffect(() => {
        inputRef.current.focus();
    }, []);

    useEffect(() => {
        if (tableRef.current) {
            const selectedRow = tableRef.current.querySelector('.highlighted-row');
            if (selectedRow) {
                selectedRow.scrollIntoView({ block: 'nearest' });
            }
        }
    }, [selectedIndex]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'ArrowUp') {
                event.preventDefault();
                setSelectedIndex(prevIndex => Math.max(prevIndex - 1, 0));
            } else if (event.key === 'ArrowDown') {
                event.preventDefault();
                setSelectedIndex(prevIndex => Math.min(prevIndex + 1, filteredProducts.length - 1));
            } else if (event.key === 'Enter') {
                event.preventDefault();
                onSelect(filteredProducts[selectedIndex]);
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [filteredProducts, selectedIndex, onSelect]);

    // Auto-scroll when selectedIndex changes
    useEffect(() => {
    if (!tableRef.current) return;

    const container = document.querySelector(".table-container"); // scrollable wrapper
    if (!container) return;

    const rows = tableRef.current.querySelectorAll("tbody tr");
    if (!rows.length) return;

    const idx = Math.max(0, Math.min(selectedIndex, rows.length - 1));
    const selectedRow = rows[idx];
    if (!selectedRow) return;

    // ---- Heights / positions ----
    const headerOffset = 40; // adjust if needed
    const buffer = 12;

    const rowTop = selectedRow.offsetTop;
    const rowBottom = rowTop + selectedRow.offsetHeight;
    const containerHeight = container.clientHeight;

    // visible area
    const visibleTop = container.scrollTop + buffer + headerOffset;
    const visibleBottom = container.scrollTop + containerHeight - buffer;

    // ---- SCROLL DOWN: row is below view ----
    if (rowBottom > visibleBottom) {
        const newScrollTop = rowBottom - containerHeight + buffer * 2;
        container.scrollTo({ top: newScrollTop, behavior: "smooth" });
    }
    // ---- SCROLL UP: row is above view ----
    else if (rowTop < visibleTop) {
        const newScrollTop = rowTop - headerOffset - buffer;
        container.scrollTo({ top: newScrollTop, behavior: "smooth" });
    }
    }, [selectedIndex, products]);

    // const handleSearch = (e) => {
    //     const keyword = e.target.value.toLowerCase();

    //     // Check if the current input matches any product names
    //     const matchingProduct = products.find(product => product.BankName.toLowerCase().startsWith(keyword));

    //     if (matchingProduct) {
    //         setSearchTerm(e.target.value); // Allow the input to be typed
    //         const filtered = products.filter(product =>
    //             product.BankName.toLowerCase().startsWith(keyword)
    //         );
    //         setFilteredProducts(filtered);
    //         setSelectedIndex(0);
    //     } else {
    //         // Prevent the input from being typed if no match is found
    //         e.preventDefault();
    //     }
    // };

    const handleSearch = (e) => {
        const keyword = e.target.value.toLowerCase();
    
        // Check if the current input matches any part of the product name (first name or surname)
        const matchingProduct = products.find(product => 
            product.BankName.toLowerCase().split(' ').some(namePart => namePart.startsWith(keyword))
        );
        console.log(matchingProduct);
    
        if (matchingProduct) {
            setSearchTerm(e.target.value); // Allow the input to be typed
            const filtered = products.filter(product =>
                product.BankName.toLowerCase().split(' ').some(namePart => namePart.startsWith(keyword))
            );
            setFilteredProducts(filtered);
            setSelectedIndex(0);
        } else {
            // Prevent the input from being typed if no match is found
            e.target.value = searchTerm;
        }
    };

    const handleRowClick = (product, index) => {
        setSelectedIndex(index);
        onSelect(product);
    };

    const handleFieldChange = (event) => {
        const { value } = event.target;
        setSelectedFields(value);
    };

    const handleDataGridScroll = (event) => {
        event.stopPropagation(); // Prevent scroll event from reaching the select component
    };

    return (
        <>
            <Modal show={true} onHide={onClose} fullscreen style={{ height: "80%", marginTop: 80 }}>
                <Modal.Header closeButton>
                    <Modal.Title>Select Bank</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* <Button variant="primary" onClick={() => setShowSelectModal(true)}>Select Fields</Button> */}
                    <input
                        type="text"
                        className="form-control mb-3"
                        placeholder="Search..."
                        onChange={handleSearch}
                        ref={inputRef}
                    />
                    <div className="list-container" onScroll={handleDataGridScroll}>
                        <TableContainer component={Paper} className="table-container">
                            <Table size="small" ref={tableRef}>
                                <TableHead>
                                    <TableRow>
                                        {/* Dynamically generate table headers based on selected fields */}
                                        {selectedFields.map(field => (
                                            <TableCell key={field}>{field}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredProducts.map((product, index) => (
                                        <TableRow
                                            key={index}
                                            className={selectedIndex === index ? 'highlighted-row' : ''}
                                            onClick={() => handleRowClick(product, index)}
                                        >
                                            {/* Render cells based on selected fields */}
                                            {selectedFields.map(field => (
                                                <TableCell key={field}>{product[field]}</TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            {showSelectModal && (
                <SelectModal
                    allFields={allFields}
                    selectedFields={selectedFields}
                    handleFieldChange={handleFieldChange}
                    onClose={() => setShowSelectModal(false)}
                />
            )}
        </>
    );
};

export default ProductModalBank;
