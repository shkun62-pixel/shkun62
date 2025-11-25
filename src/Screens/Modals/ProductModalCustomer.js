//ProductModalCustomer 
import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import "./ProductModal.css";
import LedgerAcc from "../LedgerAcc/LedgerAcc"
import { useNavigate } from "react-router-dom";

const ProductModalCustomer = ({
    allFields,
    onSelect,
    onClose,
    initialKey,
    tenant,          // NEW: must be passed from parent!
    onRefresh
}) => {

    const [products, setProducts] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [searchTerm, setSearchTerm] = useState(initialKey || '');
    const [searchField, setSearchField] = useState('ahead');
    const [showLedgerModal, setShowLedgerModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef(null);
    const tableRef = useRef(null);
    const navigate = useNavigate();

    const [showFieldModal, setShowFieldModal] = useState(false);
    const FIELD_STORAGE_KEY = `customer2_modal_fields_${tenant}`;
    const [selectedFields, setSelectedFields] = useState(() => {
    const saved = localStorage.getItem(FIELD_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
    });
    // const FIELD_STORAGE_KEY = `customer_modal_fields_${tenant}`;
    const allAvailableFields = useRef([]);
    const fieldOrder = [
  'ahead', 'gstNo', 'add1', 'city', 'pan', // your preferred fields first
  // fallback or extra fields will be added later if present in data
];


   useEffect(() => {
  if (products.length) {
    const uniqueFields = [...new Set(products.flatMap(p => Object.keys(p)))];

    const orderedFields = fieldOrder.filter(field => uniqueFields.includes(field));
    const remainingFields = uniqueFields.filter(field => !fieldOrder.includes(field));

    allAvailableFields.current = [...orderedFields, ...remainingFields];

    if (selectedFields.length === 0) {
      setSelectedFields([...orderedFields, ...remainingFields]);
    }
  }
}, [products]);


    useEffect(() => {
        localStorage.setItem(FIELD_STORAGE_KEY, JSON.stringify(selectedFields));
    }, [selectedFields]);
  

    // Backend paginated fetch
    const fetchCustomers = async ({ search = '', searchField = 'ahead', page = 1, append = false } = {}) => {
    setIsLoading(true);
    try {
        const url = `https://www.shkunweb.com/shkunlive/${tenant}/tenant/api/ledgerAccount?search=${encodeURIComponent(search)}&searchField=${encodeURIComponent(searchField)}&page=${page}&limit=30`;
        const res = await fetch(url);
        // console.log(res);
        // console.log("Tenant:",tenant);
        
        if (!res.ok) throw new Error('Failed to fetch');
        const result = await res.json();
        const formattedData = result.data.map(item => ({
            ...item.formData,
            _id: item._id,
        }));
        if (append) {
            setProducts(prev => [...prev, ...formattedData]);
        } else {
            setProducts(formattedData);
        }
        setTotalRecords(result.total);
        setCurrentPage(page);
    } catch (err) {
        // Handle error if needed
    }
    setIsLoading(false);
    };

    // Focus search box on open
    useEffect(() => {
        if (inputRef.current && !showLedgerModal) inputRef.current.focus();
    }, [products, showLedgerModal]);

    // Fetch customers every time initialKey changes (modal open with a typed key)
    useEffect(() => {
        if (initialKey !== undefined && initialKey !== null) {
            setSearchTerm(initialKey);
            setCurrentPage(1);
            fetchCustomers({ search: initialKey, searchField, page: 1 });
            setSelectedIndex(0);
        }
        // eslint-disable-next-line
    }, [initialKey, searchField, tenant]);

    // Keyboard navigation
    useEffect(() => {
    const handleKeyDown = (event) => {
        if (showLedgerModal) return;
        if (event.key === 'ArrowUp') {
            event.preventDefault();
            setSelectedIndex(prevIndex => Math.max(prevIndex - 1, 0));
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            setSelectedIndex(prevIndex => Math.min(prevIndex + 1, products.length - 1));
        } else if (event.key === 'Enter') {
            event.preventDefault();
            onSelect(products[selectedIndex]);
        }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
    }, [products, selectedIndex, onSelect, showLedgerModal]);

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


    // Search handler: fetch new list from backend
    const handleSearch = async (e) => {
    const value = e.target.value;

    // Empty always allowed
    if (value === "") {
        setSearchTerm("");
        setCurrentPage(1);
        await fetchCustomers({ search: "", searchField, page: 1 });
        setSelectedIndex(0);
        return;
    }

    // Check if ANY product in current list has the searchField starting with value
    const hasMatch = products.some((p) => {
        const fieldVal = String(p[searchField] || "").toLowerCase();
        return fieldVal.startsWith(value.toLowerCase()); // ✅ prefix match
    });

    if (hasMatch) {
        setSearchTerm(value);
        setCurrentPage(1);
        await fetchCustomers({ search: value, searchField, page: 1 });
        setSelectedIndex(0);
    }
    // else: ignore (block wrong typing)
    };

    // const handleSearch = async (e) => {
    // const value = e.target.value;
    // setSearchTerm(value);
    // setCurrentPage(1);
    // await fetchCustomers({ search: value, searchField, page: 1 });
    // setSelectedIndex(0);
    // };

    const handleFieldChange = async (event) => {
    const field = event.target.value;
    setSearchField(field);
    setSearchTerm('');
    setCurrentPage(1);
    await fetchCustomers({ search: '', searchField: field, page: 1 });
    };

    const handleRowClick = (product, index) => {
    setSelectedIndex(index);
    onSelect(product);
    };

    const handleLoadMore = async () => {
    if (products.length >= totalRecords) return;
    const nextPage = currentPage + 1;
    await fetchCustomers({ search: searchTerm, searchField, page: nextPage, append: true });
    };

    const openLedgerModal = () => setShowLedgerModal(true);

    const handleLedgerModalClose = async () => {
    setShowLedgerModal(false);
    setCurrentPage(1);

    if (searchTerm && searchTerm.trim() !== "") {
        await fetchCustomers({ search: searchTerm, searchField, page: 1 });
    } else {
        await fetchCustomers({ search: "", searchField, page: 1 });
    }

    setTimeout(() => {
        setSelectedIndex(0);
        if (inputRef.current) inputRef.current.focus();
    }, 100);

    if (onRefresh) await onRefresh();
    };

    const handleModify = () => {
    if (!products[selectedIndex]) {
        alert("Please select a row first!");
        return;
    }

    const selectedProduct = products[selectedIndex];

    navigate("/LedgerAcc", { state: { ledgerId: selectedProduct._id, rowIndex: selectedIndex } });
};

 
    return (
    <>
    <Modal show={true} onHide={onClose} fullscreen className="custom-modal" style={{ marginTop: 20 }}>
        <Modal.Header closeButton>
        <Modal.Title>LEDGER ACCOUNTS</Modal.Title>
        <Button variant="info" style={{marginLeft:"70%"}}  onClick={() => setShowFieldModal(true)}>Fields</Button>
        </Modal.Header>
        <Modal.Body>
        <div className="list-container">
            <TableContainer component={Paper} className="table-container">
                <Table bordered ref={tableRef}>
                    <TableHead style={{ backgroundColor: "lightgray" }}>
                        <TableRow>
                            {selectedFields.map(field => (
                                <TableCell style={{ textTransform: "uppercase" }} key={field}>{field}</TableCell>
                            ))}
                             <th>Action</th> {/* This is the new column header */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product, index) => (
                            <TableRow
                                key={product._id || index}
                                className={selectedIndex === index ? 'highlighted-row' : ''}
                                onClick={() => handleRowClick(product, index)}
                            >
                                {selectedFields.map(field => (
                                    <TableCell key={field}>{product[field]}</TableCell>
                                ))}
                                <td>
                                <Button
                                    size="sm"
                                    variant="primary"
                                    // onClick={() => handleSelect(product)}
                                >
                                    Select
                                </Button>
                                </td> {/* This is the new column cell */}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {products.length < totalRecords && (
                <Button
                    onClick={handleLoadMore}
                    disabled={isLoading}
                    style={{ margin: '15px auto', display: 'block' }}
                    variant="outline-primary"
                >
                    {isLoading ? "Loading..." : "Load More"}
                </Button>
            )}
        </div>
        </Modal.Body>
        <div className='searchdiv' style={{ marginBottom: 10 }}>
            <input
                type="text"
                className="search"
                placeholder="Search..."
                onChange={handleSearch}
                value={searchTerm}
                ref={inputRef}
            />
            <text style={{ fontSize: 20, marginLeft: 20 }} id="search-field-label">Search By:</text>
            <select
                style={{ width: 200, height: 30, marginLeft: 10, border: "1px solid black" }}
                labelid="search-field-label"
                value={searchField}
                onChange={handleFieldChange}
            >
                {selectedFields.map(field => (
                    <option key={field} value={field}>
                        {field.toUpperCase()}
                    </option>
                ))}
            </select>
            <div className='buttondiv'>
            <Button className='new' onClick={openLedgerModal}>New</Button>
            <Button className='modify' onClick={handleModify}>Modify</Button>
            <Button className='select'>Select</Button>
            <Button className='closebtn' variant="secondary" onClick={onClose}>Close</Button>
            </div>
        </div>
        </Modal>
        {showLedgerModal && (
        <Modal
            dialogClassName="custom-full-width-modal"
            show
            onHide={handleLedgerModalClose} // <-- this is key!
            size="lg"
            style={{ zIndex: 100000,marginTop:-25 }}
        >
            <Modal.Body style={{ marginTop: 10, marginLeft: 10 }}>
            <LedgerAcc
                onClose={handleLedgerModalClose} // <-- pass this!
                onRefresh={onRefresh}
            />
            </Modal.Body>
        </Modal>
        )}
        <Modal style={{ zIndex: 100000 }} show={showFieldModal} onHide={() => setShowFieldModal(false)}>
        <Modal.Header closeButton>
            <Modal.Title>Select Fields to Show</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '500px', overflowY: 'auto' }}>
            {allAvailableFields.current.map((field) => (
            <div key={field}>
                <input
                type="checkbox"
                checked={selectedFields.includes(field)}
                onChange={() => {
                    if (selectedFields.includes(field)) {
                    setSelectedFields(selectedFields.filter(f => f !== field));
                    } else {
                    setSelectedFields([...selectedFields, field]);
                    }
                }}
                />
                <label style={{ marginLeft: 8 }}>{field}</label>
            </div>
            ))}
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowFieldModal(false)}>
            Done
            </Button>
        </Modal.Footer>
        </Modal>
    </>
    );
};

export default ProductModalCustomer;