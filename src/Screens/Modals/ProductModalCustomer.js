// import React, { useState, useEffect, useRef } from 'react';
// import Modal from 'react-bootstrap/Modal';
// import Button from 'react-bootstrap/Button';
// import Table from 'react-bootstrap/Table';
// import { TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
// import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// import "./ProductModal.css";
// import LedgerAcc from "../LedgerAcc/LedgerAcc"

// const SelectModal = ({ allFields, selectedFields, handleFieldChange, onClose }) => (
//     <Modal show={true} onHide={onClose}>
//         <Modal.Header closeButton>
//             <Modal.Title>Select Fields</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//             <FormControl fullWidth>
//                 <InputLabel id="field-select-label">Select Fields</InputLabel>
//                 <Select
//                     labelId="field-select-label"
//                     id="field-select"
//                     multiple
//                     value={selectedFields}
//                     onChange={handleFieldChange}
//                     IconComponent={CheckCircleIcon}
//                     className="select-field"
//                     renderValue={(selected) => (
//                         <div>
//                             {selected.map((value) => (
//                                 <span key={value} className="selected-option">{value}</span>
//                             ))}
//                         </div>
//                     )}
//                 >
//                     {allFields.map(field => (
//                         <MenuItem key={field} value={field} className={selectedFields.includes(field) ? 'selected' : ''}>
//                             {field}
//                         </MenuItem>
//                     ))}
//                 </Select>
//             </FormControl>
//         </Modal.Body>
//         <Modal.Footer>
//             <Button variant="secondary" onClick={onClose}>
//                 Close
//             </Button>
//         </Modal.Footer>
//     </Modal>
// );

// const ProductModalCustomer = ({
//     products,
//     onSelect,
//     onClose,
//     allFields,
//     initialKey,
//     onRefresh
// }) => {
//     const [filteredProducts, setFilteredProducts] = useState(products);
//     const [selectedIndex, setSelectedIndex] = useState(0);
//     const [selectedFields, setSelectedFields] = useState(['ahead', 'gstNo', 'add1', 'city', 'pan', ...allFields.filter(field => !['ahead', 'gstNo', 'add1', 'city', 'pan'].includes(field))]);
//     const [searchTerm, setSearchTerm] = useState(initialKey || '');
//     const [searchField, setSearchField] = useState('ahead');
//     const [showSelectModal, setShowSelectModal] = useState(false);
//     const [showLedgerModal, setShowLedgerModal] = useState(false);

//     const inputRef = useRef(null);
//     const tableRef = useRef(null);

//     // Focus search input on open or after modal closes
//     useEffect(() => {
//         if (inputRef.current && !showLedgerModal) inputRef.current.focus();
//     }, [products, showLedgerModal]);

//     // Keep filtered products in sync with searchTerm and products
//     useEffect(() => {
//         if (searchTerm) {
//             const keyword = searchTerm.toLowerCase();
//             const filtered = products.filter(product =>
//                 (product[searchField]?.toLowerCase().includes(keyword)) ||
//                 product.ahead?.toLowerCase().split(' ').some(namePart => namePart.startsWith(keyword))
//             );
//             setFilteredProducts(filtered);
//         } else {
//             setFilteredProducts(products);
//         }
//         setSelectedIndex(0); // Reset index after filter update
//     }, [products, searchTerm, searchField]);

//     // Handle initialKey if passed (for fresh search)
//     useEffect(() => {
//         if (initialKey) setSearchTerm(initialKey);
//     }, [initialKey]);

//     // Scroll highlighted row into view
//     useEffect(() => {
//         if (tableRef.current) {
//             const selectedRow = tableRef.current.querySelector('.highlighted-row');
//             if (selectedRow) selectedRow.scrollIntoView({ block: 'nearest' });
//         }
//     }, [selectedIndex, filteredProducts]);

//     // Keyboard navigation
//     useEffect(() => {
//         const handleKeyDown = (event) => {
//             if (showLedgerModal) return;
//             if (event.key === 'ArrowUp') {
//                 event.preventDefault();
//                 setSelectedIndex(prevIndex => Math.max(prevIndex - 1, 0));
//             } else if (event.key === 'ArrowDown') {
//                 event.preventDefault();
//                 setSelectedIndex(prevIndex => Math.min(prevIndex + 1, filteredProducts.length - 1));
//             } else if (event.key === 'Enter') {
//                 event.preventDefault();
//                 onSelect(filteredProducts[selectedIndex]);
//             }
//         };
//         document.addEventListener('keydown', handleKeyDown);
//         return () => document.removeEventListener('keydown', handleKeyDown);
//     }, [filteredProducts, selectedIndex, onSelect, showLedgerModal]);

//     // Search handler (no filtering here, only update searchTerm)
//     const handleSearch = (e) => {
//         setSearchTerm(e.target.value);
//     };

//     const handleFieldChange = (event) => {
//         setSearchField(event.target.value);
//         setSearchTerm('');
//     };

//     const handleRowClick = (product, index) => {
//         setSelectedIndex(index);
//         onSelect(product);
//     };

//     const handleDataGridScroll = (event) => {
//         event.stopPropagation();
//     };

//     const openLedgerModal = () => setShowLedgerModal(true);

//     // When closing Ledger modal, refresh parent data, reset filter, focus input
//     const handleLedgerModalClose = async () => {
//         setShowLedgerModal(false);
//         if (onRefresh) await onRefresh();
//         setSearchTerm(''); // Show all after new entry (optional)
//         setTimeout(() => {
//             setSelectedIndex(0);
//             if (inputRef.current) inputRef.current.focus();
//         }, 100);
//     };

//     const handleModalHide = () => {
//         onClose();
//     };

//     return (
//         <>
//             <Modal show={true} onHide={handleModalHide} fullscreen className="custom-modal" style={{ marginTop: 20 }}>
//                 <Modal.Header closeButton>
//                     <Modal.Title>LEDGER ACCOUNTS</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <div className="list-container" onScroll={handleDataGridScroll}>
//                         <TableContainer component={Paper} className="table-container">
//                             <Table bordered ref={tableRef}>
//                                 <TableHead style={{ backgroundColor: "lightgray" }}>
//                                     <TableRow>
//                                         {selectedFields.map(field => (
//                                             <TableCell style={{ textTransform: "uppercase" }} key={field}>{field}</TableCell>
//                                         ))}
//                                     </TableRow>
//                                 </TableHead>
//                                 <TableBody>
//                                     {filteredProducts.map((product, index) => (
//                                         <TableRow
//                                             key={index}
//                                             className={selectedIndex === index ? 'highlighted-row' : ''}
//                                             onClick={() => handleRowClick(product, index)}
//                                         >
//                                             {selectedFields.map(field => (
//                                                 <TableCell key={field}>{product[field]}</TableCell>
//                                             ))}
//                                         </TableRow>
//                                     ))}
//                                 </TableBody>
//                             </Table>
//                         </TableContainer>
//                     </div>
//                 </Modal.Body>
//                 <div className='searchdiv' style={{ marginBottom: 10 }}>
//                     <input
//                     type="text"
//                     className="search"
//                     placeholder="Search..."
//                     onChange={handleSearch}
//                     value={searchTerm}
//                     ref={inputRef}
//                     />
//                     <span style={{ fontSize: 17, marginLeft: 20,marginTop:5 }} id="search-field-label">Search By:</span>
//                     <select
//                     className='SearchBy'
//                     labelid="search-field-label"
//                     value={searchField}
//                     onChange={handleFieldChange}
//                     >
//                         {selectedFields.map(field => (
//                             <option key={field} value={field}>
//                                 {field.toUpperCase()}
//                             </option>
//                         ))}
//                     </select>
//                     <div className='buttondiv'>
//                         <Button className='new' onClick={openLedgerModal}>New</Button>
//                         <Button className='modify'>Modify</Button>
//                         <Button className='select'>Select</Button>
//                         <Button className='closebtn' variant="secondary" onClick={handleModalHide}>
//                             Close
//                         </Button>
//                     </div>
//                 </div>
//             </Modal>
//             {showSelectModal && (
//                 <SelectModal
//                     allFields={allFields}
//                     selectedFields={selectedFields}
//                     handleFieldChange={handleFieldChange}
//                     onClose={() => setShowSelectModal(false)}
//                 />
//             )}
//             {showLedgerModal && (
//                 <Modal
//                     dialogClassName="custom-full-width-modal"
//                     show
//                     onHide={() => setShowLedgerModal(false)}
//                     size="lg"
//                     style={{ zIndex: 100000 }}
//                 >
//                     <Modal.Body style={{ marginTop: 10, marginLeft: 10 }}>
//                         <LedgerAcc
//                             onClose={handleLedgerModalClose}
//                             onRefresh={onRefresh}
//                         />
//                     </Modal.Body>
//                 </Modal>
//             )}
//         </>
//     );
// };

// export default ProductModalCustomer;


//ProductModalCustomer 
import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import "./ProductModal.css";
import LedgerAcc from "../LedgerAcc/LedgerAcc"

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
        console.log(res);
        console.log("Tenant:",tenant);
        
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


    // Search handler: fetch new list from backend
    const handleSearch = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setCurrentPage(1);
    await fetchCustomers({ search: value, searchField, page: 1 });
    setSelectedIndex(0);
    };

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
            <Button className='modify'onClick={openLedgerModal}>Modify</Button>
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